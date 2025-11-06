export const XP_PER_ACTION = 20

/**
 * Retourne le seuil d'XP nécessaire pour atteindre le prochain niveau
 * Par défaut : level * 100
 */
export function thresholdForLevel (level: number): number {
  return Math.max(1, level) * 100
}
