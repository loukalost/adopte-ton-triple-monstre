import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { MonstersAutoUpdater } from '@/components/monsters/auto-updater'
import AppHeaderWrapper from '@/components/navigation/app-header-wrapper'
import BottomNavWrapper from '@/components/navigation/bottom-nav-wrapper'

/**
 * Layout spécifique pour la partie applicative (/app)
 *
 * Ce layout englobe toutes les pages de l'application (dashboard, creatures, wallet)
 * et fournit des fonctionnalités communes comme le système de mise à jour automatique.
 *
 * Responsabilités :
 * - Protection des routes : redirection si non authentifié
 * - Récupération de la session utilisateur
 * - Affichage de la navigation (header desktop + bottom nav mobile)
 * - Activation du système de mise à jour automatique des monstres
 * - Wrapper pour toutes les pages /app/*
 *
 * @param {Object} props - Props du layout
 * @param {React.ReactNode} props.children - Contenu des pages enfants
 * @returns {Promise<React.ReactNode>} Layout protégé avec navigation et cron
 */
export default async function AppLayout ({
  children
}: {
  children: React.ReactNode
}): Promise<React.ReactNode> {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Protection de la route : redirection si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  const userId = session.user?.id ?? null

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Navigation Desktop */}
      <AppHeaderWrapper />

      {/* Système de mise à jour automatique des monstres */}
      {/* Actif sur toutes les pages /app/* pour l'utilisateur connecté */}
      <MonstersAutoUpdater
        userId={userId}
        minInterval={60000} // 1 minute minimum
        maxInterval={180000} // 3 minutes maximum
        enabled={userId !== null} // Activé seulement si utilisateur connecté
        verbose // Logs dans la console
        showIndicator={false} // Pas d'indicateur visuel (mettre true pour debug)
      />

      {/* Contenu des pages enfants */}
      <main className='flex-1'>
        {children}
      </main>

      {/* Navigation Mobile (Bottom) */}
      <BottomNavWrapper />
    </div>
  )
}
