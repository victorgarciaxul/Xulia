'use client'

interface Props {
  size?: number
  animated?: boolean
  className?: string
}

export function RobotIcon({ size = 96, animated = true, className = '' }: Props) {
  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      {animated && (
        <style>{`
          @keyframes robotFloat {
            0%, 100% { transform: translateY(0px) rotateY(0deg); }
            25% { transform: translateY(-6px) rotateY(15deg); }
            50% { transform: translateY(-3px) rotateY(0deg); }
            75% { transform: translateY(-6px) rotateY(-15deg); }
          }
          @keyframes robotGlow {
            0%, 100% { filter: drop-shadow(0 0 12px rgba(139,92,246,0.6)) drop-shadow(0 0 24px rgba(109,40,217,0.4)); }
            50% { filter: drop-shadow(0 0 20px rgba(167,139,250,0.9)) drop-shadow(0 0 40px rgba(139,92,246,0.5)); }
          }
          @keyframes eyeBlink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes eyeGlow {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 1; filter: brightness(1.4); }
          }
          @keyframes scanLine {
            0% { transform: translateY(0px); opacity: 0.6; }
            100% { transform: translateY(56px); opacity: 0; }
          }
          @keyframes antennaPulse {
            0%, 100% { opacity: 0.5; r: 2.5; }
            50% { opacity: 1; r: 4; }
          }
          .ri-float { animation: robotFloat 4s ease-in-out infinite, robotGlow 3s ease-in-out infinite; }
          .ri-blink { animation: eyeBlink 5s ease-in-out infinite; transform-origin: center; }
          .ri-eye-glow { animation: eyeGlow 2s ease-in-out infinite; }
          .ri-scan { animation: scanLine 2.5s linear infinite; }
          .ri-antenna { animation: antennaPulse 1.5s ease-in-out infinite; }
        `}</style>
      )}
      <svg
        viewBox="0 0 96 96"
        width={size}
        height={size}
        className={animated ? 'ri-float' : ''}
        style={{ perspective: '200px' }}
      >
        <defs>
          <radialGradient id="ri-headGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="45%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b0764" />
          </radialGradient>
          <radialGradient id="ri-faceGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="60%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#2e1065" />
          </radialGradient>
          <radialGradient id="ri-eyeGradL" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </radialGradient>
          <radialGradient id="ri-eyeGradR" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="40%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </radialGradient>
          <filter id="ri-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="ri-mouthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </linearGradient>
          <clipPath id="ri-faceClip">
            <rect x="18" y="22" width="60" height="56" rx="10" />
          </clipPath>
        </defs>

        {/* Antenna */}
        <line x1="48" y1="22" x2="48" y2="10" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="48" cy="8" r="3.5" fill="#a78bfa" className="ri-antenna" />

        {/* Head */}
        <rect x="16" y="22" width="64" height="58" rx="12" fill="url(#ri-headGrad)" />

        {/* Face panel */}
        <rect x="20" y="27" width="56" height="48" rx="8" fill="url(#ri-faceGrad)" opacity="0.85" />

        {/* Scan line */}
        <rect x="20" y="27" width="56" height="3" fill="#a78bfa" opacity="0.3" className="ri-scan" clipPath="url(#ri-faceClip)" />

        {/* Left eye */}
        <g className="ri-blink" style={{ transformOrigin: '34px 45px' }}>
          <circle cx="34" cy="45" r="8" fill="#0f172a" />
          <circle cx="34" cy="45" r="6" fill="url(#ri-eyeGradL)" className="ri-eye-glow" filter="url(#ri-glow)" />
          <circle cx="34" cy="45" r="2.5" fill="#0ea5e9" />
          <circle cx="31.5" cy="42.5" r="1.5" fill="white" opacity="0.8" />
        </g>

        {/* Right eye */}
        <g className="ri-blink" style={{ transformOrigin: '62px 45px' }}>
          <circle cx="62" cy="45" r="8" fill="#0f172a" />
          <circle cx="62" cy="45" r="6" fill="url(#ri-eyeGradR)" className="ri-eye-glow" filter="url(#ri-glow)" />
          <circle cx="62" cy="45" r="2.5" fill="#0ea5e9" />
          <circle cx="59.5" cy="42.5" r="1.5" fill="white" opacity="0.8" />
        </g>

        {/* Nose dot */}
        <circle cx="48" cy="55" r="1.5" fill="#a78bfa" opacity="0.6" />

        {/* Mouth */}
        <rect x="30" y="62" width="36" height="7" rx="3.5" fill="#0f172a" />
        <rect x="32" y="63.5" width="32" height="4" rx="2" fill="url(#ri-mouthGrad)" />
        {[36, 42, 48, 54, 58].map((x) => (
          <line key={x} x1={x} y1="63.5" x2={x} y2="67.5" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
        ))}

        {/* Ears */}
        <rect x="10" y="34" width="6" height="14" rx="3" fill="#7c3aed" />
        <rect x="80" y="34" width="6" height="14" rx="3" fill="#7c3aed" />
        <circle cx="13" cy="41" r="2" fill="#a78bfa" opacity="0.6" />
        <circle cx="83" cy="41" r="2" fill="#a78bfa" opacity="0.6" />

        {/* Neck */}
        <rect x="36" y="80" width="24" height="8" rx="3" fill="#6d28d9" opacity="0.7" />
        {[40, 48, 56].map((x) => (
          <line key={x} x1={x} y1="80" x2={x} y2="88" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
        ))}
      </svg>
    </div>
  )
}
