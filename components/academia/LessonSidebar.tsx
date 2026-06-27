'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon, ICONS } from '@/components/ui/Icon'
import { getCompleted } from '@/lib/academia/progress'
import type { Module } from '@/lib/academia/modules'

type IconName = keyof typeof ICONS

interface Props {
  module: Module
  moduleIndex: number
  currentLessonId: string
}

export function LessonSidebar({ module, moduleIndex, currentLessonId }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const iconName = module.icon as IconName

  useEffect(() => {
    setCompleted(getCompleted())
    const handler = () => setCompleted(getCompleted())
    window.addEventListener('academy-progress', handler)
    return () => window.removeEventListener('academy-progress', handler)
  }, [])

  return (
    <aside className="w-60 shrink-0 border-r border-[#e5e5ea] bg-white flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-[#e5e5ea] shrink-0">
        <Link
          href={`/academia/${module.slug}`}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-3"
        >
          <Icon name="chevron-left" size={13} />
          {module.title}
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <Icon name={iconName} className="text-violet-600" size={13} />
          </div>
          <span className="text-xs text-gray-500 font-medium">Módulo {moduleIndex + 1}</span>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-2 py-1.5">
          Lecciones
        </p>
        {module.lessons.map((l, i) => {
          const isActive = l.id === currentLessonId
          const isDone = completed.has(l.id)
          return (
            <Link
              key={l.id}
              href={`/academia/${module.slug}/${l.id}`}
              className={`flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors group ${
                isActive ? 'bg-violet-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isDone
                  ? 'bg-emerald-100'
                  : isActive
                  ? 'bg-violet-600'
                  : 'bg-gray-100 group-hover:bg-violet-100'
              }`}>
                {isDone ? (
                  <Icon name="check" size={10} className="text-emerald-600" />
                ) : (
                  <span className={`text-[9px] font-bold transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-violet-600'
                  }`}>{i + 1}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-medium leading-tight truncate transition-colors ${
                  isActive ? 'text-violet-700' : isDone ? 'text-emerald-700' : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {l.title}
                </p>
                <p className="text-[10px] text-gray-400">{l.duration}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
