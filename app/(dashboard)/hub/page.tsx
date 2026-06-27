import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Crear nueva conversación y redirigir a ella
  const { data: conv, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title: null })
    .select('id')
    .single()

  if (error || !conv) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error al crear conversación</p>
          <p className="text-slate-500 text-sm">{error?.message}</p>
        </div>
      </div>
    )
  }

  redirect(`/hub/${conv.id}`)
}
