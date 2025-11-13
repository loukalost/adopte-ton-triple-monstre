/**
 * OAuth Button Component
 *
 * Bouton générique pour l'authentification OAuth (GitHub, Google, etc.)
 *
 * Principes SOLID :
 * - Single Responsibility : Affiche uniquement un bouton OAuth
 * - Open/Closed : Extensible pour d'autres providers via la config
 * - Dependency Inversion : Dépend de OAuthProviderConfig (abstraction)
 *
 * @module components/auth
 */

'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { TRANSITION_CLASSES } from '@/config/ui.constants'
import type { OAuthProviderConfig } from '@/config/oauth.config'

/**
 * Props pour le composant OAuthButton
 */
interface OAuthButtonProps {
  /** Configuration du provider OAuth */
  provider: OAuthProviderConfig
  /** Callback en cas d'erreur */
  onError?: (error: string) => void
  /** URL de callback après authentification */
  callbackURL?: string
}

/**
 * Bouton d'authentification OAuth
 *
 * @param {OAuthButtonProps} props - Props du composant
 * @returns {React.ReactNode} Bouton OAuth stylisé
 *
 * @example
 * <OAuthButton
 *   provider={GITHUB_OAUTH_CONFIG}
 *   onError={(error) => console.error(error)}
 *   callbackURL="/app"
 * />
 */
export function OAuthButton ({
  provider,
  onError,
  callbackURL = '/app'
}: OAuthButtonProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Gère le clic sur le bouton OAuth
   *
   * Responsabilité unique : orchestrer la connexion OAuth
   * - Déclenche la connexion via Better Auth
   * - Gère les états de chargement
   * - Propage les erreurs via callback
   */
  const handleOAuthSignIn = async (): Promise<void> => {
    setIsLoading(true)

    try {
      await authClient.signIn.social({
        provider: provider.name,
        callbackURL
      })
      // La redirection est automatiquement gérée par Better Auth
    } catch (error) {
      setIsLoading(false)
      const errorMessage = error instanceof Error
        ? error.message
        : `Erreur lors de la connexion avec ${provider.label}`

      onError?.(errorMessage)
    }
  }

  const baseClass = `w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-semibold shadow-md ${TRANSITION_CLASSES.default}`
  const colorClass = `${provider.bgColor} ${provider.bgColorHover} ${provider.textColor}`
  const stateClass = isLoading
    ? 'opacity-75 cursor-not-allowed'
    : 'hover:shadow-lg active:scale-95 cursor-pointer'

  return (
    <button
      type='button'
      onClick={() => { void handleOAuthSignIn() }}
      disabled={isLoading}
      className={`${baseClass} ${colorClass} ${stateClass}`}
      aria-label={`${provider.label}`}
    >
      <span className='text-2xl'>{provider.icon}</span>
      <span className='text-sm'>
        {isLoading ? '🔄 Connexion...' : provider.label}
      </span>
    </button>
  )
}
