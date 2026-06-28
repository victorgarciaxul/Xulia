import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { ChatPageClient } from './ChatPageClient'

interface Props {
  params: { id: string }
}

export default async function ChatPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  // Verificar que la conversación pertenece al usuario
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, title, agent_slug')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!conv) redirect('/hub')

  // Cargar mensajes existentes
  const { data: messages } = await supabase
    .from('messages')
    .select('id, role, content, model_id, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  // Cargar lista de conversaciones para el sidebar
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(50)

  // Obtener perfil y quota del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const adminClient = createAdminClient()
  const { data: quota } = await adminClient
    .from('user_quotas')
    .select('can_use_paid_models')
    .eq('user_id', user.id)
    .single()

  const userName = profile?.full_name ?? user.email?.split('@')[0] ?? undefined

  return (
    <ChatPageClient
      conversationId={id}
      initialMessages={messages ?? []}
      conversations={conversations ?? []}
      agentSlug={conv.agent_slug}
      userRole={profile?.role ?? 'basic'}
      userName={userName}
      canUsePaidModels={quota?.can_use_paid_models ?? false}
    />
  )
}
