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
    <aside className="w-60 shrink-0 border-r border-[#e5e5ea] bg-white flex flex-col h-full">
      <div className="p-3 border-b border-[#e5e5ea]">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          Nuevo chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {grouped.map(({ label, items }) => (
          <div key={label}>
            <p className="text-[10px] text-gray-400 font-semibold px-2 py-1 uppercase tracking-wider">{label}</p>
            <div className="space-y-0.5">
              {items.map(conv => (
                <div
                  key={conv.id}
                  className={cn(
                    'group flex items-center rounded-lg transition-colors',
                    currentId === conv.id ? 'bg-violet-50' : 'hover:bg-gray-50'
                  )}
                >
                  <button
                    onClick={() => router.push(`/hub/${conv.id}`)}
                    className={cn(
                      'flex-1 text-left px-3 py-2 text-xs truncate min-w-0',
                      currentId === conv.id ? 'text-violet-700 font-medium' : 'text-gray-500 group-hover:text-gray-700'
                    )}
                  >
                    {conv.title ?? 'Sin título'}
                  </button>

                  <button
                    onClick={e => handleDelete(e, conv.id)}
                    disabled={deletingId === conv.id}
                    className="opacity-0 group-hover:opacity-100 mr-1.5 p-1 rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all shrink-0"
                    title="Eliminar conversación"
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
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-xs text-gray-400 px-3 pt-4 text-center">No hay conversaciones aún</p>
        )}
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
