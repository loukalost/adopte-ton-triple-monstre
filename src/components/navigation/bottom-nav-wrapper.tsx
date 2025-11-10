import { getWallet } from '@/actions/wallet.actions'
import BottomNav from './bottom-nav'

/**
 * Wrapper serveur pour la navigation mobile
 *
 * Ce wrapper récupère le solde du wallet de l'utilisateur
 * et le passe au composant client BottomNav.
 *
 * @returns {Promise<React.ReactNode>} Navigation mobile avec solde du wallet
 */
export default async function BottomNavWrapper (): Promise<React.ReactNode> {
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

  return <BottomNav walletBalance={walletBalance} />
}
