import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { callOpenRouter } from '@/lib/openrouter/client'
import { checkQuota } from '@/lib/quotas/check'
import { getModelById } from '@/lib/openrouter/models'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'No autenticado' }, { status: 401 })

  const { messages, modelId, conversationId, agentSlug } = await req.json()

  if (!messages?.length || !modelId) {
    return Response.json({ error: 'Faltan parámetros' }, { status: 400 })
  }

  // 1. Verificar cuota
  const quota = await checkQuota(user.id, modelId)
  if (!quota.allowed) {
    return Response.json({ error: quota.reason }, { status: 429 })
  }

  const activeModel = quota.fallbackModel ?? modelId

  // 2. Llamar a OpenRouter con streaming
  const start = Date.now()
  let response: Response
  try {
    response = await callOpenRouter({ model: activeModel, messages, stream: true })
  } catch (err) {
    console.error('[chat] OpenRouter error:', err)
    return Response.json({ error: 'Error al conectar con el modelo de IA' }, { status: 502 })
  }

  if (!response.body) {
    return Response.json({ error: 'Sin respuesta del modelo' }, { status: 502 })
  }

  // 3. Stream al cliente + capturar tokens al final
  const admin = createAdminClient()
  let fullContent = ''
  let tokensInput = 0
  let tokensOutput = 0

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

          for (const line of lines) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const delta = parsed.choices?.[0]?.delta?.content
              if (delta) {
                fullContent += delta
                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content: delta })}\n\n`))
              }
              // Capturar usage si viene en el último chunk
              if (parsed.usage) {
                tokensInput = parsed.usage.prompt_tokens ?? 0
                tokensOutput = parsed.usage.completion_tokens ?? 0
              }
            } catch {}
          }
        }
      } finally {
        controller.close()

        // 4. Guardar mensaje assistant y actualizar logs (async, no bloquea el stream)
        const latency = Date.now() - start
        const model = getModelById(activeModel)
        const costUsd = model
          ? (tokensInput * model.cost_input_per_1m / 1_000_000) + (tokensOutput * model.cost_output_per_1m / 1_000_000)
          : 0

        if (conversationId && fullContent) {
          await admin.from('messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: fullContent,
            model_id: activeModel,
            tokens_input: tokensInput,
            tokens_output: tokensOutput,
            cost_usd: costUsd,
          })

          // Actualizar título si es el primer mensaje
          const { data: conv } = await admin.from('conversations').select('title').eq('id', conversationId).single()
          if (!conv?.title && messages.length === 1) {
            const title = messages[0].content.slice(0, 60)
            await admin.from('conversations').update({ title }).eq('id', conversationId)
          }
        }

        // Log de uso
        const { data: profile } = await admin.from('profiles').select('department').eq('id', user.id).single()
        await admin.from('usage_logs').insert({
          user_id: user.id,
          conversation_id: conversationId ?? null,
          model_id: activeModel,
          tokens_input: tokensInput,
          tokens_output: tokensOutput,
          cost_usd: costUsd,
          latency_ms: latency,
          agent_slug: agentSlug ?? null,
          department: profile?.department ?? null,
        })

        // Incrementar cuota
        try {
          await admin.rpc('increment_user_quota', {
            p_user_id: user.id,
            p_tokens: tokensInput + tokensOutput,
            p_cost: costUsd,
          })
        } catch {}
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
