import { getMonsters } from '@/actions/monsters.actions'
import { getDailyQuests } from '@/actions/quests.actions'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Page principale de l'application (Dashboard utilisateur)
 *
 * Cette page server-side récupère la session, les monstres et les quêtes journalières.
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

  // TypeScript safety: session est vérifié dans le layout parent
  if (session === null || session === undefined) {
    throw new Error('Session should exist at this point')
  }

  // Récupération parallèle des monstres et des quêtes pour optimiser les performances
  const [monsters, dailyQuests] = await Promise.all([
    getMonsters(),
    getDailyQuests()
  ])

  return (
    <DashboardContent session={session} monsters={monsters} dailyQuests={dailyQuests} />
  )
}

export default AppPage
