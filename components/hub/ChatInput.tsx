'use client'

import { useRef, useState, KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

export interface Attachment {
  name: string
  type: string
  content: string // texto plano o data URL para imágenes
}

interface Props {
  onSend: (content: string, attachments?: Attachment[]) => void
  disabled?: boolean
  placeholder?: string
  borderless?: boolean
}

const ACCEPTED = '.pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp'

function fileIcon(type: string) {
  if (type.startsWith('image/')) return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  )
}

async function readFile(file: File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    if (file.type.startsWith('image/')) {
      reader.onload = () => resolve({ name: file.name, type: file.type, content: reader.result as string })
      reader.readAsDataURL(file)
    } else {
      reader.onload = () => resolve({ name: file.name, type: file.type, content: reader.result as string })
      reader.onerror = reject
      reader.readAsText(file)
    }
  })
}

export function ChatInput({ onSend, disabled, placeholder = 'Escribe un mensaje...', borderless }: Props) {
  const [value, setValue] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if ((!trimmed && attachments.length === 0) || disabled) return
    onSend(trimmed, attachments.length > 0 ? attachments : undefined)
    setValue('')
    setAttachments([])
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    const results = await Promise.all(Array.from(files).map(readFile))
    setAttachments(prev => [...prev, ...results])
  }

  const removeAttachment = (i: number) =>
    setAttachments(prev => prev.filter((_, idx) => idx !== i))

  const canSend = (value.trim() || attachments.length > 0) && !disabled

  const AttachButton = () => (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 disabled:opacity-40"
      title="Adjuntar archivo"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
      </svg>
    </button>
  )

  const SendButton = ({ size = 'md' }: { size?: 'sm' | 'md' }) => (
    <button
      onClick={handleSend}
      disabled={!canSend}
      className={cn(
        'rounded-xl flex items-center justify-center transition-all shrink-0',
        size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-9 h-9',
        canSend ? 'bg-gray-900 hover:bg-gray-700 text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
      )}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )

  const AttachmentChips = () => attachments.length > 0 ? (
    <div className="flex flex-wrap gap-1.5 px-3 pt-2">
      {attachments.map((a, i) => (
        <div key={i} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-2 py-1 rounded-lg">
          {fileIcon(a.type)}
          <span className="max-w-[140px] truncate">{a.name}</span>
          <button onClick={() => removeAttachment(i)} className="text-violet-400 hover:text-violet-700 ml-0.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  ) : null

  // Input file oculto
  const HiddenInput = () => (
    <input
      ref={fileInputRef}
      type="file"
      accept={ACCEPTED}
      multiple
      className="hidden"
      onChange={e => handleFiles(e.target.files)}
    />
  )

  if (borderless) {
    return (
      <div className="px-3 py-3">
        <HiddenInput />
        <AttachmentChips />
        <div className="flex items-end gap-2 pt-1">
          <AttachButton />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={disabled}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent text-gray-800 placeholder:text-gray-400 text-sm resize-none outline-none leading-relaxed max-h-[200px] overflow-y-auto"
          />
          <SendButton size="sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-[#e5e5ea] bg-white px-4 py-4">
      <HiddenInput />
      <div className="max-w-3xl mx-auto">
        <div className={cn(
          'bg-white border border-[#e5e5ea] rounded-2xl shadow-sm transition-colors overflow-hidden',
          !disabled && 'focus-within:border-violet-300 focus-within:shadow-violet-100/60'
        )}>
          <AttachmentChips />
          <div className="flex items-end gap-2 px-3 py-3">
            <AttachButton />
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              disabled={disabled}
              placeholder={placeholder}
              rows={1}
              className="flex-1 bg-transparent text-gray-800 placeholder:text-gray-400 text-sm resize-none outline-none leading-relaxed max-h-[200px] overflow-y-auto"
            />
            <SendButton />
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  )
}
