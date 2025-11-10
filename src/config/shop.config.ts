import type { XPBoost } from '@/types/shop'

/**
 * Configuration des boosts d'XP disponibles dans la boutique
 * Principe SRP: Responsabilité unique de configuration des boosts
 * Principe OCP: Facile à étendre avec de nouveaux boosts
 */
export const xpBoosts: XPBoost[] = [
  {
    id: 'xp-boost-small',
    name: 'Petit Boost',
    xpAmount: 50,
    price: 5,
    emoji: '⚡',
    color: 'from-yellow-400 to-orange-500',
    badge: 'Starter',
    popular: false,
    description: 'Un petit coup de pouce pour progresser'
  },
  {
    id: 'xp-boost-medium',
    name: 'Boost Moyen',
    xpAmount: 150,
    price: 12,
    emoji: '✨',
    color: 'from-blue-400 to-cyan-500',
    badge: 'Populaire',
    popular: true,
    description: 'Le meilleur rapport qualité/prix'
  },
  {
    id: 'xp-boost-large',
    name: 'Gros Boost',
    xpAmount: 300,
    price: 20,
    emoji: '💫',
    color: 'from-purple-400 to-pink-500',
    badge: 'Pro',
    popular: false,
    description: 'Pour les plus pressés'
  },
  {
    id: 'xp-boost-mega',
    name: 'Méga Boost',
    xpAmount: 500,
    price: 30,
    emoji: '🌟',
    color: 'from-pink-400 to-rose-500',
    badge: 'Légendaire',
    popular: false,
    description: 'Le boost ultime'
  }
]
