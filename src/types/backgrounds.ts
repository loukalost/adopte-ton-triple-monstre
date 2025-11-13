/**
 * Types pour le système d'arrière-plans
 * Respecte SRP: Types uniquement, pas de logique
 */

/**
 * Catégories d'arrière-plans disponibles
 */
export type BackgroundCategory = 'gradient' | 'pattern' | 'animated'

/**
 * Types d'arrière-plans par catégorie
 */
export type GradientType = 'sunset' | 'ocean' | 'forest' | 'night' | 'rainbow' | 'fire'
export type PatternType = 'dots' | 'stripes' | 'stars' | 'hearts' | 'waves' | 'bubbles'
export type AnimatedType = 'floating-particles' | 'aurora' | 'matrix' | 'starfield' | 'fireflies'

export type BackgroundType = GradientType | PatternType | AnimatedType

/**
 * Niveaux de rareté (réutilise le système existant des accessoires)
 */
export type BackgroundRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

/**
 * Configuration d'un gradient
 */
export interface GradientConfig {
  type: 'gradient'
  colors: string[]
  direction?: 'to-bottom' | 'to-top' | 'to-right' | 'to-left' | 'to-bottom-right' | 'to-bottom-left'
}

/**
 * Configuration d'un pattern
 */
export interface PatternConfig {
  type: 'pattern'
  backgroundColor: string
  patternColor: string
  patternType: PatternType
  size: number
  spacing: number
}

/**
 * Configuration d'un arrière-plan animé
 */
export interface AnimatedConfig {
  type: 'animated'
  animationType: AnimatedType
  colors: string[]
  speed: number
  density: number
}

/**
 * Configuration visuelle d'un arrière-plan (union discriminée)
 */
export type BackgroundData = GradientConfig | PatternConfig | AnimatedConfig

/**
 * Définition d'un arrière-plan dans le catalogue
 */
export interface Background {
  /** Identifiant unique */
  id: string
  /** Nom affiché */
  name: string
  /** Catégorie */
  category: BackgroundCategory
  /** Configuration visuelle */
  data: BackgroundData
  /** Rareté */
  rarity: BackgroundRarity
  /** Prix de base en Koins */
  basePrice: number
  /** Description */
  description: string
  /** Preview image URL (optionnel) */
  previewImage?: string
}

/**
 * Arrière-plan possédé par un utilisateur
 */
export interface OwnedBackground {
  /** ID MongoDB */
  _id: string
  /** ID de l'utilisateur propriétaire */
  userId: string
  /** ID de l'arrière-plan dans le catalogue */
  backgroundId: string
  /** Date d'achat */
  purchasedAt: Date
}

/**
 * Configuration de rareté pour les arrière-plans
 */
export interface BackgroundRarityConfig {
  name: string
  color: string
  emoji: string
  priceMultiplier: number
  dropRate: number
  order: number
}
