import { AGENTS } from '@/lib/agents/system-prompts'
import { Icon, ICONS } from '@/components/ui/Icon'
import Link from 'next/link'

type IconName = keyof typeof ICONS

const CATEGORY_LABELS: Record<string, string> = {
  comercial:   'Comercial',
  marketing:   'Marketing',
  social:      'Social Media',
  eventos:     'Eventos',
  operaciones: 'Operaciones',
  tecnologia:  'Tecnología',
  rrhh:        'RRHH',
  direccion:   'Dirección',
}

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

export default function AgentesPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agentes Especializados</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Asistentes de IA entrenados para cada departamento de la agencia
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map(agent => {
          const iconName = AGENT_ICONS[agent.slug] ?? 'agent'
          const categoryLabel = CATEGORY_LABELS[agent.category] ?? agent.category

          return (
            <Link
              key={agent.slug}
              href={`/agentes/${agent.slug}`}
              className="group bg-white border border-[#e5e5ea] rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition-all flex flex-col gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <Icon name={iconName} className="text-violet-600" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors leading-tight">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2 leading-snug">
                    {agent.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-50 border border-[#e5e5ea] px-2 py-0.5 rounded-full">
                    {categoryLabel}
                  </span>
                  <span className="text-xs text-gray-400 bg-gray-50 border border-[#e5e5ea] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Icon name={agent.use_rag ? 'book' : 'chat'} size={10} className="text-gray-400" />
                    {agent.use_rag ? 'RAG' : 'Chat'}
                  </span>
                </div>
                <span className="text-xs text-violet-500 group-hover:text-violet-700 transition-colors font-medium">
                  Abrir →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
