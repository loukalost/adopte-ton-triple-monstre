/**
 * OAuth Section Component
 *
 * Section affichant tous les boutons OAuth disponibles avec séparateur visuel
 *
 * Principes SOLID :
 * - Single Responsibility : Affiche uniquement les options OAuth
 * - Open/Closed : Extensible via la config (ajouter providers)
 *
 * @module components/auth
 */

'use client'

import { OAuthButton } from './oauth-button'
import { OAUTH_PROVIDERS } from '@/config/oauth.config'

/**
 * Props pour le composant OAuthSection
 */
interface OAuthSectionProps {
  /** Callback en cas d'erreur */
  onError?: (error: string) => void
  /** URL de callback après authentification */
  callbackURL?: string
}

/**
 * Section OAuth avec tous les providers disponibles
 *
 * @param {OAuthSectionProps} props - Props du composant
 * @returns {React.ReactNode} Section OAuth avec boutons et séparateur
 *
 * @example
 * <OAuthSection onError={(error) => console.error(error)} />
 */
export function OAuthSection ({
  onError,
  callbackURL = '/app'
}: OAuthSectionProps): React.ReactNode {
  // Filtrer uniquement les providers activés
  const enabledProviders = Object.values(OAUTH_PROVIDERS).filter(
    provider => provider.enabled
  )

  // Ne rien afficher si aucun provider n'est activé
  if (enabledProviders.length === 0) {
    return null
  }

  return (
    <div className='space-y-4'>
      {/* Boutons OAuth */}
      <div className='space-y-3'>
        {enabledProviders.map(provider => (
          <OAuthButton
            key={provider.name}
            provider={provider}
            onError={onError}
            callbackURL={callbackURL}
          />
        ))}
      </div>

      {/* Séparateur visuel */}
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300' />
        </div>
        <div className='relative flex justify-center text-xs'>
          <span className='px-2 bg-white text-gray-500'>
            ou continuer avec email
          </span>
        </div>
      </div>
    </div>
  )
}
