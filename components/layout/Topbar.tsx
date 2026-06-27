'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

function initials(name: string | null | undefined) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function Topbar({ profile }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-12 flex-shrink-0 bg-white border-b border-[#e5e5ea] flex items-center justify-between px-5">
      <div />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {initials(profile?.full_name)}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {profile?.full_name?.split(' ')[0] ?? 'Usuario'}
          </span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Salir
        </button>
      </div>
    </header>
  )
}
