/**
 * Types pour le système d'accessoires
 * Respecte les principes SOLID - SRP: Types séparés pour chaque concept
 */

/**
 * Catégorie d'accessoire
 */
export type AccessoryCategory = 'hat' | 'glasses' | 'shoes'

/**
 * Type d'accessoire pour le rendu
 */
export type HatType = 'crown' | 'cap' | 'tophat' | 'beanie' | 'chef' | 'wizard' | 'headband' | 'bow'
export type GlassesType = 'round' | 'square' | 'cool' | 'star' | 'heart' | 'retro' | 'aviator' | 'monocle'
export type ShoesType = 'sneakers' | 'boots' | 'sandals' | 'heels' | 'rollers' | 'flippers' | 'slippers' | 'wing'

/**
 * Données de dessin pixel pour un accessoire
 */
export interface AccessoryDrawData {
  /** Type spécifique de l'accessoire */
  type: HatType | GlassesType | ShoesType
  /** Couleur principale */
  primaryColor: string
  /** Couleur secondaire/accent */
  secondaryColor?: string
  /** Offset X par rapport à la position de base */
  offsetX?: number
  /** Offset Y par rapport à la position de base */
  offsetY?: number
  /** Échelle (défaut: 1) */
  scale?: number
}

/**
 * Niveau de rareté d'un accessoire
 */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

/**
 * Configuration d'une rareté
 */
export interface RarityConfig {
  /** Nom de la rareté */
  name: string
  /** Couleur du gradient (CSS custom properties) */
  color: string
  /** Emoji représentatif */
  emoji: string
  /** Multiplicateur de prix (1 = prix de base) */
  priceMultiplier: number
  /** Probabilité d'obtention (en %) */
  dropRate: number
  /** Ordre d'affichage */
  order: number
}

/**
 * Accessoire disponible dans le catalogue
 */
export interface Accessory {
  /** Identifiant unique */
  id: string
  /** Nom de l'accessoire */
  name: string
  /** Catégorie (hat, glasses, shoes) */
  category: AccessoryCategory
  /** Données de dessin pixel */
  drawData: AccessoryDrawData
  /** Rareté */
  rarity: Rarity
  /** Prix de base en Koins (sera multiplié par rareté) */
  basePrice: number
  /** Description */
  description: string
}

/**
 * Accessoire possédé par un utilisateur
 * Version sérialisée pour Client Components
 */
export interface OwnedAccessory {
  /** ID de l'enregistrement */
  _id: string
  /** ID de l'accessoire dans le catalogue */
  accessoryId: string
  /** ID du propriétaire */
  ownerId: string
  /** ID de la créature équipée (null si non équipé) */
  equippedOnMonsterId: string | null
  /** Date d'acquisition (ISO string pour serialization) */
  acquiredAt: string
}

/**
 * Accessoire possédé - Version base de données (avec types MongoDB)
 * À utiliser uniquement côté serveur
 */
export interface OwnedAccessoryDb {
  /** ID de l'enregistrement */
  _id: any // ObjectId
  /** ID de l'accessoire dans le catalogue */
  accessoryId: string
  /** ID du propriétaire */
  ownerId: string
  /** ID de la créature équipée (null si non équipé) */
  equippedOnMonsterId: string | null
  /** Date d'acquisition */
  acquiredAt: Date
}

/**
 * État d'équipement d'une créature
 */
export interface MonsterEquipment {
  /** ID de la créature */
  monsterId: string
  /** Chapeau équipé */
  hat: OwnedAccessory | null
  /** Lunettes équipées */
  glasses: OwnedAccessory | null
  /** Chaussures équipées */
  shoes: OwnedAccessory | null
}
