'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChatMessages, ChatMessage } from '@/components/hub/ChatMessages'
import { ChatInput, type Attachment } from '@/components/hub/ChatInput'
import { ModelSelector } from '@/components/hub/ModelSelector'
import { ConversationSidebar } from '@/components/hub/ConversationSidebar'
import { Icon, ICONS } from '@/components/ui/Icon'
import { createClient } from '@/lib/supabase/client'
import { AGENTS } from '@/lib/agents/system-prompts'
import Link from 'next/link'

type IconName = keyof typeof ICONS

const AGENT_ICONS: Record<string, IconName> = {
  'comercial':       'target',
  'marketing':       'megaphone',
  'social-media':    'smartphone',
  'eventos':         'calendar',
  'licitaciones':    'clipboard',
  'fondos-europeos': 'globe',
  'desarrollo-web':  'code',
  'it-sistemas':     'server',
  'rrhh':            'users',
  'direccion':       'award',
}

interface Conversation {
  id: string
  title: string | null
  updated_at: string
}

interface Props {
  conversationId: string
  initialMessages: ChatMessage[]
  conversations: Conversation[]
  agentSlug?: string | null
  userRole?: string
  userName?: string
  canUsePaidModels?: boolean
}

const DEFAULT_MODEL = 'meta-llama/llama-3.1-8b-instruct:free'

const EXAMPLE_PROMPTS = [
  { icon: 'file-text' as const, label: 'Redactar un email',      prompt: 'Redacta un email profesional para presentar nuestra agencia a un nuevo cliente potencial' },
  { icon: 'clipboard' as const, label: 'Analizar licitación',    prompt: 'Ayúdame a analizar los requisitos clave de un pliego de licitación pública' },
  { icon: 'megaphone' as const, label: 'Campaña de marketing',   prompt: 'Crea una estrategia de contenido para redes sociales para una empresa del sector público' },
  { icon: 'lightbulb' as const, label: 'Generar ideas',          prompt: 'Dame 10 ideas creativas para una campaña de comunicación institucional' },
]

export function ChatPageClient({
  conversationId,
  initialMessages,
  conversations,
  agentSlug,
  userRole = 'basic',
  userName,
  canUsePaidModels = false,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const agent = agentSlug ? AGENTS.find(a => a.slug === agentSlug) : null
  const firstName = userName?.split(' ')[0] ?? 'usuario'

  // Auto-send ?prompt= from agent example clicks
  useEffect(() => {
    const prompt = searchParams.get('prompt')
    if (prompt && messages.length === 0) {
      handleSend(prompt)
      // Remove param from URL without re-render
      const url = new URL(window.location.href)
      url.searchParams.delete('prompt')
      window.history.replaceState({}, '', url.toString())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 13) return 'Buenos días'
    if (h < 20) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const handleSend = useCallback(async (content: string, attachments?: Attachment[]) => {
    if (isLoading) return

    // Construir contenido con adjuntos como texto
    let fullContent = content
    if (attachments && attachments.length > 0) {
      const attachText = attachments
        .filter(a => !a.type.startsWith('image/'))
        .map(a => `\n\n[Archivo adjunto: ${a.name}]\n${a.content}`)
        .join('')
      fullContent = content + attachText
    }

    const userMessage: ChatMessage = { role: 'user', content: fullContent }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setIsLoading(true)

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: fullContent,
    })

    const payload = nextMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payload,
          modelId: selectedModel,
          conversationId,
          agentSlug,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `⚠️ Error: ${err.error ?? 'Algo salió mal. Inténtalo de nuevo.'}`,
        }])
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n').filter(l => l.startsWith('data: '))) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.content) {
              assistantContent += data.content
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
                return updated
              })
            }
          } catch {}
        }
      }

      router.refresh()
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Error de conexión. Verifica tu conexión a internet.',
      }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, selectedModel, conversationId, agentSlug, supabase, router])

  const handleNewConversation = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: conv } = await supabase
      .from('conversations')
      .insert({ user_id: user?.id })
      .select('id')
      .single()
    if (conv) router.push(`/hub/${conv.id}`)
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex h-full bg-[#f4f4f6]">
      {/* Conversation history sidebar */}
      <ConversationSidebar conversations={conversations} onNew={handleNewConversation} />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Agent banner + model selector */}
        <div className="bg-white border-b border-[#e5e5ea] px-5 py-2.5 flex items-center gap-3">
          {agent && (
            <>
              <Link
                href={`/agentes/${agent.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-violet-700 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors shrink-0"
              >
                <Icon name={AGENT_ICONS[agent.slug] ?? 'agent'} size={14} className="text-violet-600" />
                {agent.name}
              </Link>
              <div className="w-px h-5 bg-[#e5e5ea]" />
            </>
          )}
          <ModelSelector value={selectedModel} onChange={setSelectedModel} userRole={userRole} canUsePaidModels={canUsePaidModels} />
        </div>

        {isEmpty ? (
          /* Empty state — greeting + orb + input centered */
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
            {agent ? (
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-6">
                <Icon name={AGENT_ICONS[agent.slug] ?? 'agent'} className="text-violet-600" size={30} />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full mb-6 relative" style={{
                background: 'radial-gradient(circle at 35% 35%, #c084fc, #7c3aed 60%, #4c1d95)',
                boxShadow: '0 8px 32px rgba(124,58,237,0.35), inset 0 -4px 8px rgba(0,0,0,0.2)',
              }} />
            )}

            <h1 className="text-3xl font-semibold text-gray-900 text-center leading-tight mb-1">
              {agent ? agent.name : `${getGreeting()}, ${firstName}`}
            </h1>
            <p className="text-xl text-violet-600 font-medium text-center mb-10">
              {agent ? agent.description : '¿En qué puedo ayudarte?'}
            </p>

            {/* Main input */}
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl border border-[#e5e5ea] shadow-sm overflow-hidden">
                <ChatInput
                  onSend={handleSend}
                  disabled={isLoading}
                  placeholder={agent ? `Pregunta algo al ${agent.name}...` : 'Pregunta algo a la IA o haz una petición...'}
                  borderless
                />
              </div>

              {/* Example prompts — only shown when an agent is active */}
              {agent && (
                <div className="mt-5">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                    Empieza con un ejemplo
                  </p>
                  <div className="space-y-2">
                    {agent.examples.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(example)}
                        className="w-full text-left bg-white border border-[#e5e5ea] rounded-xl px-4 py-3 hover:border-violet-300 hover:bg-violet-50 transition-all group flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="lightbulb" size={12} className="text-violet-600" />
                        </div>
                        <span className="text-sm text-gray-700 group-hover:text-violet-800">{example}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Active conversation */
          <>
            <ChatMessages messages={messages} isLoading={isLoading} />
            <ChatInput onSend={handleSend} disabled={isLoading} placeholder="Escribe un mensaje o adjunta un archivo..." />
          </>
        )}
      </div>
    </div>
  )
}
