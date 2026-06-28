'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Conversation {
  id: string
  title: string | null
  updated_at: string
}

interface Props {
  conversations: Conversation[]
  onNew: () => void
}

export function ConversationSidebar({ conversations, onNew }: Props) {
  const router = useRouter()
  const params = useParams()
  const currentId = params?.id as string | undefined
  const supabase = createClient()

  const [items, setItems] = useState(conversations)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeletingId(id)
    await supabase.from('messages').delete().eq('conversation_id', id)
    await supabase.from('conversations').delete().eq('id', id)
    setItems(prev => prev.filter(c => c.id !== id))
    setDeletingId(null)
    if (currentId === id) router.push('/hub')
  }

  const grouped = groupByDate(items)

  return (
    <aside className="w-64 shrink-0 border-r border-[#e5e5ea] bg-[#fafafa] flex flex-col h-full">

      {/* CTA principal */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-sm shadow-violet-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 shrink-0">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          Nuevo chat
        </button>
      </div>

      {/* Separador */}
      <div className="mx-3 border-t border-[#e5e5ea]" />

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {grouped.length === 0 && (
          <div className="flex flex-col items-center gap-2 pt-10 px-4 text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-gray-300">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="text-xs text-gray-400 leading-relaxed">Aún no tienes conversaciones.<br/>¡Empieza un nuevo chat!</p>
          </div>
        )}

        {grouped.map(({ label, items: groupItems }) => (
          <div key={label}>
            {/* Etiqueta de grupo */}
            <p className="text-[10px] text-gray-400 font-semibold px-2 pb-1 uppercase tracking-widest select-none">
              {label}
            </p>

            <div className="space-y-0.5">
              {groupItems.map(conv => {
                const isActive = currentId === conv.id
                const hasTitle = !!conv.title

                return (
                  <div
                    key={conv.id}
                    className={cn(
                      'group relative flex items-center rounded-lg transition-all',
                      isActive
                        ? 'bg-white border border-[#e5e5ea] shadow-sm'
                        : 'hover:bg-white hover:border hover:border-[#e5e5ea] border border-transparent'
                    )}
                  >
                    {/* Indicador activo */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-500 rounded-r-full" />
                    )}

                    <button
                      onClick={() => router.push(`/hub/${conv.id}`)}
                      className="flex-1 min-w-0 text-left px-3 py-2.5 flex items-start gap-2"
                    >
                      {/* Icono de conversación */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        className={cn(
                          'w-3.5 h-3.5 mt-0.5 shrink-0 transition-colors',
                          isActive ? 'text-violet-500' : 'text-gray-300 group-hover:text-gray-400'
                        )}
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>

                      <span
                        className={cn(
                          'text-xs truncate leading-snug transition-colors',
                          isActive
                            ? 'text-gray-900 font-medium'
                            : hasTitle
                              ? 'text-gray-600 group-hover:text-gray-800'
                              : 'text-gray-400 italic group-hover:text-gray-500'
                        )}
                      >
                        {conv.title ?? 'Sin título'}
                      </span>
                    </button>

                    {/* Botón eliminar — aparece en hover */}
                    <button
                      onClick={e => handleDelete(e, conv.id)}
                      disabled={deletingId === conv.id}
                      className="opacity-0 group-hover:opacity-100 mr-2 p-1.5 rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all shrink-0 disabled:pointer-events-none"
                      title="Eliminar"
                    >
                      {deletingId === conv.id ? (
                        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                        </svg>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

function groupByDate(conversations: Conversation[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  const week = new Date(today.getTime() - 7 * 86400000)

  const groups: Record<string, Conversation[]> = {
    'Hoy': [], 'Ayer': [], 'Última semana': [], 'Anteriores': [],
  }

  for (const conv of conversations) {
    const d = new Date(conv.updated_at)
    if (d >= today) groups['Hoy'].push(conv)
    else if (d >= yesterday) groups['Ayer'].push(conv)
    else if (d >= week) groups['Última semana'].push(conv)
    else groups['Anteriores'].push(conv)
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }))
}
