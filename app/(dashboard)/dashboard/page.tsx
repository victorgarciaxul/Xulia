import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: quota } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const { count: totalConversations } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4">
          <div className="text-xl mb-2">💬</div>
          <div className="text-2xl font-bold text-white">{totalConversations ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1">Conversaciones</div>
        </div>
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4">
          <div className="text-xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-white">{quota?.requests_today ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1">Consultas hoy</div>
        </div>
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4">
          <div className="text-xl mb-2">📊</div>
          <div className="text-2xl font-bold text-white">{quota?.requests_this_month ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1">Este mes</div>
        </div>
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-4">
          <div className="text-xl mb-2">💶</div>
          <div className="text-2xl font-bold text-white">
            {quota?.spend_this_month_usd ? `$${Number(quota.spend_this_month_usd).toFixed(2)}` : '$0.00'}
          </div>
          <div className="text-xs text-slate-500 mt-1">Gasto este mes</div>
        </div>
      </div>

      {/* Acceso rápido */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: '💬', label: 'Nueva conversación', href: '/hub' },
            { icon: '🎯', label: 'Asistente Comercial', href: '/agentes/comercial' },
            { icon: '📋', label: 'Analizar licitación', href: '/agentes/licitaciones' },
            { icon: '📱', label: 'Copy Social Media', href: '/agentes/social-media' },
            { icon: '🔍', label: 'Buscar en documentos', href: '/conocimiento' },
            { icon: '📚', label: 'Biblioteca prompts', href: '/prompts' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="bg-[#0f0f13] border border-[#1e1e2e] hover:border-indigo-500/50 hover:bg-[#1a1a2e] rounded-xl p-3 text-center transition-all group"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-200 leading-tight">{item.label}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Agentes destacados */}
      <div className="bg-[#13131a] border border-[#1e1e2e] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300">Agentes especializados</h2>
          <a href="/agentes" className="text-xs text-indigo-400 hover:text-indigo-300">Ver todos →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: '🎯', name: 'Comercial', desc: 'Propuestas y comunicaciones comerciales', slug: 'comercial' },
            { icon: '📋', name: 'Licitaciones', desc: 'Análisis de pliegos y concurrencia pública', slug: 'licitaciones' },
            { icon: '📱', name: 'Social Media', desc: 'Copies y calendarios para redes sociales', slug: 'social-media' },
            { icon: '🇪🇺', name: 'Fondos Europeos', desc: 'Convocatorias y candidaturas europeas', slug: 'fondos-europeos' },
            { icon: '🎪', name: 'Eventos', desc: 'Planificación y producción de eventos', slug: 'eventos' },
            { icon: '💻', name: 'Desarrollo Web', desc: 'Soporte técnico y code review', slug: 'desarrollo-web' },
          ].map(agent => (
            <a
              key={agent.slug}
              href={`/agentes/${agent.slug}`}
              className="flex items-center gap-3 p-3 bg-[#0f0f13] border border-[#1e1e2e] hover:border-indigo-500/40 rounded-xl transition-all group"
            >
              <span className="text-2xl">{agent.icon}</span>
              <div>
                <div className="text-sm font-medium text-slate-200 group-hover:text-white">{agent.name}</div>
                <div className="text-xs text-slate-500 leading-tight">{agent.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
