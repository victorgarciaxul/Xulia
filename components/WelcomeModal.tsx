'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'xulia_welcome_dismissed_v2'

export function WelcomeModal() {
  const [open, setOpen] = useState(false)
  const [neverShow, setNeverShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      const t = setTimeout(() => setOpen(true), 400)
      return () => clearTimeout(t)
    }
  }, [])

  function close() {
    if (neverShow) localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      {/* Modal */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
        style={{ animation: 'welcomeFadeIn 0.4s ease-out' }}>

        <style>{`
          @keyframes welcomeFadeIn {
            from { opacity: 0; transform: translateY(16px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes orb1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, -20px) scale(1.15); }
          }
          @keyframes orb2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, 25px) scale(1.1); }
          }
          @keyframes nodePulse0 { 0%,100%{r:3;opacity:.7} 50%{r:5;opacity:1} }
          @keyframes nodePulse1 { 0%,100%{r:3;opacity:.5} 50%{r:5;opacity:.9} }
          @keyframes nodePulse2 { 0%,100%{r:3;opacity:.6} 50%{r:4.5;opacity:1} }
          @keyframes nodePulse3 { 0%,100%{r:2.5;opacity:.4} 50%{r:4;opacity:.8} }
          @keyframes nodePulse4 { 0%,100%{r:3;opacity:.7} 50%{r:5;opacity:1} }
          @keyframes nodePulse5 { 0%,100%{r:2;opacity:.3} 50%{r:3.5;opacity:.7} }
          @keyframes nodePulse6 { 0%,100%{r:3;opacity:.6} 50%{r:5;opacity:.95} }
          @keyframes nodePulse7 { 0%,100%{r:2.5;opacity:.5} 50%{r:4;opacity:.9} }
          @keyframes dash { to { stroke-dashoffset: -60; } }
          @keyframes dashSlow { to { stroke-dashoffset: -80; } }
        `}</style>

        {/* Fondo oscuro con orbs de luz */}
        <div className="absolute inset-0 bg-[#0d1117] overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #3b1f8c, transparent 70%)', animation: 'orb1 8s ease-in-out infinite' }} />
          <div className="absolute -bottom-20 right-0 w-80 h-80 rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #1a3a6b, transparent 70%)', animation: 'orb2 10s ease-in-out infinite' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
          {/* Noise / grain overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

          {/* Neural network nodes — bottom decoration */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 640 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.55 }}
          >
            {/* Connections */}
            {[
              [60,120, 160,90], [60,120, 200,110], [160,90, 280,105],
              [200,110, 280,105], [160,90, 240,60], [240,60, 360,75],
              [280,105, 360,75], [280,105, 380,120], [360,75, 480,88],
              [380,120, 480,88], [360,75, 460,50], [460,50, 560,65],
              [480,88, 560,65], [480,88, 580,110], [560,65, 620,85],
              [240,60, 320,30], [320,30, 460,50],
            ].map(([x1,y1,x2,y2], i) => (
              <line key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#3b82f6' : '#6366f1'}
                strokeWidth="1"
                strokeDasharray="6 6"
                style={{ animation: `${i % 2 === 0 ? 'dash' : 'dashSlow'} ${2.5 + (i % 4) * 0.4}s linear infinite` }}
              />
            ))}
            {/* Nodes */}
            {[
              [60,120,0],[160,90,1],[200,110,2],[240,60,3],
              [280,105,4],[320,30,5],[360,75,6],[380,120,7],
              [460,50,0],[480,88,1],[560,65,2],[580,110,3],[620,85,4],
            ].map(([cx,cy,anim], i) => (
              <circle key={i}
                cx={cx} cy={cy} r="3"
                fill={i % 4 === 0 ? '#a78bfa' : i % 4 === 1 ? '#60a5fa' : i % 4 === 2 ? '#818cf8' : '#c4b5fd'}
                style={{ animation: `nodePulse${anim} ${2 + (i % 5) * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>
        </div>

        {/* Contenido */}
        <div className="relative z-10 px-10 py-12 flex flex-col items-center text-center">

          {/* Botón cerrar */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Logo XULIA */}
          <div className="mb-8">
            <img
              src="/logo-white.svg"
              alt="XULIA"
              className="h-14 w-auto"
            />
          </div>

          <p className="text-xs tracking-widest text-white/40 uppercase mb-8">
            Plataforma corporativa de inteligencia artificial
          </p>

          {/* Separador */}
          <div className="w-12 h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />

          {/* Descripción */}
          <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-3">
            Xulia es tu espacio de trabajo impulsado por IA. Chatea con los mejores modelos del mercado, activa agentes especializados para tu área y automatiza procesos repetitivos.
          </p>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-10">
            Accede a la Academia para formarte, gestiona tu base de conocimiento y analiza el rendimiento de tu equipo, todo desde un solo lugar.
          </p>

          {/* CTA */}
          <button
            onClick={close}
            className="px-8 py-3 rounded-full text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-all tracking-wider uppercase mb-6"
            style={{ backdropFilter: 'blur(4px)' }}
          >
            Empezar
          </button>

          {/* No volver a mostrar */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => setNeverShow(v => !v)}
              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                neverShow
                  ? 'bg-violet-600 border-violet-600'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {neverShow && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-2.5 h-2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors select-none">
              No volver a mostrar
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
