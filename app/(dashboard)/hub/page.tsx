'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ModelSelector } from '@/components/hub/ModelSelector'
import { ConversationSidebar } from '@/components/hub/ConversationSidebar'
import { useEffect } from 'react'

const DEFAULT_MODEL = 'meta-llama/llama-3.1-8b-instruct:free'

const EXAMPLE_PROMPTS = [
  { icon: '✉️', label: 'Redactar un email', prompt: 'Redacta un email profesional para presentar nuestra agencia a un nuevo cliente potencial' },
  { icon: '📋', label: 'Analizar licitación', prompt: 'Ayúdame a analizar los requisitos clave de un pliego de licitación pública' },
  { icon: '📣', label: 'Campaña de marketing', prompt: 'Crea una estrategia de contenido para redes sociales para una empresa del sector público' },
  { icon: '💡', label: 'Generar ideas', prompt: 'Dame 10 ideas creativas para una campaña de comunicación institucional' },
]

export default function HubPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [conversations, setConversations] = useState<{ id: string; title: string | null; updated_at: string }[]>([])
  const [userRole, setUserRole] = useState<string>('basic')
  const [canUsePaidModels, setCanUsePaidModels] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [{ data: convs }, { data: profile }] = await Promise.all([
        supabase.from('conversations').select('id, title, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(50),
        supabase.from('profiles').select('role').eq('id', user.id).single(),
      ])
      setConversations(convs ?? [])
      setUserRole(profile?.role ?? 'basic')
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSend(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Crear conversación ahora que hay contenido real
    const { data: conv } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: null })
      .select('id')
      .single()

    if (!conv) { setLoading(false); return }

    // Guardar el primer mensaje para que ChatPageClient lo reciba
    await supabase.from('messages').insert({
      conversation_id: conv.id,
      role: 'user',
      content: trimmed,
    })

    // Redirigir al chat — ChatPageClient cargará el mensaje y continuará
    router.push(`/hub/${conv.id}`)
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 13) return 'Buenos días'
    if (h < 20) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="flex h-full bg-[#f4f4f6]">
      <ConversationSidebar conversations={conversations} onNew={() => {}} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Model selector bar */}
        <div className="bg-white border-b border-[#e5e5ea] px-5 py-2.5 flex items-center gap-3">
          <ModelSelector value={selectedModel} onChange={setSelectedModel} userRole={userRole} canUsePaidModels={canUsePaidModels} />
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
          {/* Robot animado */}
          <div className="mb-6 relative" style={{ width: 96, height: 96 }}>
            <style>{`
              @keyframes robotFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
              @keyframes robotGlow { 0%,100%{filter:drop-shadow(0 0 12px rgba(139,92,246,0.6))} 50%{filter:drop-shadow(0 0 24px rgba(167,139,250,0.9))} }
              @keyframes eyeBlink2 { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
              @keyframes antPulse2 { 0%,100%{opacity:0.5} 50%{opacity:1} }
              .rf2{animation:robotFloat 4s ease-in-out infinite,robotGlow 3s ease-in-out infinite}
              .eb2{animation:eyeBlink2 5s ease-in-out infinite;transform-origin:center}
              .ap2{animation:antPulse2 1.5s ease-in-out infinite}
            `}</style>
            <svg viewBox="0 0 96 96" width="96" height="96" className="rf2">
              <defs>
                <radialGradient id="hg2" cx="38%" cy="32%" r="65%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="45%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#3b0764"/></radialGradient>
                <radialGradient id="fg2" cx="40%" cy="35%" r="60%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="60%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#2e1065"/></radialGradient>
                <radialGradient id="eg2" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#e0f2fe"/><stop offset="40%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0ea5e9"/></radialGradient>
                <linearGradient id="mg2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3"/><stop offset="50%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3"/></linearGradient>
              </defs>
              <line x1="48" y1="22" x2="48" y2="10" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="48" cy="8" r="3.5" fill="#a78bfa" className="ap2"/>
              <rect x="16" y="22" width="64" height="58" rx="12" fill="url(#hg2)"/>
              <rect x="20" y="27" width="56" height="48" rx="8" fill="url(#fg2)" opacity="0.85"/>
              <g className="eb2"><circle cx="34" cy="45" r="8" fill="#0f172a"/><circle cx="34" cy="45" r="6" fill="url(#eg2)"/><circle cx="34" cy="45" r="2.5" fill="#0ea5e9"/><circle cx="31.5" cy="42.5" r="1.5" fill="white" opacity="0.8"/></g>
              <g className="eb2"><circle cx="62" cy="45" r="8" fill="#0f172a"/><circle cx="62" cy="45" r="6" fill="url(#eg2)"/><circle cx="62" cy="45" r="2.5" fill="#0ea5e9"/><circle cx="59.5" cy="42.5" r="1.5" fill="white" opacity="0.8"/></g>
              <circle cx="48" cy="55" r="1.5" fill="#a78bfa" opacity="0.6"/>
              <rect x="30" y="62" width="36" height="7" rx="3.5" fill="#0f172a"/>
              <rect x="32" y="63.5" width="32" height="4" rx="2" fill="url(#mg2)"/>
              <rect x="10" y="34" width="6" height="14" rx="3" fill="#7c3aed"/>
              <rect x="80" y="34" width="6" height="14" rx="3" fill="#7c3aed"/>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-1">{getGreeting()}</h1>
          <p className="text-gray-400 text-sm mb-8">¿En qué puedo ayudarte hoy?</p>

          {/* Input */}
          <div className="w-full max-w-2xl">
            <div className="relative bg-white rounded-2xl shadow-sm border border-[#e5e5ea] flex items-end gap-2 p-3">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input) } }}
                placeholder="Escribe tu consulta aquí…"
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed max-h-36 overflow-y-auto py-1 px-1"
                style={{ minHeight: 36 }}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 disabled:opacity-30"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  : <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-4 h-4"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                }
              </button>
            </div>

            {/* Ejemplos */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {EXAMPLE_PROMPTS.map(p => (
                <button
                  key={p.label}
                  onClick={() => handleSend(p.prompt)}
                  className="text-left bg-white border border-[#e5e5ea] rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all"
                >
                  <span className="mr-2">{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
