const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface CallOptions {
  model: string
  messages: ChatMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export async function callOpenRouter({ model, messages, stream = false, temperature = 0.7, max_tokens }: CallOptions) {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': process.env.NEXT_PUBLIC_APP_NAME ?? 'XULIA',
    },
    body: JSON.stringify({ model, messages, stream, temperature, ...(max_tokens && { max_tokens }) }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${error}`)
  }

  return res
}
