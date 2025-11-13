/**
 * Error Handler Service - Application Layer
 *
 * Responsabilité unique : Gérer et formater les erreurs d'authentification et de navigation
 *
 * Principes SOLID appliqués :
 * - Single Responsibility: Centralise la gestion des erreurs de navigation
 * - Open/Closed: Extensible pour ajouter de nouveaux types d'erreurs
 * - Dependency Inversion: Retourne des objets d'erreur abstraits
 *
 * @module services/navigation-error
 */

/**
 * Types d'erreurs de navigation
 */
export enum NavigationErrorType {
  /** Session expirée */
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  /** Non authentifié */
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  /** Accès refusé */
  FORBIDDEN = 'FORBIDDEN',
  /** Route non trouvée */
  NOT_FOUND = 'NOT_FOUND',
  /** Erreur réseau */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Erreur serveur */
  SERVER_ERROR = 'SERVER_ERROR'
}

/**
 * Détails d'une erreur de navigation
 */
export interface NavigationError {
  /** Type d'erreur */
  type: NavigationErrorType
  /** Message utilisateur (français) */
  message: string
  /** Message technique (pour logs) */
  technicalMessage?: string
  /** Action recommandée */
  action: 'redirect' | 'retry' | 'contact-support'
  /** Chemin de redirection si action = 'redirect' */
  redirectPath?: string
}

/**
 * Crée une erreur pour une session expirée
 *
 * @param currentPath - Chemin actuel de l'utilisateur
 * @returns Détails de l'erreur
 *
 * @example
 * const error = createSessionExpiredError('/app/creatures')
 * // { type: SESSION_EXPIRED, message: '...', redirectPath: '/sign-in?expired=true&...' }
 */
export function createSessionExpiredError (currentPath: string): NavigationError {
  return {
    type: NavigationErrorType.SESSION_EXPIRED,
    message: 'Votre session a expiré. Veuillez vous reconnecter.',
    technicalMessage: `Session expired while accessing: ${currentPath}`,
    action: 'redirect',
    redirectPath: `/sign-in?expired=true&callback=${encodeURIComponent(currentPath)}`
  }
}

/**
 * Crée une erreur pour un utilisateur non authentifié
 *
 * @param currentPath - Chemin actuel de l'utilisateur
 * @returns Détails de l'erreur
 *
 * @example
 * const error = createUnauthenticatedError('/app')
 * // { type: UNAUTHENTICATED, message: '...', redirectPath: '/sign-in' }
 */
export function createUnauthenticatedError (currentPath: string): NavigationError {
  return {
    type: NavigationErrorType.UNAUTHENTICATED,
    message: 'Vous devez être connecté pour accéder à cette page.',
    technicalMessage: `Unauthenticated access attempt: ${currentPath}`,
    action: 'redirect',
    redirectPath: `/sign-in?callback=${encodeURIComponent(currentPath)}`
  }
}

/**
 * Crée une erreur pour un accès refusé
 *
 * @param reason - Raison du refus
 * @returns Détails de l'erreur
 *
 * @example
 * const error = createForbiddenError('Insufficient permissions')
 */
export function createForbiddenError (reason?: string): NavigationError {
  return {
    type: NavigationErrorType.FORBIDDEN,
    message: 'Vous n\'avez pas les permissions pour accéder à cette ressource.',
    technicalMessage: reason ?? 'Access forbidden',
    action: 'redirect',
    redirectPath: '/app'
  }
}

/**
 * Crée une erreur réseau
 *
 * @param originalError - Erreur d'origine
 * @returns Détails de l'erreur
 *
 * @example
 * const error = createNetworkError(new Error('Failed to fetch'))
 */
export function createNetworkError (originalError?: Error): NavigationError {
  return {
    type: NavigationErrorType.NETWORK_ERROR,
    message: 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.',
    technicalMessage: originalError?.message ?? 'Network error',
    action: 'retry'
  }
}

/**
 * Crée une erreur serveur
 *
 * @param statusCode - Code HTTP de l'erreur
 * @param originalError - Erreur d'origine
 * @returns Détails de l'erreur
 *
 * @example
 * const error = createServerError(500, new Error('Internal server error'))
 */
export function createServerError (statusCode?: number, originalError?: Error): NavigationError {
  return {
    type: NavigationErrorType.SERVER_ERROR,
    message: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
    technicalMessage: `Server error (${statusCode ?? 'unknown'}): ${originalError?.message ?? 'Unknown error'}`,
    action: 'contact-support'
  }
}

/**
 * Formate une erreur pour l'affichage utilisateur
 *
 * @param error - Erreur à formater
 * @returns Message formaté pour l'utilisateur
 *
 * @example
 * const userMessage = formatErrorForUser(error)
 * // "🔐 Votre session a expiré. Veuillez vous reconnecter."
 */
export function formatErrorForUser (error: NavigationError): string {
  const icons = {
    [NavigationErrorType.SESSION_EXPIRED]: '🔐',
    [NavigationErrorType.UNAUTHENTICATED]: '🔒',
    [NavigationErrorType.FORBIDDEN]: '⛔',
    [NavigationErrorType.NOT_FOUND]: '🔍',
    [NavigationErrorType.NETWORK_ERROR]: '📡',
    [NavigationErrorType.SERVER_ERROR]: '⚠️'
  }

  return `${icons[error.type]} ${error.message}`
}

/**
 * Logue une erreur de navigation (pour monitoring)
 *
 * @param error - Erreur à loguer
 * @param context - Contexte supplémentaire
 *
 * @example
 * logNavigationError(error, { userId: '123', userAgent: 'Chrome' })
 */
export function logNavigationError (
  error: NavigationError,
  context?: Record<string, any>
): void {
  const logData = {
    type: error.type,
    message: error.technicalMessage ?? error.message,
    action: error.action,
    redirectPath: error.redirectPath,
    timestamp: new Date().toISOString(),
    ...context
  }

  // En production, envoyer à un service de monitoring (Sentry, LogRocket, etc.)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Envoyer à un service de monitoring
    console.error('[NAVIGATION_ERROR]', JSON.stringify(logData))
  } else {
    console.error('❌ [Navigation Error]', logData)
  }
}
