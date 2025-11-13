/**
 * Configuration du catalogue d'arrière-plans
 * Respecte OCP: Facile d'ajouter de nouveaux arrière-plans sans modifier le code
 */

import type { Background, BackgroundRarity, BackgroundRarityConfig } from '@/types/backgrounds'

/**
 * Configuration des raretés (alignée avec celle des accessoires)
 */
export const backgroundRarityConfig: Record<BackgroundRarity, BackgroundRarityConfig> = {
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
 * Catalogue complet des arrière-plans
 */
export const backgroundsCatalog: Background[] = [
  // ========== GRADIENTS ==========
  {
    id: 'gradient-sunset',
    name: 'Coucher de Soleil',
    category: 'gradient',
    data: {
      type: 'gradient',
      colors: ['#FF6B6B', '#FFD93D', '#FFA500'],
      direction: 'to-bottom'
    },
    rarity: 'common',
    basePrice: 15,
    description: 'Un magnifique coucher de soleil chaleureux'
  },
  {
    id: 'gradient-ocean',
    name: 'Océan Profond',
    category: 'gradient',
    data: {
      type: 'gradient',
      colors: ['#1e3a8a', '#3b82f6', '#06b6d4'],
      direction: 'to-bottom'
    },
    rarity: 'common',
    basePrice: 15,
    description: 'Les profondeurs apaisantes de l\'océan'
  },
  {
    id: 'gradient-forest',
    name: 'Forêt Enchantée',
    category: 'gradient',
    data: {
      type: 'gradient',
      colors: ['#065f46', '#10b981', '#6ee7b7'],
      direction: 'to-bottom'
    },
    rarity: 'uncommon',
    basePrice: 20,
    description: 'La fraîcheur d\'une forêt mystérieuse'
  },
  {
    id: 'gradient-night',
    name: 'Nuit Étoilée',
    category: 'gradient',
    data: {
      type: 'gradient',
      colors: ['#1a1a2e', '#16213e', '#0f3460'],
      direction: 'to-bottom'
    },
    rarity: 'uncommon',
    basePrice: 20,
    description: 'La beauté d\'une nuit sans lune'
  },
  {
    id: 'gradient-rainbow',
    name: 'Arc-en-Ciel',
    category: 'gradient',
    data: {
      type: 'gradient',
      colors: ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF', '#8B5CF6'],
      direction: 'to-right'
    },
    rarity: 'rare',
    basePrice: 25,
    description: 'Toutes les couleurs de l\'arc-en-ciel'
  },
  {
    id: 'gradient-fire',
    name: 'Flammes Ardentes',
    category: 'gradient',
    data: {
      type: 'gradient',
      colors: ['#450a0a', '#dc2626', '#f59e0b', '#fef3c7'],
      direction: 'to-top'
    },
    rarity: 'epic',
    basePrice: 30,
    description: 'L\'intensité des flammes'
  },

  // ========== PATTERNS ==========
  {
    id: 'pattern-dots',
    name: 'Points Colorés',
    category: 'pattern',
    data: {
      type: 'pattern',
      backgroundColor: '#F0F4F8',
      patternColor: '#4ECDC4',
      patternType: 'dots',
      size: 8,
      spacing: 20
    },
    rarity: 'common',
    basePrice: 12,
    description: 'Des petits points mignons partout'
  },
  {
    id: 'pattern-stripes',
    name: 'Rayures Dynamiques',
    category: 'pattern',
    data: {
      type: 'pattern',
      backgroundColor: '#FFE5E5',
      patternColor: '#FF6B6B',
      patternType: 'stripes',
      size: 15,
      spacing: 30
    },
    rarity: 'common',
    basePrice: 12,
    description: 'Des rayures pleines d\'énergie'
  },
  {
    id: 'pattern-stars',
    name: 'Étoiles Scintillantes',
    category: 'pattern',
    data: {
      type: 'pattern',
      backgroundColor: '#1a1a2e',
      patternColor: '#FFD700',
      patternType: 'stars',
      size: 12,
      spacing: 35
    },
    rarity: 'uncommon',
    basePrice: 18,
    description: 'Un ciel rempli d\'étoiles'
  },
  {
    id: 'pattern-hearts',
    name: 'Cœurs d\'Amour',
    category: 'pattern',
    data: {
      type: 'pattern',
      backgroundColor: '#FFF0F5',
      patternColor: '#FF69B4',
      patternType: 'hearts',
      size: 10,
      spacing: 25
    },
    rarity: 'rare',
    basePrice: 22,
    description: 'Plein d\'amour dans l\'air'
  },
  {
    id: 'pattern-waves',
    name: 'Vagues Ondulées',
    category: 'pattern',
    data: {
      type: 'pattern',
      backgroundColor: '#E0F2FE',
      patternColor: '#06b6d4',
      patternType: 'waves',
      size: 20,
      spacing: 40
    },
    rarity: 'rare',
    basePrice: 22,
    description: 'Des vagues douces et apaisantes'
  },
  {
    id: 'pattern-bubbles',
    name: 'Bulles Magiques',
    category: 'pattern',
    data: {
      type: 'pattern',
      backgroundColor: '#F0F9FF',
      patternColor: '#8B5CF6',
      patternType: 'bubbles',
      size: 15,
      spacing: 30
    },
    rarity: 'epic',
    basePrice: 28,
    description: 'Des bulles flottantes magiques'
  },

  // ========== ANIMATED ==========
  {
    id: 'animated-particles',
    name: 'Particules Flottantes',
    category: 'animated',
    data: {
      type: 'animated',
      animationType: 'floating-particles',
      colors: ['#8B5CF6', '#EC4899', '#F59E0B'],
      speed: 1,
      density: 30
    },
    rarity: 'rare',
    basePrice: 35,
    description: 'Des particules colorées qui flottent doucement'
  },
  {
    id: 'animated-aurora',
    name: 'Aurore Boréale',
    category: 'animated',
    data: {
      type: 'animated',
      animationType: 'aurora',
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
      speed: 0.5,
      density: 20
    },
    rarity: 'epic',
    basePrice: 40,
    description: 'Les lumières mystiques du nord'
  },
  {
    id: 'animated-matrix',
    name: 'Code Matrix',
    category: 'animated',
    data: {
      type: 'animated',
      animationType: 'matrix',
      colors: ['#00FF00', '#008F00'],
      speed: 2,
      density: 40
    },
    rarity: 'epic',
    basePrice: 40,
    description: 'Bienvenue dans la matrice'
  },
  {
    id: 'animated-starfield',
    name: 'Champ d\'Étoiles',
    category: 'animated',
    data: {
      type: 'animated',
      animationType: 'starfield',
      colors: ['#FFFFFF', '#FFD700', '#87CEEB'],
      speed: 1.5,
      density: 50
    },
    rarity: 'legendary',
    basePrice: 50,
    description: 'Voyage à travers les étoiles'
  },
  {
    id: 'animated-fireflies',
    name: 'Lucioles Nocturnes',
    category: 'animated',
    data: {
      type: 'animated',
      animationType: 'fireflies',
      colors: ['#FFD700', '#FFA500', '#FFFF00'],
      speed: 0.8,
      density: 25
    },
    rarity: 'legendary',
    basePrice: 50,
    description: 'La magie des lucioles dans la nuit'
  }
]

/**
 * Obtenir le prix final d'un arrière-plan (basePrice * rareté)
 */
export function getBackgroundPrice (background: Background): number {
  const rarityMultiplier = backgroundRarityConfig[background.rarity].priceMultiplier
  return Math.round(background.basePrice * rarityMultiplier)
}

/**
 * Obtenir un arrière-plan par son ID
 */
export function getBackgroundById (id: string): Background | null {
  return backgroundsCatalog.find(bg => bg.id === id) ?? null
}

/**
 * Obtenir tous les arrière-plans d'une catégorie
 */
export function getBackgroundsByCategory (category: string): Background[] {
  if (category === 'all') return backgroundsCatalog
  return backgroundsCatalog.filter(bg => bg.category === category)
}
