import { createClient } from '@/lib/supabase/server'
import { Icon } from '@/components/ui/Icon'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user!.id).single()

  const { data: quota } = await supabase
    .from('user_quotas').select('*').eq('user_id', user!.id).single()

  const { count: totalConversations } = await supabase
    .from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', user!.id)

  const firstName = profile?.full_name?.split(' ')[0] ?? 'usuario'
  const h = new Date().getHours()
  const greeting = h < 13 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{greeting}, {firstName}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: 'messages' as const, value: totalConversations ?? 0, label: 'Conversaciones' },
          { icon: 'zap' as const,      value: quota?.requests_today ?? 0, label: 'Consultas hoy' },
          { icon: 'cpu' as const,      value: quota?.tokens_used_today ? `${(quota.tokens_used_today / 1000).toFixed(1)}K` : '0', label: 'Tokens hoy' },
          { icon: 'euro' as const,     value: quota?.cost_usd_month ? `$${Number(quota.cost_usd_month).toFixed(2)}` : '$0.00', label: 'Gasto este mes' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#e5e5ea] rounded-xl p-4 shadow-sm">
            <Icon name={stat.icon} className="text-violet-500 mb-3" size={20} />
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div className="bg-white border border-[#e5e5ea] rounded-xl p-5 mb-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: 'chat' as const,       label: 'Nueva conversación',  href: '/hub' },
            { icon: 'target' as const,     label: 'Asistente Comercial', href: '/agentes/comercial' },
            { icon: 'clipboard' as const,  label: 'Analizar licitación', href: '/agentes/licitaciones' },
            { icon: 'smartphone' as const, label: 'Copy Social Media',   href: '/agentes/social-media' },
            { icon: 'search' as const,     label: 'Buscar documentos',   href: '/conocimiento' },
            { icon: 'file' as const,       label: 'Biblioteca prompts',  href: '/prompts' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-[#f4f4f6] border border-[#e5e5ea] hover:border-violet-300 hover:bg-violet-50 rounded-xl p-3 text-center transition-all group flex flex-col items-center gap-2"
            >
              <Icon name={item.icon} className="text-violet-500 group-hover:text-violet-700" size={22} />
              <span className="text-xs text-gray-500 group-hover:text-violet-700 leading-tight">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Agents */}
      <div className="bg-white border border-[#e5e5ea] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Agentes especializados</h2>
          <Link href="/agentes" className="text-xs text-violet-600 hover:text-violet-500">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: 'target' as const,    name: 'Comercial',       desc: 'Propuestas y comunicaciones comerciales',     slug: 'comercial' },
            { icon: 'clipboard' as const, name: 'Licitaciones',    desc: 'Análisis de pliegos y concurrencia pública',  slug: 'licitaciones' },
            { icon: 'smartphone' as const,name: 'Social Media',    desc: 'Copies y calendarios para redes sociales',    slug: 'social-media' },
            { icon: 'globe' as const,     name: 'Fondos Europeos', desc: 'Convocatorias y candidaturas europeas',        slug: 'fondos-europeos' },
            { icon: 'calendar' as const,  name: 'Eventos',         desc: 'Planificación y producción de eventos',       slug: 'eventos' },
            { icon: 'code' as const,      name: 'Desarrollo Web',  desc: 'Soporte técnico y code review',               slug: 'desarrollo-web' },
          ].map(agent => (
            <Link
              key={agent.slug}
              href={`/agentes/${agent.slug}`}
              className="flex items-center gap-3 p-3 bg-[#f4f4f6] border border-[#e5e5ea] hover:border-violet-300 hover:bg-violet-50 rounded-xl transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                <Icon name={agent.icon} className="text-violet-600" size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800 group-hover:text-violet-700">{agent.name}</div>
                <div className="text-xs text-gray-400 leading-tight">{agent.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
