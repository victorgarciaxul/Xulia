'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AGENTS } from '@/lib/agents/system-prompts'
import { Icon, ICONS } from '@/components/ui/Icon'
import { createClient } from '@/lib/supabase/client'
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
  params: Promise<{ slug: string }>
}

export default function AgentProfilePage({ params }: Props) {
  const { slug } = use(params)
  const agent = AGENTS.find(a => a.slug === slug)
  const router = useRouter()
  const supabase = createClient()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!agent) return
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('conversations')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .eq('agent_slug', slug)
        .order('updated_at', { ascending: false })
        .limit(20)
      setConversations(data ?? [])
      setLoadingConvs(false)
    }
    load()
  }, [slug, agent, supabase])

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Agente no encontrado
      </div>
    )
  }

  const iconName = AGENT_ICONS[agent.slug] ?? 'agent'

  const handleNewConversation = async (startPrompt?: string) => {
    setStarting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: conv } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: agent.name, agent_slug: slug })
      .select('id')
      .single()
    if (conv) {
      router.push(`/hub/${conv.id}${startPrompt ? `?prompt=${encodeURIComponent(startPrompt)}` : ''}`)
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 86400000) return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    if (diff < 604800000) return d.toLocaleDateString('es-ES', { weekday: 'short' })
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="flex h-full min-h-0 bg-[#f4f4f6]">
      {/* Left panel — agent profile */}
      <div className="w-80 shrink-0 bg-white border-r border-[#e5e5ea] flex flex-col overflow-y-auto">
        {/* Back */}
        <div className="px-5 pt-4 pb-3 border-b border-[#e5e5ea]">
          <Link href="/agentes" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            <Icon name="chevron-left" size={12} />
            Todos los agentes
          </Link>
        </div>

        {/* Agent header */}
        <div className="px-5 py-6 border-b border-[#e5e5ea]">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
            <Icon name={iconName} className="text-violet-600" size={26} />
          </div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">{agent.name}</h1>
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{agent.description}</p>

          <button
            onClick={() => handleNewConversation()}
            disabled={starting}
            className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Icon name="plus" size={14} />
            {starting ? 'Iniciando...' : 'Nueva conversación'}
          </button>
        </div>

        {/* Capabilities */}
        <div className="px-5 py-4 border-b border-[#e5e5ea]">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Capacidades</h3>
          <ul className="space-y-2">
            {agent.capabilities.map((cap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                {cap}
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-full capitalize">
              {agent.category}
            </span>
            {agent.use_rag && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Icon name="book" size={10} />
                Conocimiento corporativo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right panel — conversations + examples */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full px-6 py-8">

          {/* Example prompts */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Empieza con un ejemplo
            </h2>
            <div className="space-y-2.5">
              {agent.examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleNewConversation(example)}
                  disabled={starting}
                  className="w-full text-left bg-white border border-[#e5e5ea] rounded-xl px-4 py-3.5 hover:border-violet-300 hover:bg-violet-50 transition-all group disabled:opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-violet-200 transition-colors">
                      <Icon name="lightbulb" size={12} className="text-violet-600" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-violet-800 leading-relaxed">{example}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Past conversations */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Conversaciones anteriores
            </h2>
            {loadingConvs ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 bg-white rounded-xl border border-[#e5e5ea] animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="bg-white border border-[#e5e5ea] rounded-xl px-5 py-8 text-center">
                <Icon name="chat" size={24} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Todavía no has hablado con este agente.</p>
                <p className="text-xs text-gray-300 mt-1">Usa los ejemplos de arriba o inicia una conversación nueva.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map(conv => (
                  <Link
                    key={conv.id}
                    href={`/hub/${conv.id}`}
                    className="flex items-center justify-between bg-white border border-[#e5e5ea] rounded-xl px-4 py-3.5 hover:border-violet-300 hover:bg-violet-50 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Icon name="chat" size={14} className="text-violet-500" />
                      </div>
                      <span className="text-sm text-gray-700 truncate group-hover:text-violet-800">
                        {conv.title ?? 'Conversación sin título'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-3">{formatDate(conv.updated_at)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
