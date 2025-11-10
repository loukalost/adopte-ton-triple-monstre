import { getWallet } from '@/actions/wallet.actions'
import { AppLayout } from '@/components/navigation'
import WalletClient from '@/components/wallet/wallet-client'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Page dédiée au Wallet (Portefeuille de Koins)
 *
 * Cette page affiche le portefeuille virtuel de l'utilisateur
 * contenant sa monnaie (Koins).
 *
 * Fonctionnalités :
 * - Vérification de l'authentification
 * - Récupération du wallet de l'utilisateur
 * - Affichage du solde et des boutons de gestion
 * - Animations lors des transactions
 *
 * @returns {Promise<JSX.Element>} La page du wallet
 */
export default async function WalletPage (): Promise<JSX.Element> {
  // Vérification de l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Redirection vers la page de connexion si non authentifié
  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  // Récupération du wallet de l'utilisateur
  let wallet
  try {
    wallet = await getWallet()
  } catch (error) {
    console.error('Error loading wallet:', error)
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center'>
          <div className='text-6xl mb-4'>😢</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            Erreur de chargement
          </h1>
          <p className='text-gray-600'>
            Impossible de charger votre wallet. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      <WalletClient initialWallet={wallet} />
    </AppLayout>
  )
}
