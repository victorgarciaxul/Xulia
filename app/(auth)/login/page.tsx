'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type View = 'login' | 'reset' | 'reset-sent'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('login')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }
    router.push('/hub')
    router.refresh()
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError('No se pudo enviar el correo. Inténtalo de nuevo.')
      setLoading(false)
      return
    }
    setView('reset-sent')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a14]">

      {/* ── Fondo animado IA ── */}
      <style>{`
        @keyframes floatNode {
          0%, 100% { transform: translateY(0px) scale(1); opacity: var(--op); }
          50% { transform: translateY(-18px) scale(1.08); opacity: calc(var(--op) * 1.4); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes dashFlow {
          to { stroke-dashoffset: -80; }
        }
        @keyframes gridFade {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.07; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bg-animated { animation: gradientShift 12s ease infinite; background-size: 300% 300%; }
        .grid-fade { animation: gridFade 6s ease-in-out infinite; }
        .card-in { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-animated"
        style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #0f0a2e 30%, #0a1628 60%, #0a0a14 100%)' }} />

      {/* Grid tecnológico */}
      <svg className="absolute inset-0 w-full h-full grid-fade" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#7c3aed" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Red neuronal SVG */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.35 }}>
        {/* Conexiones */}
        {[
          [120,180, 280,320],[280,320, 180,480],[280,320, 420,260],[420,260, 560,380],
          [560,380, 680,200],[680,200, 820,340],[820,340, 960,180],[960,180, 1100,300],
          [1100,300, 1240,160],[120,180, 220,80],[220,80, 420,260],[560,380, 600,520],
          [600,520, 750,600],[750,600, 900,520],[900,520, 1050,620],[1050,620, 1200,500],
          [180,480, 300,600],[300,600, 450,540],[450,540, 600,520],[820,340, 860,480],
          [860,480, 1000,400],[1000,400, 1100,300],[1240,160, 1380,260],[1380,260, 1450,150],
        ].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#3b82f6' : '#6366f1'}
            strokeWidth="0.8" strokeDasharray="6 8"
            style={{ animation: `dashFlow ${3 + (i % 5) * 0.6}s linear infinite`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
        {/* Nodos */}
        {([
          [120,180,0.8,0],[280,320,1,1],[180,480,0.6,2],[420,260,0.9,3],
          [560,380,0.85,4],[680,200,0.7,5],[820,340,1,0],[960,180,0.75,1],
          [1100,300,0.9,2],[1240,160,0.65,3],[220,80,0.5,4],[600,520,0.8,5],
          [750,600,0.7,0],[900,520,0.85,1],[1050,620,0.6,2],[1200,500,0.75,3],
          [300,600,0.55,4],[450,540,0.8,5],[860,480,0.7,0],[1000,400,0.65,1],
          [1380,260,0.6,2],[1450,150,0.5,3],
        ] as [number,number,number,number][]).map(([cx,cy,op,d], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="12" fill="#7c3aed" opacity="0.08"
              style={{ animation: `pulseRing 3s ease-out infinite`, animationDelay: `${d * 0.8}s` }} />
            <circle cx={cx} cy={cy} r={i % 4 === 0 ? 5 : i % 4 === 1 ? 4 : i % 4 === 2 ? 3.5 : 3}
              fill={i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#60a5fa' : '#818cf8'}
              style={{ '--op': op, animation: `floatNode ${4 + (i % 6) * 0.7}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` } as React.CSSProperties}
            />
          </g>
        ))}
      </svg>

      {/* Orbs de luz ambiente */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-sm px-4 card-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo-white.svg" alt="XULIA" className="h-10 w-auto mx-auto mb-2" />
          <p className="text-xs text-white/40 tracking-widest uppercase">Plataforma Corporativa de IA</p>
        </div>

        {/* Card glassmorphism */}
        <div className="rounded-2xl p-8 mb-5"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}>

          {/* LOGIN */}
          {view === 'login' && (
            <>
              <h2 className="text-base font-semibold text-white mb-5">Iniciar sesión</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wide">Email corporativo</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="nombre@empresa.com"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-white/50 font-medium uppercase tracking-wide">Contraseña</label>
                    <button type="button" onClick={() => { setView('reset'); setError(null) }}
                      className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 mt-1"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                  {loading ? 'Entrando…' : 'Entrar'}
                </button>
              </form>
            </>
          )}

          {/* RESET PASSWORD */}
          {view === 'reset' && (
            <>
              <button onClick={() => { setView('login'); setError(null) }}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Volver
              </button>
              <h2 className="text-base font-semibold text-white mb-1">Recuperar contraseña</h2>
              <p className="text-xs text-white/40 mb-5">Introduce tu email y te enviaremos un enlace para restablecerla.</p>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wide">Email corporativo</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="nombre@empresa.com"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                  {loading ? 'Enviando…' : 'Enviar enlace'}
                </button>
              </form>
            </>
          )}

          {/* RESET SENT */}
          {view === 'reset-sent' && (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7 text-violet-400">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-1">¡Correo enviado!</h3>
              <p className="text-xs text-white/50 mb-5 leading-relaxed">
                Hemos enviado un enlace de recuperación a <span className="text-white/80 font-medium">{email}</span>. Revisa también el spam.
              </p>
              <button onClick={() => { setView('login'); setEmail('') }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white/70 border border-white/10 hover:bg-white/5 transition-all">
                Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>

        {/* Built with */}
        <div className="text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-widest mb-3">Built with</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {[
              { label: 'Next.js', color: '#ffffff',
                icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.859 8.292 8.208 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.499-.054z"/></svg> },
              { label: 'Supabase', color: '#3ecf8e',
                icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"/></svg> },
              { label: 'React', color: '#61dafb',
                icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.12.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.468zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.468a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.258c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.468C4.188 5.283 4.8 2.942 6.321 2.083c1.52-.859 3.779.297 5.864 2.302l.34.331-.337.335A23.552 23.552 0 0 0 9.658 7.52l-.138.193-.235.02a23.657 23.657 0 0 0-3.758.47l-.217.043zm1.57-5.611c-.55 0-1.015.153-1.372.36-1.055.6-1.432 2.353-.948 4.757a25.005 25.005 0 0 1 3.171-.403 24.847 24.847 0 0 1 2.444-2.763c-1.537-1.34-2.96-1.951-3.295-1.951zM14.28 22.073c-.904 0-1.953-.408-3.083-1.288l-.34-.261.34-.261a23.187 23.187 0 0 0 2.516-2.41l.138-.152.201-.029a23.395 23.395 0 0 0 3.585-.617l.434-.12.133.468c.931 3.257.323 5.596-1.199 6.455a2.547 2.547 0 0 1-1.725.215zm-1.913-1.56c1.417 1.049 2.77 1.493 3.551 1.049.849-.48 1.223-2.222.748-4.607a24.77 24.77 0 0 1-3.023.501 24.761 24.761 0 0 1-1.276 3.057zM9.72 22.073c-.601 0-1.179-.15-1.726-.215-1.52-.859-2.129-3.198-1.199-6.455l.133-.468.434.12a23.396 23.396 0 0 0 3.585.617l.201.029.138.152a23.187 23.187 0 0 0 2.516 2.41l.34.261-.34.261C12.672 21.665 11.623 22.073 9.72 22.073zm-1.913-5.558c-.476 2.385-.101 4.127.748 4.607.782.444 2.134 0 3.551-1.049a24.757 24.757 0 0 1-1.276-3.057 24.765 24.765 0 0 1-3.023-.501zm10.203-5.577c-.906 0-1.869-.12-2.861-.355l-.217-.052-.138-.193a23.29 23.29 0 0 0-2.53-2.969l-.337-.335.34-.331c2.085-2.005 4.344-3.161 5.864-2.302 1.521.859 2.133 3.2 1.202 6.455l-.133.468-.427-.119a23.35 23.35 0 0 0-.763-.267zm-2.65-.96a24.888 24.888 0 0 1 2.406.283c.483-2.404.107-4.157-.948-4.757-.782-.443-2.134 0-3.551 1.049a24.759 24.759 0 0 1 2.093 3.425z"/></svg> },
              { label: 'TypeScript', color: '#3178c6',
                icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg> },
              { label: 'Tailwind', color: '#38bdf8',
                icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg> },
              { label: 'OpenRouter', color: '#a78bfa',
                icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg> },
            ].map(({ label, color, icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color }}>
                  {icon}
                </div>
                <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
