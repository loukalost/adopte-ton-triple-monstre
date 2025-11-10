import { pricingTable } from './pricing'
import type { KoinPackage } from '@/components/wallet/koin-package-card'

/**
 * Configuration des packages de Koins disponibles
 * Principe SRP: Responsabilité unique de configuration des packages
 * Principe OCP: Facile à étendre avec de nouveaux packages
 */
export const walletPackages: KoinPackage[] = [
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
