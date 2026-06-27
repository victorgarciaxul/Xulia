'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { getCompleted } from '@/lib/academia/progress'
import type { Module } from '@/lib/academia/modules'

interface Props {
  module: Module
}

export function ModuleLessonList({ module }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCompleted(getCompleted())
    const handler = () => setCompleted(getCompleted())
    window.addEventListener('academy-progress', handler)
    return () => window.removeEventListener('academy-progress', handler)
  }, [])

  const doneCount = module.lessons.filter(l => completed.has(l.id)).length
  const allDone = doneCount === module.lessons.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          {module.lessons.length} lecciones en este módulo
        </h2>
        {doneCount > 0 && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            allDone
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-violet-50 text-violet-700 border border-violet-200'
          }`}>
            {doneCount}/{module.lessons.length} completadas
          </span>
        )}
      </div>

      {/* Progress bar */}
      {doneCount > 0 && (
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-emerald-500' : 'bg-violet-500'}`}
            style={{ width: `${(doneCount / module.lessons.length) * 100}%` }}
          />
        </div>
      )}

      {module.lessons.map((lesson, i) => {
        const isDone = completed.has(lesson.id)
        return (
          <Link
            key={lesson.id}
            href={`/academia/${module.slug}/${lesson.id}`}
            className="group flex items-start gap-4 bg-white border border-[#e5e5ea] rounded-xl p-4 hover:border-violet-300 hover:shadow-sm transition-all"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isDone ? 'bg-emerald-100' : 'bg-violet-100 group-hover:bg-violet-200'
            }`}>
              {isDone ? (
                <Icon name="check" size={16} className="text-emerald-600" />
              ) : (
                <span className="text-sm font-bold text-violet-600">{i + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold leading-tight transition-colors ${
                isDone ? 'text-emerald-700 group-hover:text-emerald-800' : 'text-gray-900 group-hover:text-violet-700'
              }`}>
                {lesson.title}
              </h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Icon name="clock" size={11} className="text-gray-400" />
                  {lesson.duration}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Icon name="book" size={11} className="text-gray-400" />
                  {lesson.sections.length} secciones
                </span>
                {isDone && (
                  <span className="text-xs text-emerald-600 font-medium">Completada</span>
                )}
              </div>
            </div>
            <Icon name="chevron-right" size={16} className="text-gray-300 group-hover:text-violet-500 transition-colors shrink-0 mt-0.5" />
          </Link>
        )
      })}

      <Link
        href={`/academia/${module.slug}/${module.lessons[0].id}`}
        className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-semibold transition-colors"
      >
        {doneCount === 0 ? 'Empezar módulo' : allDone ? 'Repasar módulo' : 'Continuar módulo'}
        <Icon name="chevron-right" size={15} />
      </Link>
    </div>
  )
}
