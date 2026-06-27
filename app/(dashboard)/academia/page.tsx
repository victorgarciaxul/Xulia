import Link from 'next/link'
import { MODULES } from '@/lib/academia/modules'
import { Icon, ICONS } from '@/components/ui/Icon'

type IconName = keyof typeof ICONS

const LEVEL_COLORS = {
  'Básico':     'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Intermedio': 'bg-amber-50 text-amber-700 border-amber-200',
  'Avanzado':   'bg-rose-50 text-rose-700 border-rose-200',
}

export default function AcademiaPage() {
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Academy</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Formación práctica en inteligencia artificial para equipos de comunicación y marketing
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Módulos', value: MODULES.length },
          { label: 'Lecciones', value: totalLessons },
          { label: 'Horas de contenido', value: '8h' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#e5e5ea] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Modules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODULES.map((module, idx) => {
          const iconName = module.icon as IconName
          return (
            <Link
              key={module.slug}
              href={`/academia/${module.slug}`}
              className="group bg-white border border-[#e5e5ea] rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition-all flex flex-col gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Icon name={iconName} className="text-violet-600" size={22} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors leading-tight mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-snug">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${LEVEL_COLORS[module.level]}`}>
                    {module.level}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Icon name="book" size={11} className="text-gray-400" />
                    {module.lessons.length} lecciones
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Icon name="clock" size={11} className="text-gray-400" />
                    {module.duration}
                  </span>
                </div>
                <span className="text-xs text-violet-500 group-hover:text-violet-700 transition-colors font-medium shrink-0">
                  Empezar →
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {module.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 border border-[#e5e5ea] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 text-center mt-8">
        Contenido actualizado en 2025 · Basado en las mejores prácticas del sector
      </p>
    </div>
  )
}
