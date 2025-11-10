import { getMonsters } from '@/actions/monsters.actions'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Page principale de l'application (Dashboard utilisateur)
 *
 * Cette page server-side récupère la session et les monstres de l'utilisateur.
 * La protection de la route est gérée par le layout parent (src/app/app/layout.tsx).
 *
 * @async
 * @returns {Promise<React.ReactNode>} Le contenu du dashboard
 *
 * @example
 * // Accès direct à la route
 * // GET /app
 */
async function AppPage (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur via Better Auth
  // La session est garantie d'exister car le layout parent vérifie l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Récupération de tous les monstres appartenant à l'utilisateur connecté
  const monsters = await getMonsters()

  // TypeScript safety: session est vérifié dans le layout parent
  if (session === null || session === undefined) {
    throw new Error('Session should exist at this point')
  }

  return (
    <DashboardContent session={session} monsters={monsters} />
  )
}

export default AppPage
