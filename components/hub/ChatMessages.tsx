'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

export interface ChatMessage {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model_id?: string
}

interface Props {
  messages: ChatMessage[]
  isLoading?: boolean
}

export function ChatMessages({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-[#f4f4f6]">
      {messages.map((msg, i) => (
        <div
          key={msg.id ?? i}
          className={cn('flex gap-3 max-w-3xl mx-auto', msg.role === 'user' ? 'justify-end' : 'justify-start')}
        >
          {msg.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
              style={{ background: 'radial-gradient(circle at 35% 35%, #c084fc, #7c3aed)' }}>
              X
            </div>
          )}
          <div
            className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-gray-900 text-white rounded-tr-sm'
                : 'bg-white text-gray-800 rounded-tl-sm border border-[#e5e5ea] shadow-sm'
            )}
          >
            {msg.role === 'assistant' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const isBlock = className?.includes('language-')
                    return isBlock ? (
                      <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto my-2">
                        <code className={cn('text-xs text-gray-800', className)} {...props}>{children}</code>
                      </pre>
                    ) : (
                      <code className="bg-gray-100 text-gray-800 rounded px-1 py-0.5 text-xs font-mono" {...props}>{children}</code>
                    )
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                  h1: ({ children }) => <h1 className="text-base font-bold mb-2 text-gray-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold mb-1.5 text-gray-900">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-gray-900">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-violet-400 pl-3 italic text-gray-500 my-2">{children}</blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="text-xs border-collapse border border-gray-200">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => <th className="border border-gray-200 px-2 py-1 bg-gray-50 font-semibold text-gray-700">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-200 px-2 py-1 text-gray-600">{children}</td>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>
          {msg.role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 mt-0.5">
              Tú
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3 max-w-3xl mx-auto justify-start">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'radial-gradient(circle at 35% 35%, #c084fc, #7c3aed)' }}>
            X
          </div>
          <div className="bg-white border border-[#e5e5ea] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1 items-center h-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
