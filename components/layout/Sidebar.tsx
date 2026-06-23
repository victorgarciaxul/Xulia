'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

const NAV = [
  { label: 'Principal', items: [
    { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { href: '/hub', icon: '✦', label: 'AI Hub' },
    { href: '/agentes', icon: '◎', label: 'Agentes' },
    { href: '/conocimiento', icon: '⊙', label: 'Conocimiento' },
  ]},
  { label: 'Productividad', items: [
    { href: '/prompts', icon: '▤', label: 'Biblioteca' },
    { href: '/academia', icon: '◈', label: 'Academia' },
  ]},
  { label: 'Datos', items: [
    { href: '/analitica', icon: '◻', label: 'Analítica' },
  ]},
]

interface Props {
  profile: Profile | null
}

export function Sidebar({ profile }: Props) {
  const pathname = usePathname()

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#13131a] border-r border-[#1e1e2e] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#1e1e2e]">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-base flex-shrink-0">
          ⚡
        </div>
        <div>
          <div className="font-bold text-sm text-white tracking-tight">XULIA</div>
          <div className="text-[10px] text-slate-500">Plataforma IA</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map(section => (
          <div key={section.label} className="mb-4">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-1">
              {section.label}
            </p>
            {section.items.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm mb-0.5 transition-colors',
                    active
                      ? 'bg-[#1a1a2e] text-indigo-400'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-[#1e1e2e]'
                  )}
                >
                  <span className="text-base w-4 text-center">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}

        {profile?.role === 'admin' && (
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-1">
              Admin
            </p>
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm mb-0.5 transition-colors',
                pathname.startsWith('/admin')
                  ? 'bg-[#1a1a2e] text-indigo-400'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#1e1e2e]'
              )}
            >
              <span className="text-base w-4 text-center">⊛</span>
              Administración
            </Link>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t border-[#1e1e2e] p-3 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-300 truncate">{profile?.full_name ?? 'Usuario'}</p>
          <p className="text-[10px] text-slate-600 truncate capitalize">{profile?.department ?? ''} · {profile?.role}</p>
        </div>
      </div>
    </aside>
  )
}
