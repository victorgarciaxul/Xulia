'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  open: boolean
  onClose: () => void
}

type Step = 'status' | 'setup' | 'verify' | 'disable' | 'success'

export function TwoFactorModal({ open, onClose }: Props) {
  const supabase = createClient()
  const [step, setStep] = useState<Step>('status')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [isEnabled, setIsEnabled] = useState(false)
  const [existingFactorId, setExistingFactorId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setStep('status')
      setError(null)
      setCode('')
      checkStatus()
    }
  }, [open])

  async function checkStatus() {
    setLoading(true)
    const { data } = await supabase.auth.mfa.listFactors()
    const totp = data?.totp?.find(f => f.status === 'verified')
    setIsEnabled(!!totp)
    setExistingFactorId(totp?.id ?? null)
    setLoading(false)
  }

  async function startSetup() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', issuer: 'XULIA', friendlyName: 'Autenticador' })
    if (error || !data) {
      setError('Error al iniciar la configuración. Inténtalo de nuevo.')
      setLoading(false)
      return
    }
    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setFactorId(data.id)
    setStep('setup')
    setLoading(false)
  }

  async function verifyCode() {
    if (!factorId || code.length !== 6) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code })
    if (error) {
      setError('Código incorrecto. Comprueba tu app y vuelve a intentarlo.')
      setLoading(false)
      return
    }
    setStep('success')
    setLoading(false)
  }

  async function disableMFA() {
    if (!existingFactorId) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.mfa.unenroll({ factorId: existingFactorId })
    if (error) {
      setError('Error al desactivar. Inténtalo de nuevo.')
      setLoading(false)
      return
    }
    setIsEnabled(false)
    setExistingFactorId(null)
    onClose()
    setLoading(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ animation: 'fadeUp 0.25s ease-out' }}>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-violet-600">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Doble factor (2FA)</h2>
              <p className="text-xs text-gray-400">Seguridad adicional para tu cuenta</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">

          {/* Estado inicial */}
          {step === 'status' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className={`flex items-center gap-3 p-4 rounded-xl mb-5 ${isEnabled ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                    <div>
                      <p className={`text-sm font-semibold ${isEnabled ? 'text-emerald-800' : 'text-amber-800'}`}>
                        {isEnabled ? '2FA activado' : '2FA no activado'}
                      </p>
                      <p className={`text-xs ${isEnabled ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isEnabled ? 'Tu cuenta está protegida con autenticación en dos pasos.' : 'Activa el 2FA para proteger mejor tu cuenta.'}
                      </p>
                    </div>
                  </div>

                  {isEnabled ? (
                    <button
                      onClick={() => setStep('disable')}
                      className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                    >
                      Desactivar 2FA
                    </button>
                  ) : (
                    <button
                      onClick={startSetup}
                      className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                    >
                      Activar doble factor
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* QR setup */}
          {step === 'setup' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Escanea este código QR con tu app de autenticación (<span className="font-medium text-gray-800">Google Authenticator</span>, <span className="font-medium text-gray-800">Authy</span>…)
              </p>
              {qrCode && (
                <div className="flex justify-center mb-4">
                  <img src={qrCode} alt="QR 2FA" className="w-44 h-44 rounded-xl border border-gray-200 p-2" />
                </div>
              )}
              {secret && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5 text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Código manual</p>
                  <code className="text-xs font-mono text-gray-700 break-all select-all">{secret}</code>
                </div>
              )}
              <button
                onClick={() => setStep('verify')}
                className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
              >
                Ya lo he escaneado →
              </button>
            </div>
          )}

          {/* Verificar código */}
          {step === 'verify' && (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Introduce el código de 6 dígitos que aparece en tu app de autenticación.
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center text-2xl font-mono tracking-[0.4em] border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 mb-4"
                autoFocus
              />
              {error && <p className="text-xs text-red-500 mb-3 text-center">{error}</p>}
              <button
                onClick={verifyCode}
                disabled={code.length !== 6 || loading}
                className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verificando…' : 'Verificar y activar'}
              </button>
            </div>
          )}

          {/* Confirmar desactivar */}
          {step === 'disable' && (
            <div>
              <p className="text-sm text-gray-600 mb-5">
                ¿Seguro que quieres desactivar el doble factor? Tu cuenta será menos segura.
              </p>
              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
              <div className="flex gap-2">
                <button onClick={() => setStep('status')} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={disableMFA}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Desactivando…' : 'Sí, desactivar'}
                </button>
              </div>
            </div>
          )}

          {/* Éxito */}
          {step === 'success' && (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-7 h-7 text-emerald-600">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">¡2FA activado!</h3>
              <p className="text-sm text-gray-500 mb-5">Tu cuenta ahora está protegida con autenticación en dos pasos.</p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
