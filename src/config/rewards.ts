/**
 * Rewards Configuration
 *
 * Configuration centralisée des montants de récompenses en Koins
 * pour chaque action effectuée sur les monstres.
 *
 * Respecte OCP (Open/Closed Principle) : Pour ajouter une nouvelle action,
 * il suffit d'ajouter une entrée ici sans modifier le reste du code.
 *
 * @module config/rewards
 */

import type { MonsterAction } from '@/types/monster-action'

/**
 * Configuration d'une récompense
 */
export interface RewardConfig {
  /** Montant de Koins gagnés */
  koins: number
  /** Message de succès à afficher */
  message: string
  /** Emoji associé à la récompense */
  emoji: string
}

/**
 * Configuration des récompenses par type d'action
 *
 * Pour modifier les montants, il suffit de changer les valeurs ici.
 * Pour ajouter une nouvelle action :
 * 1. Ajouter le type dans MonsterAction
 * 2. Ajouter l'entrée correspondante ci-dessous
 */
export const REWARDS_CONFIG: Record<NonNullable<MonsterAction>, RewardConfig> = {
  feed: {
    koins: 10,
    message: 'Ton monstre est rassasié !',
    emoji: '🍎'
  },
  comfort: {
    koins: 15,
    message: 'Ton monstre se sent mieux !',
    emoji: '💙'
  },
  hug: {
    koins: 12,
    message: 'Ton monstre est tout content !',
    emoji: '🤗'
  },
  wake: {
    koins: 8,
    message: 'Ton monstre est bien réveillé !',
    emoji: '⏰'
  }
}

/**
 * Montants de récompenses par action (pour accès rapide)
 */
export const REWARD_AMOUNTS = {
  feed: REWARDS_CONFIG.feed.koins,
  comfort: REWARDS_CONFIG.comfort.koins,
  hug: REWARDS_CONFIG.hug.koins,
  wake: REWARDS_CONFIG.wake.koins
} as const

/**
 * Messages de récompenses par action (pour accès rapide)
 */
export const REWARD_MESSAGES = {
  feed: REWARDS_CONFIG.feed.message,
  comfort: REWARDS_CONFIG.comfort.message,
  hug: REWARDS_CONFIG.hug.message,
  wake: REWARDS_CONFIG.wake.message
} as const

/**
 * Emojis de récompenses par action (pour accès rapide)
 */
export const REWARD_EMOJIS = {
  feed: REWARDS_CONFIG.feed.emoji,
  comfort: REWARDS_CONFIG.comfort.emoji,
  hug: REWARDS_CONFIG.hug.emoji,
  wake: REWARDS_CONFIG.wake.emoji
} as const
