'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

// ── Mock data (reemplazar con datos reales al conectar Drive) ──────────────
const MOCK_FILES = [
  { id: '1', name: 'Briefing Ayuntamiento Sevilla 2025.docx', type: 'doc', modified: '2025-06-20', size: '245 KB', indexed: true, folder: 'Clientes' },
  { id: '2', name: 'Pliego Licitación Turismo Andalucía.pdf', type: 'pdf', modified: '2025-06-18', size: '1.2 MB', indexed: true, folder: 'Licitaciones' },
  { id: '3', name: 'Manual de Identidad Corporativa XUL.pdf', type: 'pdf', modified: '2025-05-30', size: '8.4 MB', indexed: true, folder: 'Corporativo' },
  { id: '4', name: 'Propuesta Campaña Diputación Granada.docx', type: 'doc', modified: '2025-06-10', size: '380 KB', indexed: false, folder: 'Propuestas' },
  { id: '5', name: 'Informe Resultados Q1 2025.xlsx', type: 'sheet', modified: '2025-04-15', size: '512 KB', indexed: false, folder: 'Informes' },
  { id: '6', name: 'Tarifas y Servicios 2025.pdf', type: 'pdf', modified: '2025-01-10', size: '190 KB', indexed: true, folder: 'Corporativo' },
  { id: '7', name: 'Acta Reunión Cliente Málaga 12jun.docx', type: 'doc', modified: '2025-06-12', size: '95 KB', indexed: true, folder: 'Clientes' },
  { id: '8', name: 'Estrategia Digital 2025-2026.pptx', type: 'slides', modified: '2025-03-22', size: '4.1 MB', indexed: false, folder: 'Corporativo' },
  { id: '9', name: 'Contrato Marco Junta de Andalucía.pdf', type: 'pdf', modified: '2024-12-01', size: '620 KB', indexed: true, folder: 'Legal' },
  { id: '10', name: 'Plantilla Informe Mensual Cliente.docx', type: 'doc', modified: '2025-02-14', size: '145 KB', indexed: true, folder: 'Plantillas' },
]

const FOLDERS = ['Todos', 'Clientes', 'Licitaciones', 'Propuestas', 'Corporativo', 'Informes', 'Legal', 'Plantillas']

const FILE_ICONS: Record<string, { icon: string; bg: string; text: string }> = {
  pdf:    { icon: 'PDF',  bg: 'bg-rose-100',   text: 'text-rose-600' },
  doc:    { icon: 'DOC',  bg: 'bg-blue-100',    text: 'text-blue-600' },
  sheet:  { icon: 'XLS',  bg: 'bg-emerald-100', text: 'text-emerald-600' },
  slides: { icon: 'PPT',  bg: 'bg-amber-100',   text: 'text-amber-600' },
}

