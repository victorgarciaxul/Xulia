'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'

const USD_TO_EUR = 0.92

const ROLE_LABELS: Record<string, string> = {
  basic:    'Básico',
  standard: 'Estándar',
  advanced: 'Avanzado',
  admin:    'Admin',
}

const ROLE_COLORS: Record<string, string> = {
  basic:    'bg-gray-100 text-gray-600',
  standard: 'bg-blue-50 text-blue-700',
  advanced: 'bg-violet-50 text-violet-700',
  admin:    'bg-rose-50 text-rose-700',
}

type Quota = {
  user_id?: string
  can_use_paid_models: boolean
  monthly_budget_usd: number
  daily_request_limit: number
  requests_today: number
  requests_this_month: number
  spend_this_month_usd: number
  tokens_this_month: number
}

type UserRow = {
  id: string
  full_name: string | null
  role: string
  department: string | null
  created_at: string
  quota: Quota | null
}

const DEFAULT_QUOTA: Quota = {
  can_use_paid_models: false,
  monthly_budget_usd: 0,
  daily_request_limit: 50,
  requests_today: 0,
  requests_this_month: 0,
  spend_this_month_usd: 0,
  tokens_this_month: 0,
}

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function fmtTokens(n: number) {
  if (n > 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n > 1000) return `${(n / 1000).toFixed(0)}K`
  return String(n)
}

