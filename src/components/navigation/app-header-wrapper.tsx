import { getWallet } from '@/actions/wallet.actions'
import AppHeader from './app-header'

/**
 * Wrapper serveur pour le header de l'application
 *
 * Ce wrapper récupère le solde du wallet de l'utilisateur
 * et le passe au composant client AppHeader.
 *
 * @returns {Promise<React.ReactNode>} Header avec solde du wallet
 */
export default async function AppHeaderWrapper (): Promise<React.ReactNode> {
  // Récupération du wallet de l'utilisateur
  let walletBalance = 0

  try {
    const wallet = await getWallet()
    walletBalance = wallet.balance
  } catch (error) {
    console.error('Erreur lors de la récupération du wallet:', error)
    // En cas d'erreur, on affiche 0
    walletBalance = 0
  }

  return <AppHeader walletBalance={walletBalance} />
}
