'use client'

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
  const [alert, setAlert] = useState<{ type: 'info' | 'warning' | 'error', message: string } | null>(null)

  useEffect(() => {
    // Vérifier si session expirée
    if (searchParams.get('expired') === 'true') {
      setAlert({
        type: 'warning',
        message: '🔐 Votre session a expiré. Veuillez vous reconnecter pour continuer.'
      })
      return
    }

    // Vérifier si redirection depuis route protégée
    const callback = searchParams.get('callback')
    if (callback != null) {
      setAlert({
        type: 'info',
        message: '🔒 Cette page nécessite une connexion. Connectez-vous pour continuer.'
      })
    }
  }, [searchParams])

  // Auto-dismiss après 10 secondes
  useEffect(() => {
    if (alert !== null) {
      const timer = setTimeout(() => {
        setAlert(null)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [alert])

  if (alert === null) {
    return null
  }

  const bgColors = {
    info: 'bg-blue-50 border-blue-400',
    warning: 'bg-yellow-50 border-yellow-400',
    error: 'bg-red-50 border-red-400'
  }

  const textColors = {
    info: 'text-blue-700',
    warning: 'text-yellow-700',
    error: 'text-red-700'
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
