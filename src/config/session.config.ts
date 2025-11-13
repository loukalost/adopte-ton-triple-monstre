/**
 * Session Configuration
 *
 * Configuration centralisée des alertes de session et des messages
 * affichés lors des redirections d'authentification.
 *
 * Principe SRP : Responsabilité unique de configuration des sessions
 * Principe OCP : Facile d'ajouter de nouveaux types d'alertes
 *
 * @module config/session
 */

/**
 * Type d'alerte de session
 */
export type SessionAlertType = 'info' | 'warning' | 'error' | 'success'

/**
 * Configuration d'une alerte de session
 */
export interface SessionAlertConfig {
  /** Type d'alerte */
  type: SessionAlertType
  /** Message à afficher */
  message: string
  /** Emoji associé */
  emoji: string
  /** Durée d'affichage en ms (0 = pas d'auto-dismiss) */
  duration?: number
}

/**
 * Messages d'alerte de session prédéfinis
 */
export const SESSION_ALERTS = {
  /** Session expirée */
  expired: {
    type: 'warning' as SessionAlertType,
    message: 'Votre session a expiré. Veuillez vous reconnecter pour continuer.',
    emoji: '🔐'
  },
  /** Route protégée nécessitant authentification */
  protectedRoute: {
    type: 'info' as SessionAlertType,
    message: 'Cette page nécessite une connexion. Connectez-vous pour continuer.',
    emoji: '🔒'
  },
  /** Déconnexion réussie */
  loggedOut: {
    type: 'success' as SessionAlertType,
    message: 'Vous avez été déconnecté avec succès.',
    emoji: '👋'
  },
  /** Erreur d'authentification */
  authError: {
    type: 'error' as SessionAlertType,
    message: 'Une erreur est survenue lors de l\'authentification.',
    emoji: '❌'
  },
  /** Session invalide */
  invalidSession: {
    type: 'warning' as SessionAlertType,
    message: 'Votre session est invalide. Veuillez vous reconnecter.',
    emoji: '⚠️'
  }
} as const

/**
 * Durées des alertes (en millisecondes)
 */
export const SESSION_ALERT_DURATIONS = {
  /** Auto-dismiss pour les alertes de session */
  autoDismiss: 10_000,
  /** Durée pour les messages de succès */
  success: 5000,
  /** Durée pour les messages d'erreur */
  error: 8000,
  /** Durée pour les messages d'information */
  info: 10_000
} as const

/**
 * Helper pour obtenir une alerte de session par clé
 */
export function getSessionAlert (key: keyof typeof SESSION_ALERTS): SessionAlertConfig {
  return SESSION_ALERTS[key]
}

/**
 * Helper pour créer une alerte personnalisée
 */
export function createSessionAlert (
  type: SessionAlertType,
  message: string,
  emoji: string = '💬'
): SessionAlertConfig {
  return { type, message, emoji }
}