export function AdminUsersPanel({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [openId, setOpenId] = useState<string | null>(null)
  const [form, setForm] = useState<{ role: string; paid: boolean; budget: number; dailyLimit: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  const totalSpend = users.reduce((s, u) => s + Number(u.quota?.spend_this_month_usd ?? 0), 0)
  const totalTokens = users.reduce((s, u) => s + Number(u.quota?.tokens_this_month ?? 0), 0)
  const totalReqs = users.reduce((s, u) => s + Number(u.quota?.requests_this_month ?? 0), 0)

  function openEdit(u: UserRow) {
    const q = u.quota ?? DEFAULT_QUOTA
    setOpenId(u.id)
    setForm({
      role: u.role,
      paid: q.can_use_paid_models,
      budget: Number(q.monthly_budget_usd),
      dailyLimit: q.daily_request_limit,
    })
  }

  function close() { setOpenId(null); setForm(null) }

  async function save(userId: string) {
    if (!form) return
    setSaving(true)
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        role: form.role,
        can_use_paid_models: form.paid,
        monthly_budget_usd: form.budget,
        daily_request_limit: form.dailyLimit,
      }),
    })
    setUsers(prev => prev.map(u => u.id !== userId ? u : {
      ...u,
      role: form.role,
      quota: { ...(u.quota ?? DEFAULT_QUOTA), can_use_paid_models: form.paid, monthly_budget_usd: form.budget, daily_request_limit: form.dailyLimit }
    }))
    setSaving(false)
    setSavedId(userId)
    setTimeout(() => setSavedId(null), 2000)
    close()
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Gasto este mes', value: `$${totalSpend.toFixed(2)}`, sub: `≈ €${(totalSpend * USD_TO_EUR).toFixed(2)}`, icon: 'coin' as const },
          { label: 'Tokens consumidos', value: fmtTokens(totalTokens), sub: 'este mes', icon: 'cpu' as const },
          { label: 'Consultas totales', value: totalReqs, sub: 'este mes', icon: 'chat' as const },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e5e5ea] rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
              <Icon name={s.icon} className="text-violet-600" size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-[10px] text-gray-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User list */}
      <div className="bg-white border border-[#e5e5ea] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f0f0]">
          <h2 className="text-sm font-semibold text-gray-800">{users.length} usuarios</h2>
        </div>

        <div className="divide-y divide-[#f5f5f5]">
          {users.map(u => {
            const q = u.quota ?? DEFAULT_QUOTA
            const isOpen = openId === u.id
            const spendPct = Number(q.monthly_budget_usd) > 0
              ? Math.min(100, (Number(q.spend_this_month_usd) / Number(q.monthly_budget_usd)) * 100)
              : 0

            return (
              <div key={u.id} className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {initials(u.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {u.full_name ?? <span className="text-gray-400 italic">Sin nombre</span>}
                      </p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-500'}`}>
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                      {q.can_use_paid_models && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Pago ✓
                        </span>
                      )}
                      {savedId === u.id && (
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                          <Icon name="check" size={10} /> Guardado
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {Number(q.requests_today)} hoy · {Number(q.requests_this_month)} este mes · ${Number(q.spend_this_month_usd).toFixed(3)} gastado
                    </p>
                  </div>
                  <button
                    onClick={() => isOpen ? close() : openEdit(u)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                      isOpen ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
                    }`}
                  >
                    {isOpen ? 'Cerrar' : 'Editar'}
                  </button>
                </div>

                {/* Progress bar */}
                {!isOpen && Number(q.monthly_budget_usd) > 0 && (
                  <div className="mt-2 pl-12">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${spendPct > 80 ? 'bg-rose-400' : spendPct > 50 ? 'bg-amber-400' : 'bg-violet-400'}`}
                        style={{ width: `${spendPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {spendPct.toFixed(0)}% del límite (€{(Number(q.monthly_budget_usd) * USD_TO_EUR).toFixed(0)}/mes)
                    </p>
                  </div>
                )}

                {/* Edit panel */}
                {isOpen && form && (
                  <div className="mt-4 bg-[#f9f9fb] border border-[#e5e5ea] rounded-xl p-5 space-y-5">

                    {/* Rol */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Rol</p>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(ROLE_LABELS).map(([val, label]) => (
                          <button
                            key={val}
                            onClick={() => setForm(f => f ? { ...f, role: val } : f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              form.role === val
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-600 border-[#e5e5ea] hover:border-gray-400'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggle modelos de pago */}
                    <div className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Acceso a modelos de pago</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">GPT-4o, Claude Sonnet, Gemini Pro, Claude Opus</p>
                      </div>
                      <button
                        onClick={() => setForm(f => f ? { ...f, paid: !f.paid } : f)}
                        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.paid ? 'bg-violet-600' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.paid ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>

                    {/* Presupuesto (solo si pago activado) */}
                    {form.paid && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-3">Presupuesto mensual</p>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="text-[10px] text-gray-400 block mb-1">Euros (€)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                              <input
                                type="number" min={0} step={5}
                                value={Math.round(form.budget * USD_TO_EUR)}
                                onChange={e => setForm(f => f ? { ...f, budget: Number(e.target.value) / USD_TO_EUR } : f)}
                                className="w-full pl-7 pr-3 py-2 text-sm border border-[#e5e5ea] rounded-lg focus:outline-none focus:border-violet-400 bg-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-400 block mb-1">Dólares ($)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                              <input
                                type="number" min={0} step={5}
                                value={form.budget.toFixed(2)}
                                onChange={e => setForm(f => f ? { ...f, budget: Number(e.target.value) } : f)}
                                className="w-full pl-7 pr-3 py-2 text-sm border border-[#e5e5ea] rounded-lg focus:outline-none focus:border-violet-400 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="bg-white border border-[#e5e5ea] rounded-lg p-3 grid grid-cols-2 gap-2 text-[11px]">
                          {[
                            { name: 'GPT-4o', cost: 2.5 },
                            { name: 'Claude Sonnet', cost: 3 },
                            { name: 'Gemini Pro', cost: 1.25 },
                            { name: 'Claude Opus', cost: 15 },
                          ].map(m => (
                            <div key={m.name}>
                              <p className="text-gray-400">{m.name} (${m.cost}/1M)</p>
                              <p className="font-semibold text-gray-700">≈ {((form.budget / m.cost) * 1000).toFixed(0)}K tokens</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5">Al agotar el límite, cambia automáticamente al modelo gratuito.</p>
                      </div>
                    )}

                    {/* Límite diario */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Límite de consultas diarias</p>
                      <div className="flex items-center gap-3">
                        <input
                          type="range" min={10} max={500} step={10}
                          value={form.dailyLimit}
                          onChange={e => setForm(f => f ? { ...f, dailyLimit: Number(e.target.value) } : f)}
                          className="flex-1 accent-violet-600"
                        />
                        <span className="text-sm font-bold text-gray-800 w-20 text-right shrink-0">{form.dailyLimit}/día</span>
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={close} className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
                        Cancelar
                      </button>
                      <button
                        onClick={() => save(u.id)}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-5 py-2 bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        {saving
                          ? <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                          : <Icon name="check" size={13} />
                        }
                        Guardar cambios
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
