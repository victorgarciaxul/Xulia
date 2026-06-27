import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET — lista todos los usuarios con sus cuotas
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'No autenticado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return Response.json({ error: 'Sin permisos' }, { status: 403 })

  const { data, error } = await admin
    .from('profiles')
    .select(`
      id, full_name, role, department, created_at,
      user_quotas (
        can_use_paid_models, monthly_budget_usd, daily_request_limit,
        requests_today, requests_this_month, spend_this_month_usd, tokens_this_month
      )
    `)
    .order('created_at')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

// PATCH — actualiza cuota/permisos de un usuario
export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'No autenticado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return Response.json({ error: 'Sin permisos' }, { status: 403 })

  const body = await req.json()
  const { userId, can_use_paid_models, monthly_budget_usd, daily_request_limit, role } = body

  if (!userId) return Response.json({ error: 'userId requerido' }, { status: 400 })

  // Actualizar perfil si se cambia el rol
  if (role !== undefined) {
    await admin.from('profiles').update({ role }).eq('id', userId)
  }

  // Actualizar cuotas
  const quotaUpdate: Record<string, unknown> = {}
  if (can_use_paid_models !== undefined) quotaUpdate.can_use_paid_models = can_use_paid_models
  if (monthly_budget_usd !== undefined) quotaUpdate.monthly_budget_usd = monthly_budget_usd
  if (daily_request_limit !== undefined) quotaUpdate.daily_request_limit = daily_request_limit

  if (Object.keys(quotaUpdate).length > 0) {
    // Upsert en caso de que no exista la cuota
    const { error } = await admin.from('user_quotas').upsert({
      user_id: userId,
      ...quotaUpdate,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    if (error) return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true })
}
