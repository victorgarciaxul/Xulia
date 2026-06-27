import { createAdminClient } from '@/lib/supabase/admin'
import { getModelById } from '@/lib/openrouter/models'

export interface QuotaResult {
  allowed: boolean
  reason?: string
  fallbackModel?: string
}

export async function checkQuota(userId: string, modelId: string): Promise<QuotaResult> {
  const supabase = createAdminClient()

  const { data: quota } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!quota) return { allowed: false, reason: 'Sin cuota configurada. Contacta con el administrador.' }

  // Reset diario si es necesario
  const today = new Date().toISOString().split('T')[0]
  if (quota.last_daily_reset < today) {
    await supabase.from('user_quotas')
      .update({ requests_today: 0, last_daily_reset: today })
      .eq('user_id', userId)
    quota.requests_today = 0
  }

  // Verificar límite diario
  if (quota.requests_today >= quota.daily_request_limit) {
    return {
      allowed: false,
      reason: `Has alcanzado tu límite diario de ${quota.daily_request_limit} consultas. Se reinicia mañana.`,
    }
  }

  // Verificar si el modelo pedido es de pago y el usuario no tiene acceso
  const model = getModelById(modelId)
  if (model && !model.is_free && !quota.can_use_paid_models) {
    // Caer al modelo gratuito por defecto en vez de bloquear
    return {
      allowed: true,
      fallbackModel: 'nvidia/nemotron-nano-9b-v2:free',
      reason: 'Modelo cambiado al gratuito por defecto (sin acceso a modelos de pago).',
    }
  }

  // Verificar presupuesto mensual (solo si tiene límite)
  if (quota.monthly_budget_usd > 0 && quota.spend_this_month_usd >= quota.monthly_budget_usd) {
    return {
      allowed: true,
      fallbackModel: 'nvidia/nemotron-nano-9b-v2:free',
      reason: 'Presupuesto mensual agotado. Cambiado a modelo gratuito hasta el próximo mes.',
    }
  }

  return { allowed: true }
}

export async function updateQuota(userId: string, usage: {
  tokens_input: number
  tokens_output: number
  cost_usd: number
}) {
  const supabase = createAdminClient()
  await supabase.from('user_quotas').update({
    requests_today: supabase.rpc('increment', { x: 1 }),
    requests_this_month: supabase.rpc('increment', { x: 1 }),
    tokens_this_month: supabase.rpc('increment', { x: usage.tokens_input + usage.tokens_output }),
    spend_this_month_usd: supabase.rpc('increment', { x: usage.cost_usd }),
    updated_at: new Date().toISOString(),
  }).eq('user_id', userId)
}
