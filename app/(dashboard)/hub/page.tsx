import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HubPageClient } from './HubPageClient'

export default async function HubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: conversations }, { data: profile }] = await Promise.all([
    supabase.from('conversations').select('id, title, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(50),
    supabase.from('profiles').select('role, full_name').eq('id', user.id).single(),
  ])

  // Extraer primer nombre
  const rawName = profile?.full_name ?? user.email ?? ''
  let firstName: string
  if (rawName.includes('@')) {
    const local = rawName.split('@')[0]
    firstName = local.split(/[._\-0-9]/)[0]
  } else {
    firstName = rawName.split(' ')[0]
  }

  return (
    <HubPageClient
      firstName={firstName}
      userRole={profile?.role ?? 'basic'}
      conversations={conversations ?? []}
    />
  )
}
