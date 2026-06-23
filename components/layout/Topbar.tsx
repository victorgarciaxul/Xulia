'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
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
    <header className="h-14 flex-shrink-0 bg-[#13131a] border-b border-[#1e1e2e] flex items-center justify-between px-6">
      <div>
        <p className="text-sm font-medium text-white">
          Bienvenido, {profile?.full_name?.split(' ')[0] ?? 'usuario'} 👋
        </p>
        <p className="text-xs text-slate-500">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors">
          + Nueva conversación
        </button>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-2"
        >
          Salir
        </button>
      </div>
    </header>
  )
}
