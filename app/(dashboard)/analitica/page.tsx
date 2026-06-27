import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'

export default async function AnaliticaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: quota } = await supabase
    .from('user_quotas').select('*').eq('user_id', user.id).single()

  const { count: totalConversations } = await supabase
    .from('conversations').select('*', { count: 'exact', head: true }).eq('user_id', user.id)

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: logs } = await supabase
    .from('usage_logs')
    .select('model_id, tokens_input, tokens_output, cost_usd, created_at, agent_slug')
    .eq('user_id', user.id)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(100)

  const totalCost = (logs ?? []).reduce((s, l) => s + (l.cost_usd ?? 0), 0)
  const totalTokens = (logs ?? []).reduce((s, l) => s + (l.tokens_input ?? 0) + (l.tokens_output ?? 0), 0)

  const modelUsage = (logs ?? []).reduce<Record<string, number>>((acc, l) => {
    acc[l.model_id] = (acc[l.model_id] ?? 0) + 1
    return acc
  }, {})
  const topModels = Object.entries(modelUsage).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const stats = [
    { icon: 'messages' as const, label: 'Conversaciones',    value: totalConversations ?? 0 },
    { icon: 'zap' as const,      label: 'Peticiones (30d)',  value: logs?.length ?? 0 },
    { icon: 'cpu' as const,      label: 'Tokens usados',     value: formatTokens(totalTokens) },
    { icon: 'euro' as const,     label: 'Gasto (30d)',       value: `$${totalCost.toFixed(4)}` },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analítica</h1>
        <p className="text-gray-400 mt-1 text-sm">Tu actividad en los últimos 30 días</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white border border-[#e5e5ea] rounded-xl p-5 shadow-sm">
            <Icon name={stat.icon} className="text-violet-500 mb-3" size={20} />
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cuota */}
        <div className="bg-white border border-[#e5e5ea] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Icon name="bar-chart" className="text-violet-500" size={16} />
            Cuota diaria
          </h2>
          {quota ? (
            <div className="space-y-5">
              <QuotaBar label="Tokens hoy" used={quota.tokens_used_today ?? 0} limit={quota.daily_token_limit ?? 100000} />
              <QuotaBar label="Peticiones hoy" used={quota.requests_today ?? 0} limit={quota.daily_request_limit ?? 100} />
              <QuotaBar label="Gasto del mes" used={quota.cost_usd_month ?? 0} limit={quota.monthly_budget_usd ?? 50} format="usd" />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Sin datos de cuota</p>
          )}
        </div>

        {/* Top modelos */}
        <div className="bg-white border border-[#e5e5ea] rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Icon name="cpu" className="text-violet-500" size={16} />
            Modelos más usados
          </h2>
          {topModels.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin actividad aún</p>
          ) : (
            <div className="space-y-3">
              {topModels.map(([model, count], i) => (
                <div key={model} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-300 w-4">{i + 1}</span>
                  <span className="text-sm text-gray-600 truncate flex-1">
                    {model.split('/').pop()?.replace(':free', '') ?? model}
                  </span>
                  <span className="text-sm font-semibold text-violet-600">{count}×</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Últimas peticiones */}
      <div className="mt-6 bg-white border border-[#e5e5ea] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#f0f0f0] flex items-center gap-2">
          <Icon name="zap" className="text-violet-500" size={15} />
          <h2 className="font-semibold text-gray-800 text-sm">Últimas peticiones</h2>
        </div>
        {!logs?.length ? (
          <p className="text-gray-400 text-sm p-6">Sin actividad reciente</p>
        ) : (
          <div className="divide-y divide-[#f5f5f5]">
            {logs.slice(0, 10).map((log, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3 text-sm hover:bg-[#fafafa]">
                <span className="text-gray-400 text-xs w-28 shrink-0">
                  {new Date(log.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-gray-600 truncate flex-1">
                  {log.model_id.split('/').pop()?.replace(':free', '') ?? log.model_id}
                </span>
                <span className="text-gray-400 text-xs w-20 text-right">
                  {((log.tokens_input ?? 0) + (log.tokens_output ?? 0)).toLocaleString()} tok
                </span>
                <span className="text-gray-400 text-xs w-16 text-right">
                  ${(log.cost_usd ?? 0).toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function QuotaBar({ label, used, limit, format }: { label: string; used: number; limit: number; format?: 'usd' }) {
  const pct = Math.min((used / limit) * 100, 100)
  const color = pct > 85 ? 'bg-rose-500' : pct > 60 ? 'bg-amber-400' : 'bg-violet-500'
  const fmt = (v: number) => format === 'usd' ? `$${v.toFixed(2)}` : v.toLocaleString()

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>{label}</span>
        <span className="font-medium">{fmt(used)} / {fmt(limit)}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}
