/**
 * Utilitaires pour la gestion de la rareté
 * Respecte SRP: Fonctions pures pour manipuler les raretés
 */

import { rarityConfig } from '@/config/accessories.config'
import type { Rarity } from '@/types/accessories'

/**
 * Obtenir la configuration d'une rareté
 */
export function getRarityConfig (rarity: Rarity): typeof rarityConfig[Rarity] {
  return rarityConfig[rarity]
}

/**
 * Obtenir la couleur d'une rareté
 */
export function getRarityColor (rarity: Rarity): string {
  return rarityConfig[rarity].color
}

/**
 * Obtenir l'emoji d'une rareté
 */
export function getRarityEmoji (rarity: Rarity): string {
  return rarityConfig[rarity].emoji
}

/**
 * Obtenir le nom d'une rareté
 */
export function getRarityName (rarity: Rarity): string {
  return rarityConfig[rarity].name
}

/**
 * Trier les raretés par ordre (Common → Legendary)
 */
export function sortByRarity<T extends { rarity: Rarity }> (items: T[]): T[] {
  return items.sort((a, b) => {
    return rarityConfig[a.rarity].order - rarityConfig[b.rarity].order
  })
}

/**
 * Obtenir un item aléatoire selon les drop rates
 * Utilisé pour les "loot boxes" ou événements spéciaux
 */
export function getRandomItemByRarity<T extends { rarity: Rarity }> (
  items: T[]
): T {
  // Calculer le total des drop rates
  const totalWeight = items.reduce(
    (sum, item) => sum + rarityConfig[item.rarity].dropRate,
    0
  )

  // Générer un nombre aléatoire
  let random = Math.random() * totalWeight

  // Sélectionner l'item
  for (const item of items) {
    random -= rarityConfig[item.rarity].dropRate
    if (random <= 0) {
      return item
    }
  }

  // Fallback (ne devrait jamais arriver)
  return items[0]
}
