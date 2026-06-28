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
      const url = new URL(window.location.href)
      url.searchParams.delete('prompt')
      window.history.replaceState({}, '', url.toString())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-send when navigated from /hub with a pre-saved user message
  useEffect(() => {
    if (
      initialMessages.length === 1 &&
      initialMessages[0].role === 'user' &&
      messages.length === 1 &&
      !isLoading
    ) {
      handleSendFromInitial(initialMessages[0].content)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 13) return 'Buenos días'
    if (h < 20) return 'Buenas tardes'
    return 'Buenas noches'
  }

  // Called when arriving from /hub with a pre-saved message — skips DB insert
  const handleSendFromInitial = useCallback(async (content: string) => {
    setIsLoading(true)
    const payload = [{ role: 'user', content }]
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload, modelId: selectedModel, conversationId, agentSlug }),
      })
      if (!res.ok) {
        const err = await res.json()
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${err.error ?? 'Algo salió mal.'}` }])
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
              setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: assistantContent }; return u })
            }
          } catch {}
        }
      }
      router.refresh()
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error de conexión.' }])
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel, conversationId, agentSlug])

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

  const handleNewConversation = () => {
    router.push('/hub')
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
              <div className="mb-6 relative" style={{ width: 96, height: 96 }}>
                <style>{`
                  @keyframes robotFloat {
                    0%, 100% { transform: translateY(0px) rotateY(0deg); }
                    25% { transform: translateY(-6px) rotateY(15deg); }
                    50% { transform: translateY(-3px) rotateY(0deg); }
                    75% { transform: translateY(-6px) rotateY(-15deg); }
                  }
                  @keyframes robotGlow {
                    0%, 100% { filter: drop-shadow(0 0 12px rgba(139,92,246,0.6)) drop-shadow(0 0 24px rgba(109,40,217,0.4)); }
                    50% { filter: drop-shadow(0 0 20px rgba(167,139,250,0.9)) drop-shadow(0 0 40px rgba(139,92,246,0.5)); }
                  }
                  @keyframes eyeBlink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95% { transform: scaleY(0.1); }
                  }
                  @keyframes eyeGlow {
                    0%, 100% { opacity: 0.9; }
                    50% { opacity: 1; filter: brightness(1.4); }
                  }
                  @keyframes scanLine {
                    0% { transform: translateY(0px); opacity: 0.6; }
                    100% { transform: translateY(56px); opacity: 0; }
                  }
                  @keyframes antennaPulse {
                    0%, 100% { opacity: 0.5; r: 2.5; }
                    50% { opacity: 1; r: 4; }
                  }
                  .robot-float { animation: robotFloat 4s ease-in-out infinite, robotGlow 3s ease-in-out infinite; }
                  .eye-blink { animation: eyeBlink 5s ease-in-out infinite; transform-origin: center; }
                  .eye-glow { animation: eyeGlow 2s ease-in-out infinite; }
                  .scan-line { animation: scanLine 2.5s linear infinite; }
                  .antenna-pulse { animation: antennaPulse 1.5s ease-in-out infinite; }
                `}</style>
                <svg
                  viewBox="0 0 96 96"
                  width="96"
                  height="96"
                  className="robot-float"
                  style={{ perspective: '200px' }}
                >
                  <defs>
                    <radialGradient id="headGrad" cx="38%" cy="32%" r="65%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="45%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#3b0764" />
                    </radialGradient>
                    <radialGradient id="faceGrad" cx="40%" cy="35%" r="60%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="60%" stopColor="#6d28d9" />
                      <stop offset="100%" stopColor="#2e1065" />
                    </radialGradient>
                    <radialGradient id="eyeGradL" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#e0f2fe" />
                      <stop offset="40%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </radialGradient>
                    <radialGradient id="eyeGradR" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#e0f2fe" />
                      <stop offset="40%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </radialGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="mouthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                    </linearGradient>
                    <clipPath id="faceClip">
                      <rect x="18" y="22" width="60" height="56" rx="10" />
                    </clipPath>
                  </defs>

                  {/* Antenna */}
                  <line x1="48" y1="22" x2="48" y2="10" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="48" cy="8" r="3.5" fill="#a78bfa" className="antenna-pulse" />

                  {/* Head */}
                  <rect x="16" y="22" width="64" height="58" rx="12" fill="url(#headGrad)" />

                  {/* Face panel */}
                  <rect x="20" y="27" width="56" height="48" rx="8" fill="url(#faceGrad)" opacity="0.85" />

                  {/* Scan line effect */}
                  <rect x="20" y="27" width="56" height="3" fill="#a78bfa" opacity="0.3" className="scan-line" clipPath="url(#faceClip)" />

                  {/* Left eye */}
                  <g className="eye-blink" style={{ transformOrigin: '34px 45px' }}>
                    <circle cx="34" cy="45" r="8" fill="#0f172a" />
                    <circle cx="34" cy="45" r="6" fill="url(#eyeGradL)" className="eye-glow" filter="url(#glow)" />
                    <circle cx="34" cy="45" r="2.5" fill="#0ea5e9" />
                    <circle cx="31.5" cy="42.5" r="1.5" fill="white" opacity="0.8" />
                  </g>

                  {/* Right eye */}
                  <g className="eye-blink" style={{ transformOrigin: '62px 45px' }}>
                    <circle cx="62" cy="45" r="8" fill="#0f172a" />
                    <circle cx="62" cy="45" r="6" fill="url(#eyeGradR)" className="eye-glow" filter="url(#glow)" />
                    <circle cx="62" cy="45" r="2.5" fill="#0ea5e9" />
                    <circle cx="59.5" cy="42.5" r="1.5" fill="white" opacity="0.8" />
                  </g>

                  {/* Nose dot */}
                  <circle cx="48" cy="55" r="1.5" fill="#a78bfa" opacity="0.6" />

                  {/* Mouth / speaker grille */}
                  <rect x="30" y="62" width="36" height="7" rx="3.5" fill="#0f172a" />
                  <rect x="32" y="63.5" width="32" height="4" rx="2" fill="url(#mouthGrad)" />
                  {[36, 42, 48, 54, 58].map((x) => (
                    <line key={x} x1={x} y1="63.5" x2={x} y2="67.5" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
                  ))}

                  {/* Ear bolts */}
                  <circle cx="16" cy="44" r="4" fill="#6d28d9" stroke="#a78bfa" strokeWidth="1" />
                  <circle cx="16" cy="44" r="2" fill="#38bdf8" opacity="0.6" />
                  <circle cx="80" cy="44" r="4" fill="#6d28d9" stroke="#a78bfa" strokeWidth="1" />
                  <circle cx="80" cy="44" r="2" fill="#38bdf8" opacity="0.6" />

                  {/* Highlight shine */}
                  <ellipse cx="36" cy="28" rx="14" ry="5" fill="white" opacity="0.08" />
                </svg>
              </div>
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
