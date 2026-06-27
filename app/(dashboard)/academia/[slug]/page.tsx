import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MODULES } from '@/lib/academia/modules'
import { Icon, ICONS } from '@/components/ui/Icon'
import { ModuleLessonList } from '@/components/academia/ModuleLessonList'

type IconName = keyof typeof ICONS

const LEVEL_COLORS = {
  'Básico':     'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Intermedio': 'bg-amber-50 text-amber-700 border-amber-200',
  'Avanzado':   'bg-rose-50 text-rose-700 border-rose-200',
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return MODULES.map(m => ({ slug: m.slug }))
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params
  const module = MODULES.find(m => m.slug === slug)
  if (!module) notFound()

  const moduleIndex = MODULES.findIndex(m => m.slug === slug)
  const iconName = module.icon as IconName

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/academia"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-6"
      >
        <Icon name="chevron-left" size={13} />
        AI Academy
      </Link>

      {/* Module header */}
      <div className="bg-white border border-[#e5e5ea] rounded-2xl p-8 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center shrink-0">
            <Icon name={iconName} className="text-violet-600" size={26} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs text-gray-400 font-medium">Módulo {moduleIndex + 1}</span>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${LEVEL_COLORS[module.level]}`}>
                {module.level}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Icon name="clock" size={11} className="text-gray-400" />
                {module.duration}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h1>
            <p className="text-gray-500">{module.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {module.tags.map(tag => (
                <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 border border-[#e5e5ea] px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons list — client component with progress */}
        <div className="lg:col-span-2">
          <ModuleLessonList module={module} />
        </div>

        {/* Objectives sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e5e5ea] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Lo que aprenderás</h3>
            <ul className="space-y-2">
              {module.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Icon name="check" size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-600 leading-snug">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Other modules */}
          <div className="bg-white border border-[#e5e5ea] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Otros módulos</h3>
            <div className="space-y-1.5">
              {MODULES.filter(m => m.slug !== module.slug).map((m, i) => (
                <Link
                  key={m.slug}
                  href={`/academia/${m.slug}`}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                    <Icon name={m.icon as IconName} className="text-violet-600" size={12} />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-violet-700 transition-colors leading-tight line-clamp-1">
                    {m.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
