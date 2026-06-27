'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { markComplete } from '@/lib/academia/progress'

interface Props {
  currentLessonId: string
  moduleSlug: string
  prevLesson?: { id: string; title: string } | null
  nextLesson?: { id: string; title: string } | null
}

export function LessonNav({ currentLessonId, moduleSlug, prevLesson, nextLesson }: Props) {
  const router = useRouter()

  const handleComplete = (destination: string) => {
    markComplete(currentLessonId)
    window.dispatchEvent(new Event('academy-progress'))
    router.push(destination)
  }

  return (
    <div className="border-t border-[#e5e5ea] mt-10 pt-8 flex items-center justify-between gap-4">
      {prevLesson ? (
        <Link
          href={`/academia/${moduleSlug}/${prevLesson.id}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-700 transition-colors"
        >
          <Icon name="chevron-left" size={15} className="shrink-0" />
          <span>
            <span className="text-xs text-gray-400 block">Anterior</span>
            <span className="font-medium">{prevLesson.title}</span>
          </span>
        </Link>
      ) : (
        <Link
          href={`/academia/${moduleSlug}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-700 transition-colors"
        >
          <Icon name="chevron-left" size={15} />
          Volver al módulo
        </Link>
      )}

      {nextLesson ? (
        <button
          onClick={() => handleComplete(`/academia/${moduleSlug}/${nextLesson.id}`)}
          className="flex items-center gap-2 text-sm font-medium bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Siguiente lección
          <Icon name="chevron-right" size={15} />
        </button>
      ) : (
        <button
          onClick={() => handleComplete('/academia')}
          className="flex items-center gap-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Módulo completado
          <Icon name="check" size={15} />
        </button>
      )}
    </div>
  )
}
