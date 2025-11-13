/**
 * Rewards Service - Domain Layer
 *
 * Responsabilité unique : Gérer la logique métier des récompenses en Koins
 *
 * Principes SOLID appliqués :
 * - Single Responsibility: Calcule et valide les récompenses uniquement
 * - Open/Closed: Extensible pour de nouveaux types d'actions
 * - Dependency Inversion: Ne dépend pas de l'infrastructure (DB, UI)
 *
 * @module services/rewards
 */

import type { MonsterAction } from '@/types/monster-action'

/**
 * Configuration des récompenses par action
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
 * Résultat d'une récompense
 */
export interface RewardResult {
  /** Action effectuée */
  action: MonsterAction
  /** Koins gagnés */
  koinsEarned: number
  /** Message de succès */
  message: string
  /** Emoji de récompense */
  emoji: string
  /** Timestamp de la récompense */
  timestamp: Date
}

/**
 * Configuration des récompenses par type d'action
 *
 * Respecte OCP (Open/Closed Principle) : Pour ajouter une nouvelle action,
 * il suffit d'ajouter une entrée ici sans modifier le reste du code.
 */
const REWARDS_CONFIG: Record<NonNullable<MonsterAction>, RewardConfig> = {
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
 * Récupère la configuration de récompense pour une action
 *
 * @param action - Action effectuée
 * @returns Configuration de récompense ou null si action invalide
 *
 * @example
 * const config = getRewardConfig('feed')
 * // { koins: 10, message: '...', emoji: '🍎' }
 */
export function getRewardConfig (action: MonsterAction): RewardConfig | null {
  if (action === null || action === undefined) {
    return null
  }

  return REWARDS_CONFIG[action] ?? null
}

/**
 * Calcule la récompense pour une action donnée
 *
 * Fonction pure qui détermine combien de Koins doivent être attribués
 * pour une action spécifique, sans dépendre de l'état externe.
 *
 * @param action - Action effectuée
 * @returns Résultat de la récompense ou null si action invalide
 *
 * @example
 * const reward = calculateReward('feed')
 * // { action: 'feed', koinsEarned: 10, message: '...', ... }
 */
export function calculateReward (action: MonsterAction): RewardResult | null {
  const config = getRewardConfig(action)

  if (config === null || action === null) {
    return null
  }

  return {
    action,
    koinsEarned: config.koins,
    message: config.message,
    emoji: config.emoji,
    timestamp: new Date()
  }
}

/**
 * Valide qu'une action peut recevoir une récompense
 *
 * @param action - Action à valider
 * @returns true si l'action est éligible à une récompense
 *
 * @example
 * isRewardableAction('feed') // true
 * isRewardableAction(null) // false
 */
export function isRewardableAction (action: MonsterAction): boolean {
  if (action === null || action === undefined) {
    return false
  }

  return action in REWARDS_CONFIG
}

/**
 * Récupère la liste de toutes les actions récompensables
 *
 * @returns Liste des actions avec leurs récompenses
 *
 * @example
 * const actions = getAllRewardableActions()
 * // [{ action: 'feed', ...config }, { action: 'comfort', ...config }, ...]
 */
export function getAllRewardableActions (): Array<{ action: NonNullable<MonsterAction>, config: RewardConfig }> {
  return Object.entries(REWARDS_CONFIG).map(([action, config]) => ({
    action: action as NonNullable<MonsterAction>,
    config
  }))
}

/**
 * Formate un message de récompense pour l'utilisateur
 *
 * @param reward - Résultat de la récompense
 * @returns Message formaté
 *
 * @example
 * const message = formatRewardMessage(reward)
 * // "🍎 +10 Koins ! Ton monstre est rassasié !"
 */
export function formatRewardMessage (reward: RewardResult): string {
  return `${reward.emoji} +${reward.koinsEarned} Koins ! ${reward.message}`
}

/**
 * Calcule le total de Koins pour plusieurs actions
 *
 * Utile pour les statistiques ou les bonus multiples.
 *
 * @param actions - Liste d'actions effectuées
 * @returns Total de Koins
 *
 * @example
 * const total = calculateTotalReward(['feed', 'hug', 'comfort'])
 * // 37 (10 + 12 + 15)
 */
export function calculateTotalReward (actions: MonsterAction[]): number {
  return actions.reduce((total, action) => {
    const reward = calculateReward(action)
    return total + (reward?.koinsEarned ?? 0)
  }, 0)
}

/**
 * Crée un bonus multiplicateur pour les actions en série
 *
 * Peut être utilisé pour implémenter un système de combo.
 *
 * @param actionCount - Nombre d'actions consécutives
 * @param baseMultiplier - Multiplicateur de base (défaut: 1.0)
 * @param bonusPerAction - Bonus par action (défaut: 0.1 = 10%)
 * @returns Multiplicateur final
 *
 * @example
 * const multiplier = calculateComboMultiplier(5)
 * // 1.5 (1.0 + 5 * 0.1)
 */
export function calculateComboMultiplier (
  actionCount: number,
  baseMultiplier: number = 1.0,
  bonusPerAction: number = 0.1
): number {
  if (actionCount <= 0) {
    return baseMultiplier
  }

  return baseMultiplier + (actionCount * bonusPerAction)
}
