import { notFound } from 'next/navigation'
import { MODULES } from '@/lib/academia/modules'
import { Icon, ICONS } from '@/components/ui/Icon'
import { LessonSidebar } from '@/components/academia/LessonSidebar'
import { LessonNav } from '@/components/academia/LessonNav'

type IconName = keyof typeof ICONS

const SECTION_STYLES = {
  intro:    { bg: 'bg-white border-[#e5e5ea]',        label: null },
  concept:  { bg: 'bg-violet-50 border-violet-200',   label: 'Concepto clave' },
  example:  { bg: 'bg-blue-50 border-blue-200',       label: 'Ejemplo práctico' },
  tip:      { bg: 'bg-emerald-50 border-emerald-200', label: 'Consejo' },
  exercise: { bg: 'bg-amber-50 border-amber-200',     label: 'Ejercicio' },
  quote:    { bg: 'bg-gray-50 border-[#e5e5ea]',      label: null },
  list:     { bg: 'bg-white border-[#e5e5ea]',        label: null },
  warning:  { bg: 'bg-rose-50 border-rose-200',       label: 'Atención' },
}

const SECTION_ICON: Record<string, IconName> = {
  concept:  'lightbulb',
  example:  'file-text',
  tip:      'check',
  exercise: 'graduation',
  warning:  'shield',
}

interface PageProps {
  params: Promise<{ slug: string; lessonId: string }>
}

export async function generateStaticParams() {
  return MODULES.flatMap(m =>
    m.lessons.map(l => ({ slug: m.slug, lessonId: l.id }))
  )
}

export default async function LessonPage({ params }: PageProps) {
  const { slug, lessonId } = await params
  const module = MODULES.find(m => m.slug === slug)
  if (!module) notFound()

  const lessonIndex = module.lessons.findIndex(l => l.id === lessonId)
  if (lessonIndex === -1) notFound()

  const lesson = module.lessons[lessonIndex]
  const prevLesson = module.lessons[lessonIndex - 1]
  const nextLesson = module.lessons[lessonIndex + 1]
  const moduleIndex = MODULES.findIndex(m => m.slug === slug)
  const iconName = module.icon as IconName

  return (
    <div className="flex h-full min-h-0">
      {/* Left sidebar */}
      <LessonSidebar module={module} moduleIndex={moduleIndex} currentLessonId={lessonId} />

      {/* Main lesson content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {/* Lesson header */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-1">
              Lección {lessonIndex + 1} de {module.lessons.length}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Icon name="clock" size={11} className="text-gray-400" />
              {lesson.duration} de lectura
            </span>
          </div>

          {/* Sections */}
          <div className="space-y-5">
            {lesson.sections.map((section, sIdx) => {
              const style = SECTION_STYLES[section.type]
              const sectionIcon = SECTION_ICON[section.type] as IconName | undefined

              if (section.type === 'quote') {
                return (
                  <blockquote key={sIdx} className="border-l-4 border-violet-400 pl-5 py-2 my-6">
                    <p className="text-gray-700 italic leading-relaxed">&ldquo;{section.content}&rdquo;</p>
                    {section.author && (
                      <footer className="text-xs text-gray-400 mt-2">— {section.author}</footer>
                    )}
                  </blockquote>
                )
              }

              return (
                <div key={sIdx} className={`border rounded-xl p-5 ${style.bg}`}>
                  {style.label && (
                    <div className="flex items-center gap-1.5 mb-2.5">
                      {sectionIcon && (
                        <Icon name={sectionIcon} size={13} className="text-current opacity-50" />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
                        {style.label}
                      </span>
                    </div>
                  )}
                  {section.title && (
                    <h3 className="font-semibold text-gray-900 mb-2.5">{section.title}</h3>
                  )}
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                  {section.items && (
                    <ul className="mt-3 space-y-2">
                      {section.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2 text-sm text-gray-700">
                          <Icon name="check" size={13} className="text-violet-500 mt-0.5 shrink-0" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>

          <LessonNav
            currentLessonId={lessonId}
            moduleSlug={module.slug}
            prevLesson={prevLesson ?? null}
            nextLesson={nextLesson ?? null}
          />

        </div>
      </main>
    </div>
  )
}
