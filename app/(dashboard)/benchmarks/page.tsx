'use client'

import { useState } from 'react'
import { AVAILABLE_MODELS } from '@/lib/openrouter/models'

type SortKey = 'reasoning' | 'coding' | 'writing' | 'speed' | 'context_window'
type Filter = 'all' | 'free' | 'paid'

const PROVIDER_COLORS: Record<string, string> = {
  NVIDIA:    'bg-green-100 text-green-700',
  Google:    'bg-blue-100 text-blue-700',
  OpenAI:    'bg-emerald-100 text-emerald-700',
  Meta:      'bg-indigo-100 text-indigo-700',
  Qwen:      'bg-orange-100 text-orange-700',
  Anthropic: 'bg-violet-100 text-violet-700',
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-600 w-7 text-right">{value}</span>
    </div>
  )
}

function formatContext(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

export default function BenchmarksPage() {
  const [sort, setSort] = useState<SortKey>('reasoning')
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const filtered = AVAILABLE_MODELS
    .filter(m => filter === 'all' ? true : filter === 'free' ? m.is_free : !m.is_free)
    .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'context_window') return b.context_window - a.context_window
      return b.scores[sort] - a.scores[sort]
    })

  const topReasoning = [...AVAILABLE_MODELS].sort((a,b) => b.scores.reasoning - a.scores.reasoning)[0]
  const topCoding    = [...AVAILABLE_MODELS].sort((a,b) => b.scores.coding - a.scores.coding)[0]
  const topSpeed     = [...AVAILABLE_MODELS].sort((a,b) => b.scores.speed - a.scores.speed)[0]
  const topFree      = [...AVAILABLE_MODELS].filter(m => m.is_free).sort((a,b) => (b.scores.reasoning + b.scores.coding + b.scores.writing) - (a.scores.reasoning + a.scores.coding + a.scores.writing))[0]

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Benchmark de modelos</h1>
        <p className="text-gray-400 text-sm mt-1">Comparativa de capacidades de todos los modelos disponibles en Xulia</p>
      </div>

      {/* Destacados */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Mejor razonamiento', model: topReasoning, score: topReasoning.scores.reasoning, icon: '🧠' },
          { label: 'Mejor en código',    model: topCoding,    score: topCoding.scores.coding,       icon: '💻' },
          { label: 'Más rápido',         model: topSpeed,     score: topSpeed.scores.speed,          icon: '⚡' },
          { label: 'Mejor gratuito',     model: topFree,      score: Math.round((topFree.scores.reasoning + topFree.scores.coding + topFree.scores.writing) / 3), icon: '🎁' },
        ].map(({ label, model, score, icon }) => (
          <div key={label} className="bg-white border border-[#e5e5ea] rounded-xl p-4 shadow-sm">
            <div className="text-xl mb-2">{icon}</div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{label}</div>
            <div className="text-sm font-bold text-gray-900 truncate">{model.name}</div>
            <div className="text-xs text-gray-400">{model.provider}</div>
            <div className="mt-2 text-lg font-bold text-violet-600">{score}<span className="text-xs text-gray-400 font-normal">/100</span></div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex bg-white border border-[#e5e5ea] rounded-xl p-1 gap-1 shadow-sm">
          {(['all', 'free', 'paid'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'free' ? 'Gratuitos' : 'De pago'}
            </button>
          ))}
        </div>

        <div className="flex bg-white border border-[#e5e5ea] rounded-xl p-1 gap-1 shadow-sm">
          {([
            { key: 'reasoning',     label: 'Razonamiento' },
            { key: 'coding',        label: 'Código' },
            { key: 'writing',       label: 'Redacción' },
            { key: 'speed',         label: 'Velocidad' },
            { key: 'context_window',label: 'Contexto' },
          ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sort === key ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar modelo o proveedor..."
          className="ml-auto bg-white border border-[#e5e5ea] rounded-xl px-3.5 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-violet-400 shadow-sm w-52"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white border border-[#e5e5ea] rounded-2xl shadow-sm overflow-hidden">
        {/* Cabecera */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-gray-100 bg-[#f9f9fb]">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Modelo</div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Razonamiento</div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Redacción</div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Velocidad</div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contexto</div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Coste /1M</div>
        </div>

        {/* Filas */}
        <div className="divide-y divide-gray-50">
          {filtered.map((m, i) => {
            const overall = Math.round((m.scores.reasoning + m.scores.coding + m.scores.writing) / 3)
            return (
              <div
                key={m.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 hover:bg-gray-50 transition-colors items-center"
              >
                {/* Nombre */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-sm font-bold text-gray-400 w-5 shrink-0">#{i + 1}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 truncate">{m.name}</span>
                      {m.is_free && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full shrink-0">FREE</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${PROVIDER_COLORS[m.provider] ?? 'bg-gray-100 text-gray-600'}`}>
                        {m.provider}
                      </span>
                      {m.tags?.slice(0, 1).map(t => (
                        <span key={t} className="text-[10px] text-gray-400">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scores */}
                <Bar value={m.scores.reasoning} color="bg-violet-500" />
                <Bar value={m.scores.coding}    color="bg-blue-500" />
                <Bar value={m.scores.writing}   color="bg-emerald-500" />
                <Bar value={m.scores.speed}     color="bg-amber-500" />

                {/* Contexto */}
                <div className="text-sm font-semibold text-gray-700">{formatContext(m.context_window)}</div>

                {/* Coste */}
                <div>
                  {m.is_free ? (
                    <span className="text-sm font-bold text-emerald-600">Gratis</span>
                  ) : (
                    <div>
                      <div className="text-xs text-gray-900 font-semibold">${m.cost_input_per_1m} <span className="text-gray-400 font-normal">in</span></div>
                      <div className="text-xs text-gray-500">${m.cost_output_per_1m} out</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-sm">No se encontraron modelos</div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Scores basados en benchmarks públicos (MMLU, HumanEval, MT-Bench). Se actualizan al añadir o modificar modelos.
      </p>
    </div>
  )
}
