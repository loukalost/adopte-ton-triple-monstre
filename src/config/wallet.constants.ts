import { pricingTable } from './pricing'
import type { WalletPackage, InfoCardData } from '@/types/wallet'

/**
 * Packages d'achat de Koins disponibles
 */
export const WALLET_PACKAGES: WalletPackage[] = [
  {
    amount: 10,
    price: pricingTable[10].price,
    emoji: '🪙',
    color: 'from-yellow-400 to-orange-500',
    badge: 'Débutant',
    popular: false
  },
  {
    amount: 50,
    price: pricingTable[50].price,
    emoji: '💰',
    color: 'from-orange-400 to-red-500',
    badge: 'Populaire',
    popular: true
  },
  {
    amount: 500,
    price: pricingTable[500].price,
    emoji: '💎',
    color: 'from-blue-400 to-cyan-500',
    badge: 'Pro',
    popular: false
  },
  {
    amount: 1000,
    price: pricingTable[1000].price,
    emoji: '👑',
    color: 'from-purple-400 to-pink-500',
    badge: 'Royal',
    popular: false
  }
]

/**
 * Informations supplémentaires affichées en bas de page
 */
export const WALLET_INFO_CARDS: InfoCardData[] = [
  {
    icon: '🔒',
    title: 'Paiement Sécurisé',
    text: 'Crypté SSL via Stripe'
  },
  {
    icon: '⚡',
    title: 'Instantané',
    text: 'Koins ajoutés immédiatement'
  },
  {
    icon: '💳',
    title: 'Tous moyens',
    text: 'CB, PayPal, Apple Pay...'
  }
]
