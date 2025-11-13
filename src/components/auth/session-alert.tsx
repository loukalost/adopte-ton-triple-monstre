'use client'

import { SESSION_ALERTS, SESSION_ALERT_DURATIONS, type SessionAlertType } from '@/config/session.config'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Session Alert Component
 *
 * Affiche un message d'alerte si l'utilisateur a été redirigé pour raison de session
 * (session expirée, non authentifié, etc.)
 *
 * Principes SOLID :
 * - Single Responsibility: Affiche uniquement les alertes de session
 * - Open/Closed: Extensible pour d'autres types d'alertes via query params
 *
 * @returns {React.ReactNode} Message d'alerte ou null
 *
 * @example
 * // Dans la page sign-in
 * <SessionAlert />
 */
export function SessionAlert (): React.ReactNode {
  const searchParams = useSearchParams()
  const [alert, setAlert] = useState<{ type: SessionAlertType, message: string, emoji: string } | null>(null)

  useEffect(() => {
    // Vérifier si session expirée
    if (searchParams.get('expired') === 'true') {
      const config = SESSION_ALERTS.expired
      setAlert({
        type: config.type,
        message: `${config.emoji} ${config.message}`,
        emoji: config.emoji
      })
      return
    }

    // Vérifier si redirection depuis route protégée
    const callback = searchParams.get('callback')
    if (callback != null) {
      const config = SESSION_ALERTS.protectedRoute
      setAlert({
        type: config.type,
        message: `${config.emoji} ${config.message}`,
        emoji: config.emoji
      })
    }
  }, [searchParams])

  // Auto-dismiss avec durée configurée
  useEffect(() => {
    if (alert !== null) {
      const timer = setTimeout(() => {
        setAlert(null)
      }, SESSION_ALERT_DURATIONS.autoDismiss)

      return () => clearTimeout(timer)
    }
  }, [alert])

  if (alert === null) {
    return null
  }

  const bgColors: Record<SessionAlertType, string> = {
    info: 'bg-blue-50 border-blue-400',
    warning: 'bg-yellow-50 border-yellow-400',
    error: 'bg-red-50 border-red-400',
    success: 'bg-green-50 border-green-400'
  }

  const textColors: Record<SessionAlertType, string> = {
    info: 'text-blue-700',
    warning: 'text-yellow-700',
    error: 'text-red-700',
    success: 'text-green-700'
  }

  return (
    <div
      className={`${bgColors[alert.type]} border-l-4 p-4 rounded-r-xl mb-4 animate-in fade-in slide-in-from-top-2 duration-300`}
      role='alert'
    >
      <div className='flex items-center justify-between'>
        <p className={`${textColors[alert.type]} text-sm font-medium flex-1`}>
          {alert.message}
        </p>
        <button
          onClick={() => setAlert(null)}
          className={`${textColors[alert.type]} hover:opacity-70 transition-opacity ml-4`}
          aria-label='Fermer'
        >
          ✕
        </button>
      </div>
    </div>
  )
}
