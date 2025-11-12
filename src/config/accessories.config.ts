/**
 * Configuration du catalogue d'accessoires
 * Respecte OCP: Facile d'ajouter de nouveaux accessoires sans modifier le code
 */

import type { Accessory, AccessoryCategory, Rarity, RarityConfig } from '@/types/accessories'

/**
 * Configuration des raretés
 * Ordre croissant: Common → Legendary
 * Couleurs adaptées à la charte graphique (electric/neon-purple/neutral)
 */
export const rarityConfig: Record<Rarity, RarityConfig> = {
  common: {
    name: 'Commun',
    color: 'var(--color-neutral-400)',
    emoji: '⚪',
    priceMultiplier: 1.0,
    dropRate: 50,
    order: 1
  },
  uncommon: {
    name: 'Peu Commun',
    color: 'var(--color-electric-400)',
    emoji: '🔵',
    priceMultiplier: 1.5,
    dropRate: 30,
    order: 2
  },
  rare: {
    name: 'Rare',
    color: 'var(--color-neon-purple-400)',
    emoji: '🟣',
    priceMultiplier: 2.5,
    dropRate: 15,
    order: 3
  },
  epic: {
    name: 'Épique',
    color: 'var(--color-neon-purple-600)',
    emoji: '🟣',
    priceMultiplier: 4.0,
    dropRate: 4,
    order: 4
  },
  legendary: {
    name: 'Légendaire',
    color: 'var(--color-electric-600)',
    emoji: '⭐',
    priceMultiplier: 10.0,
    dropRate: 1,
    order: 5
  }
}

/**
 * Catalogue complet des accessoires
 */
