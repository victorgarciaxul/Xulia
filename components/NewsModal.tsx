'use client'

import { useEffect, useState } from 'react'

const NEWS = [
  {
    category: 'Modelos',
    categoryColor: 'bg-violet-100 text-violet-700',
    title: 'Claude 4 Opus ya disponible: razonamiento avanzado y contexto de 1M de tokens',
    summary: 'Anthropic lanza su modelo más capaz hasta la fecha, con mejoras notables en codificación, análisis y tareas de agentes autónomos.',
    date: '25 jun 2026',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
  },
  {
    category: 'Regulación',
    categoryColor: 'bg-amber-100 text-amber-700',
    title: 'La UE activa los primeros controles de la AI Act para sistemas de alto riesgo',
    summary: 'Las empresas que operen sistemas de IA en RRHH, crédito o infraestructura crítica deben acreditar conformidad antes del 1 de agosto.',
    date: '22 jun 2026',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    category: 'Agentes',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    title: 'OpenAI lanza Operator en Europa: agentes que ejecutan tareas en la web de forma autónoma',
    summary: 'El sistema puede reservar vuelos, rellenar formularios y gestionar compras sin intervención humana, con supervisión opcional.',
    date: '20 jun 2026',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    category: 'Herramientas',
    categoryColor: 'bg-blue-100 text-blue-700',
    title: 'Google NotebookLM añade soporte para vídeo y genera podcasts multilingües',
    summary: 'La herramienta de síntesis de conocimiento de Google ahora procesa vídeos de YouTube y genera resúmenes en audio en más de 20 idiomas.',
    date: '18 jun 2026',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
      </svg>
    ),
  },
  {
    category: 'Investigación',
    categoryColor: 'bg-rose-100 text-rose-700',
    title: 'Meta presenta un modelo de lenguaje que aprende de forma continua sin olvidar',
    summary: 'El nuevo enfoque de aprendizaje incremental permite actualizar modelos con nueva información sin necesidad de reentrenamiento completo.',
    date: '15 jun 2026',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
  },
]

const SESSION_KEY = 'xulia_news_seen'

export function NewsModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY)
    if (!seen) {
      // Pequeño delay para que no aparezca bruscamente al cargar
      const t = setTimeout(() => setOpen(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function close() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-violet-600">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Últimas noticias de IA</h2>
              <p className="text-xs text-gray-400">Semana del 23 de junio de 2026</p>
            </div>
          </div>
          <button
            onClick={close}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* News list */}
        <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
          {NEWS.map((item, i) => (
            <div key={i} className="px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                {/* Icono categoría */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.categoryColor.replace('text-', 'text-').split(' ')[0]} bg-opacity-60`}
                  style={{ background: item.categoryColor.includes('violet') ? '#ede9fe' : item.categoryColor.includes('amber') ? '#fef3c7' : item.categoryColor.includes('emerald') ? '#d1fae5' : item.categoryColor.includes('blue') ? '#dbeafe' : '#fee2e2' }}>
                  <span className={item.categoryColor.split(' ')[1]}>
                    {item.icon}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.categoryColor}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 leading-snug mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">Actualizado cada semana · Solo visible al iniciar sesión</p>
          <button
            onClick={close}
            className="shrink-0 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
