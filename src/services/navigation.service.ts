/**
 * Navigation Service - Domain Layer
 *
 * Responsabilité unique : Gérer la logique métier de navigation basée sur l'état d'authentification
 *
 * Principe SOLID appliqués :
 * - Single Responsibility: Détermine où rediriger l'utilisateur selon son état d'authentification
 * - Open/Closed: Extensible pour ajouter d'autres types de redirections
 * - Dependency Inversion: Ne dépend pas de Next.js, retourne des chemins abstraits
 *
 * @module services/navigation
 */

/**
 * État de session utilisateur (abstraction)
 */
export interface UserSession {
  isAuthenticated: boolean
  userId?: string
}

/**
 * Options de redirection
 */
export interface RedirectOptions {
  /** URL de callback après authentification */
  callbackUrl?: string
  /** Préserver les query params */
  preserveQuery?: boolean
}

/**
 * Résultat de la décision de navigation
 */
export interface NavigationDecision {
  /** Chemin de destination */
  path: string
  /** Si redirection nécessaire */
  shouldRedirect: boolean
  /** Raison de la redirection (pour logging/debug) */
  reason?: string
}

/**
 * Détermine où rediriger depuis la page d'accueil
 *
 * @param session - État de session utilisateur
 * @returns Décision de navigation
 *
 * @example
 * const decision = decideHomeRedirect({ isAuthenticated: true })
 * // { path: '/app', shouldRedirect: true, reason: 'authenticated-user' }
 */
export function decideHomeRedirect (session: UserSession): NavigationDecision {
  if (session.isAuthenticated) {
    return {
      path: '/app',
      shouldRedirect: true,
      reason: 'authenticated-user'
    }
  }

  return {
    path: '/',
    shouldRedirect: false,
    reason: 'public-landing'
  }
}

/**
 * Détermine où rediriger après une authentification réussie
 *
 * @param options - Options de redirection
 * @returns Décision de navigation
 *
 * @example
 * const decision = decidePostAuthRedirect({ callbackUrl: '/app/creatures' })
 * // { path: '/app/creatures', shouldRedirect: true, reason: 'post-auth-callback' }
 */
export function decidePostAuthRedirect (options: RedirectOptions = {}): NavigationDecision {
  const { callbackUrl = '/app' } = options

  return {
    path: callbackUrl,
    shouldRedirect: true,
    reason: 'post-auth-callback'
  }
}

/**
 * Détermine où rediriger pour une route protégée non authentifiée
 *
 * @param currentPath - Chemin actuel de l'utilisateur
 * @param preserveCallback - Si true, ajoute le chemin actuel comme callback
 * @returns Décision de navigation
 *
 * @example
 * const decision = decideProtectedRouteRedirect('/app/creatures', true)
 * // { path: '/sign-in?callback=/app/creatures', shouldRedirect: true, reason: 'protected-route' }
 */
export function decideProtectedRouteRedirect (
  currentPath: string,
  preserveCallback: boolean = false
): NavigationDecision {
  const basePath = '/sign-in'
  const path = preserveCallback
    ? `${basePath}?callback=${encodeURIComponent(currentPath)}`
    : basePath

  return {
    path,
    shouldRedirect: true,
    reason: 'protected-route'
  }
}

/**
 * Détermine où rediriger en cas de session expirée
 *
 * @param currentPath - Chemin actuel de l'utilisateur
 * @returns Décision de navigation
 *
 * @example
 * const decision = decideSessionExpiredRedirect('/app')
 * // { path: '/sign-in?expired=true&callback=/app', shouldRedirect: true, reason: 'session-expired' }
 */
export function decideSessionExpiredRedirect (currentPath: string): NavigationDecision {
  return {
    path: `/sign-in?expired=true&callback=${encodeURIComponent(currentPath)}`,
    shouldRedirect: true,
    reason: 'session-expired'
  }
}

/**
 * Vérifie si un chemin est une route protégée
 *
 * @param path - Chemin à vérifier
 * @returns true si le chemin nécessite une authentification
 *
 * @example
 * isProtectedRoute('/app') // true
 * isProtectedRoute('/sign-in') // false
 */
export function isProtectedRoute (path: string): boolean {
  const protectedPrefixes = ['/app']
  return protectedPrefixes.some(prefix => path.startsWith(prefix))
}

/**
 * Vérifie si un chemin est une page d'authentification
 *
 * @param path - Chemin à vérifier
 * @returns true si c'est une page auth
 *
 * @example
 * isAuthPage('/sign-in') // true
 * isAuthPage('/app') // false
 */
export function isAuthPage (path: string): boolean {
  const authPaths = ['/sign-in', '/sign-up']
  return authPaths.includes(path)
}
