/**
 * GitHub OAuth Configuration
 *
 * Configuration centralisée pour l'authentification GitHub via Better Auth
 *
 * Principe SRP : Responsabilité unique de configuration OAuth
 * Principe OCP : Extensible pour d'autres providers (Google, Discord, etc.)
 *
 * @module config/oauth
 */

/**
 * Configuration d'un provider OAuth
 */
export interface OAuthProviderConfig {
  /** Nom du provider */
  name: string
  /** Label affiché sur le bouton */
  label: string
  /** Icône/Emoji du provider */
  icon: string
  /** Couleur de fond du bouton (Tailwind CSS) */
  bgColor: string
  /** Couleur de fond au hover (Tailwind CSS) */
  bgColorHover: string
  /** Couleur du texte */
  textColor: string
  /** Provider activé ou non */
  enabled: boolean
}

/**
 * Configuration GitHub OAuth
 */
export const GITHUB_OAUTH_CONFIG: OAuthProviderConfig = {
  name: 'github',
  label: 'Continuer avec GitHub',
  icon: '🐙',
  bgColor: 'bg-gray-800',
  bgColorHover: 'hover:bg-gray-900',
  textColor: 'text-white',
  enabled: true
}

/**
 * Configuration de tous les providers OAuth disponibles
 * Pour ajouter un nouveau provider, il suffit de l'ajouter ici
 */
export const OAUTH_PROVIDERS: Record<string, OAuthProviderConfig> = {
  github: GITHUB_OAUTH_CONFIG
  // Prêt pour extension :
  // google: { ... },
  // discord: { ... }
}

/**
 * Messages d'erreur OAuth
 */
export const OAUTH_ERROR_MESSAGES = {
  cancelled: 'Connexion annulée',
  failed: 'Erreur lors de la connexion avec {provider}',
  networkError: 'Erreur réseau, veuillez réessayer',
  unknown: 'Une erreur inattendue s\'est produite'
} as const

/**
 * Helper pour obtenir la config d'un provider
 */
export function getOAuthProviderConfig (provider: string): OAuthProviderConfig | null {
  return OAUTH_PROVIDERS[provider] ?? null
}

/**
 * Helper pour vérifier si un provider est activé
 */
export function isOAuthProviderEnabled (provider: string): boolean {
  const config = getOAuthProviderConfig(provider)
  return config?.enabled ?? false
}
