/**
 * Better Auth Client
 *
 * Client d'authentification pour l'application côté client
 * Supporte l'authentification par email/password et OAuth (GitHub)
 *
 * @module lib/auth-client
 */

import { createAuthClient } from 'better-auth/client'

/**
 * Instance du client Better Auth
 * Configuré automatiquement pour communiquer avec l'API d'authentification
 */
export const authClient = createAuthClient()
