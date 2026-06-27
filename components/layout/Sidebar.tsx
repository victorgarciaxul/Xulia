'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )},
  { href: '/hub', label: 'Chat', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )},
  { href: '/agentes', label: 'Agentes', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )},
  { href: '/conocimiento', label: 'Conocimiento', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )},
  { href: '/prompts', label: 'Prompts', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )},
  { href: '/academia', label: 'Academia', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )},
  { href: '/automatizaciones', label: 'Automatizaciones', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
      <path d="M12 2a9 9 0 0 1 9 9c0 3.5-2 6.5-5 8l-1 3H9l-1-3C5 17.5 3 14.5 3 11a9 9 0 0 1 9-9z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  )},
  { href: '/analitica', label: 'Analítica', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )},
]

interface Props {
  profile: Profile | null
}

export function Sidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [expanded, setExpanded] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const allNav = [
    ...NAV,
    ...(profile?.role === 'admin' ? [{
      href: '/admin',
      label: 'Administración',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
    }] : []),
  ]

  return (
    <>
      <aside
        className={cn(
          'relative z-40 flex flex-col rounded-2xl bg-white/90 backdrop-blur-md border border-[#e5e5ea] shadow-xl transition-all duration-300 ease-in-out my-3 ml-3 flex-shrink-0',
          expanded ? 'w-52' : 'w-14'
        )}
      >
        {/* Logo + toggle */}
        <div className={cn('flex items-center px-2.5 pt-3 pb-2 gap-2', expanded && 'px-3')}>
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 hover:bg-violet-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth={2}>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          {expanded && (
            <span className="text-sm font-bold text-gray-900 tracking-tight flex-1 truncate">Xulia</span>
          )}

          <button
            onClick={() => setExpanded(e => !e)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              {expanded
                ? <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              }
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 px-2 py-1 overflow-hidden">
          {allNav.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setExpanded(false)}
                title={!expanded ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-2 h-10 rounded-xl transition-all group relative',
                  expanded ? 'px-2.5' : 'justify-center',
                  active
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                )}
              >
                {item.icon}
                {expanded && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {!expanded && (
                  <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className={cn('px-2 pb-3 flex flex-col gap-1', expanded ? 'px-3' : 'items-center')}>
          <div className={cn('flex items-center gap-2.5', !expanded && 'justify-center')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {initials}
            </div>
            {expanded && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{profile?.full_name ?? 'Usuario'}</p>
                <p className="text-[10px] text-gray-400 truncate capitalize">{profile?.role ?? ''}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors group relative',
              expanded ? 'w-full' : 'justify-center w-10'
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {expanded
              ? 'Cerrar sesión'
              : <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">Cerrar sesión</span>
            }
          </button>
        </div>
      </aside>

    </>
  )
}