export const accessoriesCatalog: Accessory[] = [
  // ========== CHAPEAUX (Hats) ==========
  {
    id: 'hat-crown',
    name: 'Couronne Royale',
    category: 'hat',
    drawData: {
      type: 'crown',
      primaryColor: '#FFD700',
      secondaryColor: '#FF6B6B',
      offsetY: -45
    },
    rarity: 'legendary',
    basePrice: 20,
    description: 'Pour les créatures de sang royal'
  },
  {
    id: 'hat-cap',
    name: 'Casquette',
    category: 'hat',
    drawData: {
      type: 'cap',
      primaryColor: '#FF6B6B',
      secondaryColor: '#FFFFFF',
      offsetY: -40
    },
    rarity: 'common',
    basePrice: 8,
    description: 'Style décontracté garanti'
  },
  {
    id: 'hat-tophat',
    name: 'Haut-de-forme',
    category: 'hat',
    drawData: {
      type: 'tophat',
      primaryColor: '#2C2C2C',
      secondaryColor: '#8B4513',
      offsetY: -48
    },
    rarity: 'epic',
    basePrice: 15,
    description: 'Élégance et classe assurées'
  },
  {
    id: 'hat-beanie',
    name: 'Bonnet',
    category: 'hat',
    drawData: {
      type: 'beanie',
      primaryColor: '#4ECDC4',
      secondaryColor: '#FF6B6B',
      offsetY: -42
    },
    rarity: 'common',
    basePrice: 7,
    description: 'Parfait pour l\'hiver'
  },
  {
    id: 'hat-chef',
    name: 'Toque de Chef',
    category: 'hat',
    drawData: {
      type: 'chef',
      primaryColor: '#FFFFFF',
      offsetY: -45
    },
    rarity: 'uncommon',
    basePrice: 12,
    description: 'Pour les créatures gourmandes'
  },
  {
    id: 'hat-wizard',
    name: 'Chapeau de Magicien',
    category: 'hat',
    drawData: {
      type: 'wizard',
      primaryColor: '#8B4FBF',
      secondaryColor: '#FFD700',
      offsetY: -50
    },
    rarity: 'epic',
    basePrice: 18,
    description: 'Pour les créatures magiques'
  },
  {
    id: 'hat-headband',
    name: 'Bandeau',
    category: 'hat',
    drawData: {
      type: 'headband',
      primaryColor: '#FF6B6B',
      secondaryColor: '#FFD700',
      offsetY: -35
    },
    rarity: 'common',
    basePrice: 6,
    description: 'Style sportif'
  },
  {
    id: 'hat-bow',
    name: 'Nœud Élégant',
    category: 'hat',
    drawData: {
      type: 'bow',
      primaryColor: '#FF69B4',
      secondaryColor: '#FF1493',
      offsetY: -38
    },
    rarity: 'rare',
    basePrice: 14,
    description: 'Adorable et chic'
  },

  // ========== LUNETTES (Glasses) ==========
  {
    id: 'glasses-round',
    name: 'Lunettes Rondes',
    category: 'glasses',
    drawData: {
      type: 'round',
      primaryColor: '#2C2C2C'
    },
    rarity: 'common',
    basePrice: 8,
    description: 'Classiques et indémodables'
  },
  {
    id: 'glasses-square',
    name: 'Lunettes Carrées',
    category: 'glasses',
    drawData: {
      type: 'square',
      primaryColor: '#8B4513'
    },
    rarity: 'common',
    basePrice: 8,
    description: 'Style intellectuel'
  },
  {
    id: 'glasses-cool',
    name: 'Lunettes de Soleil',
    category: 'glasses',
    drawData: {
      type: 'cool',
      primaryColor: '#FF6B6B'
    },
    rarity: 'uncommon',
    basePrice: 10,
    description: 'Cool à toute heure'
  },
  {
    id: 'glasses-star',
    name: 'Lunettes Étoiles',
    category: 'glasses',
    drawData: {
      type: 'star',
      primaryColor: '#FFD700'
    },
    rarity: 'rare',
    basePrice: 12,
    description: 'Tu es une star !'
  },
  {
    id: 'glasses-heart',
    name: 'Lunettes Cœur',
    category: 'glasses',
    drawData: {
      type: 'heart',
      primaryColor: '#FF69B4'
    },
    rarity: 'uncommon',
    basePrice: 10,
    description: 'Love is in the air'
  },
  {
    id: 'glasses-retro',
    name: 'Lunettes Rétro',
    category: 'glasses',
    drawData: {
      type: 'retro',
      primaryColor: '#4ECDC4'
    },
    rarity: 'rare',
    basePrice: 12,
    description: 'Vintage et chic'
  },
  {
    id: 'glasses-aviator',
    name: 'Lunettes Aviateur',
    category: 'glasses',
    drawData: {
      type: 'aviator',
      primaryColor: '#C0C0C0'
    },
    rarity: 'epic',
    basePrice: 15,
    description: 'Style pilote'
  },
  {
    id: 'glasses-monocle',
    name: 'Monocle',
    category: 'glasses',
    drawData: {
      type: 'monocle',
      primaryColor: '#2C2C2C',
      secondaryColor: '#FFD700'
    },
    rarity: 'legendary',
    basePrice: 18,
    description: 'Distingué et raffiné'
  },

  // ========== CHAUSSURES (Shoes) ==========
  {
    id: 'shoes-sneakers',
    name: 'Baskets',
    category: 'shoes',
    drawData: {
      type: 'sneakers',
      primaryColor: '#FF6B6B',
      secondaryColor: '#FFFFFF'
    },
    rarity: 'common',
    basePrice: 8,
    description: 'Confortables et stylées'
  },
  {
    id: 'shoes-boots',
    name: 'Bottes',
    category: 'shoes',
    drawData: {
      type: 'boots',
      primaryColor: '#8B4513'
    },
    rarity: 'uncommon',
    basePrice: 10,
    description: 'Parfaites pour l\'aventure'
  },
  {
    id: 'shoes-sandals',
    name: 'Sandales',
    category: 'shoes',
    drawData: {
      type: 'sandals',
      primaryColor: '#FFD700',
      secondaryColor: '#F4A460'
    },
    rarity: 'common',
    basePrice: 7,
    description: 'Légères et confortables'
  },
  {
    id: 'shoes-heels',
    name: 'Talons Hauts',
    category: 'shoes',
    drawData: {
      type: 'heels',
      primaryColor: '#FF1493'
    },
    rarity: 'rare',
    basePrice: 12,
    description: 'Élégance assurée'
  },
  {
    id: 'shoes-rollers',
    name: 'Rollers',
    category: 'shoes',
    drawData: {
      type: 'rollers',
      primaryColor: '#4ECDC4',
      secondaryColor: '#2C2C2C'
    },
    rarity: 'epic',
    basePrice: 15,
    description: 'Vitesse maximale !'
  },
  {
    id: 'shoes-flippers',
    name: 'Palmes',
    category: 'shoes',
    drawData: {
      type: 'flippers',
      primaryColor: '#00BFFF'
    },
    rarity: 'uncommon',
    basePrice: 10,
    description: 'Nage comme un poisson'
  },
  {
    id: 'shoes-slippers',
    name: 'Pantoufles',
    category: 'shoes',
    drawData: {
      type: 'slippers',
      primaryColor: '#FFB5E8',
      secondaryColor: '#FF69B4'
    },
    rarity: 'common',
    basePrice: 6,
    description: 'Confort ultime'
  },
  {
    id: 'shoes-wing',
    name: 'Chaussures Ailées',
    category: 'shoes',
    drawData: {
      type: 'wing',
      primaryColor: '#FFD700',
      secondaryColor: '#FFFFFF'
    },
    rarity: 'legendary',
    basePrice: 20,
    description: 'Vole vers les étoiles'
  }
]

/**
 * Obtenir le prix final d'un accessoire (basePrice * rareté)
 */
export function getAccessoryPrice (accessory: Accessory): number {
  const rarityMultiplier = rarityConfig[accessory.rarity].priceMultiplier
  return Math.round(accessory.basePrice * rarityMultiplier)
}

/**
 * Filtrer les accessoires par catégorie
 */
export function getAccessoriesByCategory (category: AccessoryCategory): Accessory[] {
  return accessoriesCatalog.filter(acc => acc.category === category)
}

/**
 * Filtrer les accessoires par rareté
 */
export function getAccessoriesByRarity (rarity: Rarity): Accessory[] {
  return accessoriesCatalog.filter(acc => acc.rarity === rarity)
}

/**
 * Obtenir un accessoire par ID
 */
export function getAccessoryById (id: string): Accessory | undefined {
  return accessoriesCatalog.find(acc => acc.id === id)
}