export default function ConocimientoPage() {
  const [connected] = useState(false) // false = mostrar pantalla de conexión
  const [activeFolder, setActiveFolder] = useState('Todos')
  const [search, setSearch] = useState('')
  const [indexing, setIndexing] = useState<string[]>([])
  const [indexed, setIndexed] = useState<string[]>(
    MOCK_FILES.filter(f => f.indexed).map(f => f.id)
  )

  const filtered = MOCK_FILES.filter(f => {
    const matchFolder = activeFolder === 'Todos' || f.folder === activeFolder
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase())
    return matchFolder && matchSearch
  })

  const totalIndexed = indexed.length
  const totalFiles = MOCK_FILES.length

  function handleIndex(id: string) {
    setIndexing(prev => [...prev, id])
    setTimeout(() => {
      setIndexing(prev => prev.filter(i => i !== id))
      setIndexed(prev => [...prev, id])
    }, 2000)
  }

  // ── Pantalla: sin conectar ──────────────────────────────────────────────
  if (!connected) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="max-w-lg w-full">

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-white border border-[#e5e5ea] shadow-sm flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 87.3 78" className="w-10 h-10">
                <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L38 62.5H14c-1.45 0-2.8.4-3.95 1.1L6.6 66.85z" fill="#0066da"/>
                <path d="M43.65 25L29.8 0c-1.35.8-2.5 1.9-3.3 3.3L6.6 36.65c-.8 1.4-1.2 2.95-1.2 4.5H38l5.65-16.15z" fill="#00ac47"/>
                <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H64.3l-3.95 7.65L73.55 76.8z" fill="#ea4335"/>
                <path d="M43.65 25L57.5 0H33.8L19.95 25H43.65z" fill="#00832d"/>
                <path d="M64.3 53H38l-13.85 23.8c1.35.8 2.85 1.2 4.5 1.2h45c1.65 0 3.15-.4 4.5-1.2L64.3 53z" fill="#2684fc"/>
                <path d="M73.4 26.5l-9.8-16.95c-.8-1.4-1.95-2.5-3.3-3.3L46.45 25 64.3 53h22.95c0-1.65-.4-3.15-1.2-4.5L73.4 26.5z" fill="#ffba00"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Conecta Google Drive</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Conecta el Drive de la agencia para que Xulia pueda consultar vuestros documentos al responder. Briefings, propuestas, pliegos y más.
            </p>
          </div>

          {/* Steps */}
          <div className="bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden mb-5">
            {[
              { n: '1', title: 'Conecta tu cuenta', desc: 'Autorizas a Xulia a leer los documentos del Drive de la agencia' },
              { n: '2', title: 'Selecciona carpetas', desc: 'Elige qué carpetas quieres indexar (no es necesario indexar todo)' },
              { n: '3', title: 'Indexación automática', desc: 'Xulia procesa los documentos y crea una base de conocimiento semántica' },
              { n: '4', title: 'Consulta en el Hub', desc: 'La IA buscará en tus documentos y usará la información como contexto' },
            ].map((s, i, arr) => (
              <div key={s.n} className={cn('flex items-start gap-4 px-5 py-4', i < arr.length - 1 && 'border-b border-[#f5f5f5]')}>
                <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 87.3 78" className="w-5 h-5">
              <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L38 62.5H14c-1.45 0-2.8.4-3.95 1.1L6.6 66.85z" fill="#0066da"/>
              <path d="M43.65 25L29.8 0c-1.35.8-2.5 1.9-3.3 3.3L6.6 36.65c-.8 1.4-1.2 2.95-1.2 4.5H38l5.65-16.15z" fill="#00ac47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H64.3l-3.95 7.65L73.55 76.8z" fill="#ea4335"/>
              <path d="M43.65 25L57.5 0H33.8L19.95 25H43.65z" fill="#00832d"/>
              <path d="M64.3 53H38l-13.85 23.8c1.35.8 2.85 1.2 4.5 1.2h45c1.65 0 3.15-.4 4.5-1.2L64.3 53z" fill="#2684fc"/>
              <path d="M73.4 26.5l-9.8-16.95c-.8-1.4-1.95-2.5-3.3-3.3L46.45 25 64.3 53h22.95c0-1.65-.4-3.15-1.2-4.5L73.4 26.5z" fill="#ffba00"/>
            </svg>
            Conectar con Google Drive
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Solo lectura · Nunca modificamos tus archivos</p>
        </div>
      </div>
    )
  }

  // ── Pantalla: conectado ─────────────────────────────────────────────────
  return (
    <div className="flex h-full overflow-hidden">

      {/* Sidebar carpetas */}
      <aside className="w-48 shrink-0 border-r border-[#e5e5ea] bg-white flex flex-col py-4 overflow-y-auto">
        <div className="px-4 mb-3 flex items-center gap-2">
          <svg viewBox="0 0 87.3 78" className="w-4 h-4 shrink-0">
            <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L38 62.5H14c-1.45 0-2.8.4-3.95 1.1L6.6 66.85z" fill="#0066da"/>
            <path d="M43.65 25L29.8 0c-1.35.8-2.5 1.9-3.3 3.3L6.6 36.65c-.8 1.4-1.2 2.95-1.2 4.5H38l5.65-16.15z" fill="#00ac47"/>
            <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H64.3l-3.95 7.65L73.55 76.8z" fill="#ea4335"/>
            <path d="M43.65 25L57.5 0H33.8L19.95 25H43.65z" fill="#00832d"/>
            <path d="M64.3 53H38l-13.85 23.8c1.35.8 2.85 1.2 4.5 1.2h45c1.65 0 3.15-.4 4.5-1.2L64.3 53z" fill="#2684fc"/>
            <path d="M73.4 26.5l-9.8-16.95c-.8-1.4-1.95-2.5-3.3-3.3L46.45 25 64.3 53h22.95c0-1.65-.4-3.15-1.2-4.5L73.4 26.5z" fill="#ffba00"/>
          </svg>
          <span className="text-xs font-semibold text-gray-600">Mi Drive</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Conectado" />
        </div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 mb-1">Carpetas</p>
        {FOLDERS.map(folder => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 text-sm transition-colors w-full text-left',
              activeFolder === folder ? 'text-violet-700 font-medium bg-violet-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 shrink-0">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="truncate">{folder}</span>
            {folder === 'Todos' && (
              <span className="ml-auto text-xs text-gray-400">{MOCK_FILES.length}</span>
            )}
          </button>
        ))}

        <div className="mt-auto px-4 pt-4 border-t border-[#f0f0f0]">
          <div className="text-[11px] text-gray-500 mb-1.5 font-medium">Indexados</div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${(totalIndexed / totalFiles) * 100}%` }} />
          </div>
          <p className="text-[10px] text-gray-400">{totalIndexed} de {totalFiles} archivos</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto bg-[#f4f4f6]">
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Conocimiento</h1>
              <p className="text-gray-400 text-sm mt-0.5">Documentos del Drive indexados para consulta con IA</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar documentos..."
                  className="pl-8 pr-3 py-2 text-sm border border-[#e5e5ea] rounded-lg bg-white focus:outline-none focus:border-violet-300 w-52"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e5e5ea] hover:border-gray-300 text-gray-600 text-xs font-medium rounded-lg transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Sincronizar Drive
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Archivos en Drive', value: totalFiles, icon: '📁' },
              { label: 'Indexados', value: totalIndexed, icon: '✅' },
              { label: 'Pendientes', value: totalFiles - totalIndexed, icon: '⏳' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-[#e5e5ea] rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* File list */}
          <div className="bg-white border border-[#e5e5ea] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-[#f0f0f0] grid grid-cols-12 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              <span className="col-span-6">Nombre</span>
              <span className="col-span-2">Carpeta</span>
              <span className="col-span-2">Modificado</span>
              <span className="col-span-1">Tamaño</span>
              <span className="col-span-1 text-right">Estado</span>
            </div>

            <div className="divide-y divide-[#f5f5f5]">
              {filtered.map(file => {
                const meta = FILE_ICONS[file.type] ?? FILE_ICONS.doc
                const isIndexed = indexed.includes(file.id)
                const isIndexingNow = indexing.includes(file.id)

                return (
                  <div key={file.id} className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-[#fafafa] transition-colors group">
                    {/* Nombre */}
                    <div className="col-span-6 flex items-center gap-3 min-w-0">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0', meta.bg, meta.text)}>
                        {meta.icon}
                      </div>
                      <span className="text-sm text-gray-800 truncate font-medium">{file.name}</span>
                    </div>
                    {/* Carpeta */}
                    <div className="col-span-2">
                      <span className="text-xs text-gray-400 bg-gray-50 border border-[#eee] px-2 py-0.5 rounded-full">{file.folder}</span>
                    </div>
                    {/* Fecha */}
                    <div className="col-span-2 text-xs text-gray-400">
                      {new Date(file.modified).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    {/* Tamaño */}
                    <div className="col-span-1 text-xs text-gray-400">{file.size}</div>
                    {/* Estado */}
                    <div className="col-span-1 flex justify-end">
                      {isIndexingNow ? (
                        <span className="flex items-center gap-1 text-[10px] text-violet-600 font-medium">
                          <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                          </svg>
                          Indexando
                        </span>
                      ) : isIndexed ? (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Indexado
                        </span>
                      ) : (
                        <button
                          onClick={() => handleIndex(file.id)}
                          className="text-[10px] text-gray-400 hover:text-violet-600 font-medium transition-colors opacity-0 group-hover:opacity-100"
                        >
                          + Indexar
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No se encontraron archivos{search && ` para "${search}"`}
                </div>
              )}
            </div>
          </div>

          {/* Info bar */}
          <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-violet-600">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-xs text-violet-700">
              Los documentos indexados están disponibles en el <strong>Chat</strong>. La IA los consultará automáticamente cuando sean relevantes para tu pregunta.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
