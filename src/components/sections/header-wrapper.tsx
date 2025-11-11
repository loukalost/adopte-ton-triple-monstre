
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Header from '../header'

/**
 * Wrapper server-side pour le Header public
 *
 * Ce wrapper récupère la session utilisateur et la passe au Header
 * pour adapter le bouton CTA en fonction de l'état de connexion.
 *
 * @returns {Promise<React.ReactNode>} Header avec état de connexion
 */
export default async function HeaderWrapper (): Promise<React.ReactNode> {
  // Récupération de la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const isLoggedIn = session !== null && session !== undefined

  return <Header isLoggedIn={isLoggedIn} />
}
