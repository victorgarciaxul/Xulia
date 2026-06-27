import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminUsersPanel } from '@/components/admin/AdminUsersPanel'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return <div className="p-8 text-sm text-gray-500">Sin permisos. Rol: {profile?.role ?? 'null'}</div>
  }

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, role, department, created_at')
    .order('full_name', { ascending: true, nullsFirst: false })

  const { data: quotas } = await admin
    .from('user_quotas')
    .select('user_id, can_use_paid_models, monthly_budget_usd, daily_request_limit, requests_today, requests_this_month, spend_this_month_usd, tokens_this_month')

  const quotaMap = Object.fromEntries((quotas ?? []).map(q => [q.user_id, q]))

  const users = (profiles ?? []).map(p => ({
    ...p,
    quota: quotaMap[p.id] ?? null,
  }))

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Administración</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Gestión de usuarios, permisos y límites de uso de IA
        </p>
      </div>
      <AdminUsersPanel initialUsers={users} />
    </div>
  )
}
