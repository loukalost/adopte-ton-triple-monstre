# Système d'Accessoires et d'Arrière-plans 🎨👒

## Vue d'ensemble

Système complet permettant aux joueurs de personnaliser leurs créatures avec des **accessoires équipables** (chapeaux, lunettes, chaussures) et des **arrière-plans personnalisés**. Ce système intègre un **système de rareté** pour créer une économie engageante et encourage la collection.

---

## 📋 Table des matières

1. [Objectifs et Vision](#objectifs-et-vision)
2. [Architecture Générale](#architecture-générale)
3. [Système d'Accessoires](#système-daccessoires)
4. [Système d'Arrière-plans](#système-darrière-plans)
5. [Système de Rareté](#système-de-rareté)
6. [Intégration Boutique](#intégration-boutique)
7. [Base de Données](#base-de-données)
8. [API Routes](#api-routes)
9. [Composants UI](#composants-ui)
10. [UX et Affichage](#ux-et-affichage)
11. [Gestion d'État](#gestion-détat)
12. [Tests et Validation](#tests-et-validation)
13. [Migration et Déploiement](#migration-et-déploiement)

---

## 🎯 Objectifs et Vision

### Objectifs Principaux

- ✅ Permettre l'achat d'accessoires dans 3 catégories distinctes
- ✅ Rattacher chaque accessoire à une créature spécifique
- ✅ Permettre l'équipement et le retrait d'accessoires
- ✅ Afficher les accessoires dans la liste ET le détail des créatures
- ✅ Implémenter un système de rareté engageant
- ✅ Permettre l'achat, l'équipement et le retrait d'arrière-plans
- ✅ Créer une économie viable avec les Koins existants

### Principes de Design

- **Kawaii First** : Design mignon et coloré cohérent avec l'app
- **Mobile First** : Responsive et tactile avant tout
- **Collection** : Encourager la collection et l'échange
- **Personnalisation** : Rendre chaque créature unique
- **Gamification** : Raretés et badges pour engagement

---

## 🏗️ Architecture Générale

### Structure des Fichiers

```
src/
├── types/
│   ├── accessories.ts          # Types d'accessoires
│   └── backgrounds.ts          # Types d'arrière-plans
├── config/
│   ├── accessories.config.ts   # Catalogue d'accessoires
│   └── backgrounds.config.ts   # Catalogue d'arrière-plans
├── actions/
│   ├── accessories.actions.ts  # Server actions pour accessoires
│   └── backgrounds.actions.ts  # Server actions pour arrière-plans
├── components/
│   ├── accessories/
│   │   ├── accessory-slot.tsx        # Slot d'accessoire (hat, glasses, shoes)
│   │   ├── accessory-selector.tsx    # Modal de sélection
│   │   ├── accessory-card.tsx        # Carte d'accessoire
│   │   └── rarity-badge.tsx          # Badge de rareté
│   ├── backgrounds/
│   │   ├── background-selector.tsx   # Modal de sélection d'arrière-plan
│   │   ├── background-card.tsx       # Carte d'arrière-plan
│   │   └── background-preview.tsx    # Aperçu d'arrière-plan
│   └── shop/
│       ├── accessories-shop.tsx      # Boutique d'accessoires
│       └── backgrounds-shop.tsx      # Boutique d'arrière-plans
├── hooks/
│   ├── accessories/
│   │   ├── use-accessories.ts        # Hook pour gérer les accessoires
│   │   └── use-equip-accessory.ts    # Hook pour équiper/retirer
│   └── backgrounds/
│       ├── use-backgrounds.ts        # Hook pour gérer les arrière-plans
│       └── use-equip-background.ts   # Hook pour équiper/retirer
└── lib/
    └── utils/
        └── rarity.utils.ts           # Utilitaires de rareté
```

### Principes SOLID Appliqués

#### Single Responsibility Principle (SRP)
- Chaque fichier a une responsabilité unique
- Séparation accessoires / arrière-plans
- Components atomiques et réutilisables

#### Open/Closed Principle (OCP)
- Facile d'ajouter de nouveaux accessoires sans modifier le code
- Config externe pour le catalogue
- System de rareté extensible

#### Dependency Inversion Principle (DIP)
- Hooks pour abstraire la logique métier
- Server actions pour l'accès aux données
- Types partagés pour le contrat d'interface

---

## 👕 Système d'Accessoires

### Catégories d'Accessoires

#### 🎩 Chapeaux (Hats)
Accessoires portés sur la tête de la créature

**Exemples** :
- Chapeau de cowboy 🤠
- Couronne royale 👑
- Casquette de baseball 🧢
- Béret français 🎨
- Chapeau de magicien 🎩
- Bandana pirate 🏴‍☠️
- Halo angélique 😇
- Oreilles de lapin 🐰

#### 👓 Lunettes (Glasses)
Accessoires portés sur les yeux

**Exemples** :
- Lunettes de soleil 😎
- Lunettes rondes 🤓
- Monocle 🧐
- Lunettes en cœur 😍
- Lunettes de ski ⛷️
- Lunettes 3D 🎬
- Lunettes de plongée 🤿
- Lunettes steampunk ⚙️

#### 👟 Chaussures (Shoes)
Accessoires portés aux pieds de la créature

**Exemples** :
- Baskets Nike 👟
- Bottes de cowboy 🥾
- Chaussons de danse 🩰
- Patins à roulettes 🛼
- Palmes 🤿
- Chaussures de clown 🤡
- Bottes spatiales 🚀
- Sabots en bois 🪵

### Type Definition (`src/types/accessories.ts`)

```typescript
/**
 * Catégorie d'accessoire
 */
export type AccessoryCategory = 'hat' | 'glasses' | 'shoes'

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
  /** Couleur du gradient (Tailwind classes) */
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
  /** Emoji représentatif */
  emoji: string
  /** Rareté */
  rarity: Rarity
  /** Prix de base en Koins (sera multiplié par rareté) */
  basePrice: number
  /** Description */
  description: string
  /** Styles CSS pour le positionnement */
  style?: {
    top?: string
    left?: string
    transform?: string
    scale?: string
  }
}

/**
 * Accessoire possédé par un utilisateur
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
```

### Configuration du Catalogue (`src/config/accessories.config.ts`)

```typescript
import type { Accessory, RarityConfig } from '@/types/accessories'

/**
 * Configuration des raretés
 * Ordre croissant: Common → Legendary
 */
export const rarityConfig: Record<Rarity, RarityConfig> = {
  common: {
    name: 'Commun',
    color: 'from-gray-400 to-gray-600',
    emoji: '⚪',
    priceMultiplier: 1.0,
    dropRate: 50,
    order: 1
  },
  uncommon: {
    name: 'Peu Commun',
    color: 'from-green-400 to-green-600',
    emoji: '🟢',
    priceMultiplier: 1.5,
    dropRate: 30,
    order: 2
  },
  rare: {
    name: 'Rare',
    color: 'from-blue-400 to-blue-600',
    emoji: '🔵',
    priceMultiplier: 2.5,
    dropRate: 15,
    order: 3
  },
  epic: {
    name: 'Épique',
    color: 'from-purple-400 to-purple-600',
    emoji: '🟣',
    priceMultiplier: 4.0,
    dropRate: 4,
    order: 4
  },
  legendary: {
    name: 'Légendaire',
    color: 'from-yellow-400 to-orange-600',
    emoji: '🟡',
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
    id: 'hat-cowboy',
    name: 'Chapeau de Cowboy',
    category: 'hat',
    emoji: '🤠',
    rarity: 'common',
    basePrice: 10,
    description: 'Yeehaw ! Pour les créatures aventurières',
    style: { top: '-15%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'hat-crown',
    name: 'Couronne Royale',
    category: 'hat',
    emoji: '👑',
    rarity: 'legendary',
    basePrice: 20,
    description: 'Pour les créatures de sang royal',
    style: { top: '-20%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'hat-cap',
    name: 'Casquette',
    category: 'hat',
    emoji: '🧢',
    rarity: 'common',
    basePrice: 8,
    description: 'Style décontracté garanti',
    style: { top: '-12%', left: '50%', transform: 'translateX(-50%) rotate(-10deg)' }
  },
  {
    id: 'hat-wizard',
    name: 'Chapeau de Magicien',
    category: 'hat',
    emoji: '🎩',
    rarity: 'epic',
    basePrice: 15,
    description: 'Pour les créatures magiques',
    style: { top: '-18%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'hat-halo',
    name: 'Auréole',
    category: 'hat',
    emoji: '😇',
    rarity: 'rare',
    basePrice: 12,
    description: 'Pour les créatures angéliques',
    style: { top: '-25%', left: '50%', transform: 'translateX(-50%)' }
  },

  // ========== LUNETTES (Glasses) ==========
  {
    id: 'glasses-sunglasses',
    name: 'Lunettes de Soleil',
    category: 'glasses',
    emoji: '😎',
    rarity: 'common',
    basePrice: 10,
    description: 'Cool à toute heure',
    style: { top: '30%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'glasses-nerd',
    name: 'Lunettes de Geek',
    category: 'glasses',
    emoji: '🤓',
    rarity: 'uncommon',
    basePrice: 10,
    description: '+10 en intelligence',
    style: { top: '30%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'glasses-monocle',
    name: 'Monocle',
    category: 'glasses',
    emoji: '🧐',
    rarity: 'rare',
    basePrice: 12,
    description: 'Distingué et raffiné',
    style: { top: '30%', left: '45%', transform: 'translateX(-50%)' }
  },
  {
    id: 'glasses-heart',
    name: 'Lunettes Cœur',
    category: 'glasses',
    emoji: '😍',
    rarity: 'uncommon',
    basePrice: 10,
    description: 'Love is in the air',
    style: { top: '30%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'glasses-3d',
    name: 'Lunettes 3D',
    category: 'glasses',
    emoji: '🎬',
    rarity: 'rare',
    basePrice: 12,
    description: 'Pour voir le monde différemment',
    style: { top: '30%', left: '50%', transform: 'translateX(-50%)' }
  },

  // ========== CHAUSSURES (Shoes) ==========
  {
    id: 'shoes-sneakers',
    name: 'Baskets',
    category: 'shoes',
    emoji: '👟',
    rarity: 'common',
    basePrice: 10,
    description: 'Confortables et stylées',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-boots',
    name: 'Bottes de Cowboy',
    category: 'shoes',
    emoji: '🥾',
    rarity: 'uncommon',
    basePrice: 10,
    description: 'Parfaites pour l\'aventure',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-ballet',
    name: 'Chaussons de Danse',
    category: 'shoes',
    emoji: '🩰',
    rarity: 'rare',
    basePrice: 12,
    description: 'Pour danser avec grâce',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-roller',
    name: 'Patins à Roulettes',
    category: 'shoes',
    emoji: '🛼',
    rarity: 'epic',
    basePrice: 15,
    description: 'Vitesse maximale !',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  },
  {
    id: 'shoes-rocket',
    name: 'Bottes Spatiales',
    category: 'shoes',
    emoji: '🚀',
    rarity: 'legendary',
    basePrice: 20,
    description: 'Vers l\'infini et au-delà',
    style: { bottom: '5%', left: '50%', transform: 'translateX(-50%)' }
  }
]

/**
 * Obtenir le prix final d'un accessoire (basePrice * rareté)
 */
export function getAccessoryPrice(accessory: Accessory): number {
  const rarityMultiplier = rarityConfig[accessory.rarity].priceMultiplier
  return Math.round(accessory.basePrice * rarityMultiplier)
}

/**
 * Filtrer les accessoires par catégorie
 */
export function getAccessoriesByCategory(category: AccessoryCategory): Accessory[] {
  return accessoriesCatalog.filter(acc => acc.category === category)
}

/**
 * Filtrer les accessoires par rareté
 */
export function getAccessoriesByRarity(rarity: Rarity): Accessory[] {
  return accessoriesCatalog.filter(acc => acc.rarity === rarity)
}

/**
 * Obtenir un accessoire par ID
 */
export function getAccessoryById(id: string): Accessory | undefined {
  return accessoriesCatalog.find(acc => acc.id === id)
}
```

---

## 🖼️ Système d'Arrière-plans

### Type Definition (`src/types/backgrounds.ts`)

```typescript
/**
 * Type d'arrière-plan
 */
export type BackgroundType = 'gradient' | 'pattern' | 'theme' | 'animated'

/**
 * Arrière-plan disponible dans le catalogue
 */
export interface Background {
  /** Identifiant unique */
  id: string
  /** Nom de l'arrière-plan */
  name: string
  /** Type d'arrière-plan */
  type: BackgroundType
  /** Emoji représentatif */
  emoji: string
  /** Rareté */
  rarity: Rarity
  /** Prix de base en Koins */
  basePrice: number
  /** Description */
  description: string
  /** Classes CSS pour l'arrière-plan */
  className: string
  /** Image de prévisualisation (optionnel) */
  preview?: string
}

/**
 * Arrière-plan possédé par un utilisateur
 */
export interface OwnedBackground {
  /** ID de l'enregistrement */
  _id: string
  /** ID de l'arrière-plan dans le catalogue */
  backgroundId: string
  /** ID du propriétaire */
  ownerId: string
  /** Date d'acquisition */
  acquiredAt: Date
}

/**
 * Extension du type Monster pour inclure l'arrière-plan
 */
export interface MonsterWithBackground extends DBMonster {
  /** ID de l'arrière-plan équipé */
  backgroundId: string | null
}
```

### Configuration du Catalogue (`src/config/backgrounds.config.ts`)

```typescript
import type { Background } from '@/types/backgrounds'

/**
 * Catalogue complet des arrière-plans
 */
export const backgroundsCatalog: Background[] = [
  // ========== GRADIENTS ==========
  {
    id: 'bg-sunset',
    name: 'Coucher de Soleil',
    type: 'gradient',
    emoji: '🌅',
    rarity: 'common',
    basePrice: 15,
    description: 'Dégradé chaud et apaisant',
    className: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600'
  },
  {
    id: 'bg-ocean',
    name: 'Océan',
    type: 'gradient',
    emoji: '🌊',
    rarity: 'common',
    basePrice: 15,
    description: 'Profondeurs marines',
    className: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600'
  },
  {
    id: 'bg-forest',
    name: 'Forêt Enchantée',
    type: 'gradient',
    emoji: '🌲',
    rarity: 'uncommon',
    basePrice: 15,
    description: 'Verdure luxuriante',
    className: 'bg-gradient-to-br from-green-400 via-emerald-500 to-green-700'
  },
  {
    id: 'bg-galaxy',
    name: 'Galaxie',
    type: 'gradient',
    emoji: '🌌',
    rarity: 'epic',
    basePrice: 20,
    description: 'Espace infini',
    className: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'
  },
  {
    id: 'bg-aurora',
    name: 'Aurore Boréale',
    type: 'gradient',
    emoji: '✨',
    rarity: 'legendary',
    basePrice: 25,
    description: 'Lumières magiques du nord',
    className: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 animate-pulse'
  },

  // ========== THEMES ==========
  {
    id: 'bg-cherry-blossom',
    name: 'Cerisiers en Fleurs',
    type: 'theme',
    emoji: '🌸',
    rarity: 'rare',
    basePrice: 18,
    description: 'Ambiance kawaii japonaise',
    className: 'bg-gradient-to-br from-pink-200 via-pink-300 to-rose-400'
  },
  {
    id: 'bg-halloween',
    name: 'Halloween',
    type: 'theme',
    emoji: '🎃',
    rarity: 'rare',
    basePrice: 18,
    description: 'Frissons garantis',
    className: 'bg-gradient-to-br from-orange-600 via-purple-800 to-black'
  },
  {
    id: 'bg-christmas',
    name: 'Noël',
    type: 'theme',
    emoji: '🎄',
    rarity: 'rare',
    basePrice: 18,
    description: 'Esprit de Noël',
    className: 'bg-gradient-to-br from-red-600 via-green-700 to-white'
  },
  {
    id: 'bg-cyberpunk',
    name: 'Cyberpunk',
    type: 'theme',
    emoji: '🤖',
    rarity: 'epic',
    basePrice: 20,
    description: 'Futur néon',
    className: 'bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500'
  },
  {
    id: 'bg-rainbow',
    name: 'Arc-en-ciel',
    type: 'animated',
    emoji: '🌈',
    rarity: 'legendary',
    basePrice: 25,
    description: 'Toutes les couleurs !',
    className: 'bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient'
  },

  // ========== PATTERNS ==========
  {
    id: 'bg-polka-dots',
    name: 'Pois',
    type: 'pattern',
    emoji: '⚪',
    rarity: 'uncommon',
    basePrice: 15,
    description: 'Motif à pois classique',
    className: 'bg-pink-300 bg-polka-dots'
  },
  {
    id: 'bg-stripes',
    name: 'Rayures',
    type: 'pattern',
    emoji: '🦓',
    rarity: 'uncommon',
    basePrice: 15,
    description: 'Rayures colorées',
    className: 'bg-gradient-to-r from-blue-400 to-purple-400 bg-stripes'
  },
  {
    id: 'bg-stars',
    name: 'Étoiles',
    type: 'pattern',
    emoji: '⭐',
    rarity: 'rare',
    basePrice: 18,
    description: 'Ciel étoilé',
    className: 'bg-indigo-900 bg-stars'
  }
]

/**
 * Obtenir le prix final d'un arrière-plan
 */
export function getBackgroundPrice(background: Background): number {
  const rarityMultiplier = rarityConfig[background.rarity].priceMultiplier
  return Math.round(background.basePrice * rarityMultiplier)
}

/**
 * Filtrer par type
 */
export function getBackgroundsByType(type: BackgroundType): Background[] {
  return backgroundsCatalog.filter(bg => bg.type === type)
}

/**
 * Obtenir un arrière-plan par ID
 */
export function getBackgroundById(id: string): Background | undefined {
  return backgroundsCatalog.find(bg => bg.id === id)
}
```

---

## 🌟 Système de Rareté

### Configuration des Raretés

| Rareté | Emoji | Couleur | Multiplicateur | Drop Rate | Description |
|--------|-------|---------|----------------|-----------|-------------|
| **Commun** | ⚪ | Gris | 1.0x | 50% | Accessoires de base, faciles à obtenir |
| **Peu Commun** | 🟢 | Vert | 1.5x | 30% | Accessoires sympas, assez accessibles |
| **Rare** | 🔵 | Bleu | 2.5x | 15% | Accessoires spéciaux, collection |
| **Épique** | 🟣 | Violet | 4.0x | 4% | Accessoires puissants, prestige |
| **Légendaire** | 🟡 | Or | 10.0x | 1% | Ultra rares, status symbol |

### Utilitaires de Rareté (`src/lib/utils/rarity.utils.ts`)

```typescript
import { rarityConfig } from '@/config/accessories.config'
import type { Rarity } from '@/types/accessories'

/**
 * Obtenir la configuration d'une rareté
 */
export function getRarityConfig(rarity: Rarity) {
  return rarityConfig[rarity]
}

/**
 * Obtenir la couleur d'une rareté
 */
export function getRarityColor(rarity: Rarity): string {
  return rarityConfig[rarity].color
}

/**
 * Obtenir l'emoji d'une rareté
 */
export function getRarityEmoji(rarity: Rarity): string {
  return rarityConfig[rarity].emoji
}

/**
 * Obtenir le nom d'une rareté
 */
export function getRarityName(rarity: Rarity): string {
  return rarityConfig[rarity].name
}

/**
 * Trier les raretés par ordre (Common → Legendary)
 */
export function sortByRarity<T extends { rarity: Rarity }>(items: T[]): T[] {
  return items.sort((a, b) => {
    return rarityConfig[a.rarity].order - rarityConfig[b.rarity].order
  })
}

/**
 * Obtenir un item aléatoire selon les drop rates
 * Utilisé pour les "loot boxes" ou événements spéciaux
 */
export function getRandomItemByRarity<T extends { rarity: Rarity }>(
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
```

### Composant Badge de Rareté (`src/components/accessories/rarity-badge.tsx`)

```tsx
'use client'

import { getRarityConfig } from '@/lib/utils/rarity.utils'
import type { Rarity } from '@/types/accessories'

interface RarityBadgeProps {
  rarity: Rarity
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

export function RarityBadge({ 
  rarity, 
  size = 'md', 
  showName = true 
}: RarityBadgeProps) {
  const config = getRarityConfig(rarity)
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }
  
  return (
    <div
      className={`
        inline-flex items-center gap-1 rounded-full
        bg-gradient-to-r ${config.color}
        text-white font-bold
        shadow-lg
        ${sizeClasses[size]}
      `}
    >
      <span>{config.emoji}</span>
      {showName && <span>{config.name}</span>}
    </div>
  )
}
```

---

## 🛒 Intégration Boutique

### Extension du Type ShopCategory

```typescript
// src/types/shop.ts
export type ShopCategory = 
  | 'xp-boosts' 
  | 'food' 
  | 'accessories'      // ✨ NOUVEAU
  | 'backgrounds'      // ✨ NOUVEAU
  | 'customization'
```

### Composant Boutique d'Accessoires (`src/components/shop/accessories-shop.tsx`)

```tsx
'use client'

import { useState } from 'react'
import { accessoriesCatalog, getAccessoryPrice } from '@/config/accessories.config'
import { useWallet } from '@/hooks/wallet/use-wallet'
import { purchaseAccessory } from '@/actions/accessories.actions'
import { RarityBadge } from '@/components/accessories/rarity-badge'
import type { AccessoryCategory } from '@/types/accessories'

export function AccessoriesShop() {
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)
  const { koins, refreshWallet } = useWallet()

  const categories: Array<{ id: AccessoryCategory | 'all', name: string, emoji: string }> = [
    { id: 'all', name: 'Tous', emoji: '🎨' },
    { id: 'hat', name: 'Chapeaux', emoji: '🎩' },
    { id: 'glasses', name: 'Lunettes', emoji: '👓' },
    { id: 'shoes', name: 'Chaussures', emoji: '👟' }
  ]

  const filteredAccessories = selectedCategory === 'all'
    ? accessoriesCatalog
    : accessoriesCatalog.filter(acc => acc.category === selectedCategory)

  async function handlePurchase(accessoryId: string) {
    setIsPurchasing(accessoryId)
    try {
      const result = await purchaseAccessory(accessoryId)
      if (result.success) {
        await refreshWallet()
        // Toast de succès
      } else {
        // Toast d'erreur
      }
    } finally {
      setIsPurchasing(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
          🎨 Boutique d'Accessoires
        </h2>
        <p className="text-gray-600 mt-2">
          Personnalise tes créatures avec style !
        </p>
      </div>

      {/* Filtres de catégorie */}
      <div className="flex gap-3 justify-center flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-6 py-3 rounded-full font-bold text-lg
              transition-all duration-300
              ${selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-lg'
                : 'bg-white text-gray-700 hover:scale-105 shadow-md'
              }
            `}
          >
            <span className="text-2xl mr-2">{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grille d'accessoires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccessories.map(accessory => {
          const price = getAccessoryPrice(accessory)
          const canAfford = koins >= price
          const isLoading = isPurchasing === accessory.id

          return (
            <div
              key={accessory.id}
              className="
                relative overflow-hidden rounded-3xl
                bg-gradient-to-br from-white via-purple-50 to-pink-50
                p-6 shadow-xl
                ring-2 ring-white/80
                hover:scale-105 hover:shadow-2xl
                transition-all duration-300
              "
            >
              {/* Badge de rareté */}
              <div className="absolute top-4 right-4">
                <RarityBadge rarity={accessory.rarity} size="sm" />
              </div>

              {/* Emoji géant */}
              <div className="text-8xl text-center mb-4">
                {accessory.emoji}
              </div>

              {/* Nom */}
              <h3 className="text-2xl font-black text-center text-gray-800 mb-2">
                {accessory.name}
              </h3>

              {/* Description */}
              <p className="text-center text-gray-600 mb-4 text-sm">
                {accessory.description}
              </p>

              {/* Prix */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">
                  {price}
                </span>
                <span className="text-2xl">🪙</span>
              </div>

              {/* Bouton d'achat */}
              <button
                onClick={() => handlePurchase(accessory.id)}
                disabled={!canAfford || isLoading}
                className={`
                  w-full py-3 rounded-2xl font-bold text-lg
                  transition-all duration-300
                  flex items-center justify-center gap-2
                  ${canAfford && !isLoading
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:brightness-110 hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin text-2xl">⏳</span>
                    <span>Achat...</span>
                  </>
                ) : canAfford ? (
                  <>
                    <span className="text-2xl">🛒</span>
                    <span>Acheter</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">❌</span>
                    <span>Pas assez de Koins</span>
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### Composant Boutique d'Arrière-plans

Structure similaire à `AccessoriesShop`, adaptée pour les arrière-plans avec prévisualisation visuelle.

---

## 💾 Base de Données

### Collections MongoDB

#### Collection `accessories`

```typescript
// Stocke les accessoires possédés par les utilisateurs
{
  _id: ObjectId
  accessoryId: string       // Référence au catalogue
  ownerId: string          // ID de l'utilisateur
  equippedOnMonsterId: string | null  // null si non équipé
  acquiredAt: Date
}

// Index
- { ownerId: 1, accessoryId: 1 } - unique
- { equippedOnMonsterId: 1 }
- { ownerId: 1, equippedOnMonsterId: 1 }
```

#### Collection `backgrounds`

```typescript
// Stocke les arrière-plans possédés
{
  _id: ObjectId
  backgroundId: string     // Référence au catalogue
  ownerId: string         // ID de l'utilisateur
  acquiredAt: Date
}

// Index
- { ownerId: 1, backgroundId: 1 } - unique
```

#### Modification Collection `monsters`

```typescript
// Ajouter un champ pour l'arrière-plan équipé
{
  // ... champs existants
  backgroundId: string | null  // ID de l'arrière-plan équipé
}

// Index
- { backgroundId: 1 }
```

### Models

#### Accessory Model (`src/db/models/accessory.model.ts`)

```typescript
import clientPromise from '@/db'
import type { OwnedAccessory } from '@/types/accessories'

export async function getUserAccessories(userId: string): Promise<OwnedAccessory[]> {
  const client = await clientPromise
  const db = client.db()
  return db.collection<OwnedAccessory>('accessories')
    .find({ ownerId: userId })
    .toArray()
}

export async function getMonsterAccessories(monsterId: string): Promise<OwnedAccessory[]> {
  const client = await clientPromise
  const db = client.db()
  return db.collection<OwnedAccessory>('accessories')
    .find({ equippedOnMonsterId: monsterId })
    .toArray()
}

export async function purchaseAccessory(
  userId: string,
  accessoryId: string
): Promise<OwnedAccessory> {
  const client = await clientPromise
  const db = client.db()
  
  const newAccessory: Omit<OwnedAccessory, '_id'> = {
    accessoryId,
    ownerId: userId,
    equippedOnMonsterId: null,
    acquiredAt: new Date()
  }
  
  const result = await db.collection('accessories').insertOne(newAccessory)
  
  return {
    _id: result.insertedId.toString(),
    ...newAccessory
  }
}

export async function equipAccessory(
  accessoryDbId: string,
  monsterId: string,
  category: AccessoryCategory
): Promise<void> {
  const client = await clientPromise
  const db = client.db()
  
  // Déséquiper tous les accessoires de cette catégorie sur ce monstre
  await db.collection('accessories').updateMany(
    { 
      equippedOnMonsterId: monsterId,
      accessoryId: { $regex: `^${category}-` }  // Pattern matching
    },
    { $set: { equippedOnMonsterId: null } }
  )
  
  // Équiper le nouvel accessoire
  await db.collection('accessories').updateOne(
    { _id: accessoryDbId },
    { $set: { equippedOnMonsterId: monsterId } }
  )
}

export async function unequipAccessory(accessoryDbId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db()
  
  await db.collection('accessories').updateOne(
    { _id: accessoryDbId },
    { $set: { equippedOnMonsterId: null } }
  )
}
```

#### Background Model (`src/db/models/background.model.ts`)

```typescript
import clientPromise from '@/db'
import type { OwnedBackground } from '@/types/backgrounds'

export async function getUserBackgrounds(userId: string): Promise<OwnedBackground[]> {
  const client = await clientPromise
  const db = client.db()
  return db.collection<OwnedBackground>('backgrounds')
    .find({ ownerId: userId })
    .toArray()
}

export async function purchaseBackground(
  userId: string,
  backgroundId: string
): Promise<OwnedBackground> {
  const client = await clientPromise
  const db = client.db()
  
  const newBackground: Omit<OwnedBackground, '_id'> = {
    backgroundId,
    ownerId: userId,
    acquiredAt: new Date()
  }
  
  const result = await db.collection('backgrounds').insertOne(newBackground)
  
  return {
    _id: result.insertedId.toString(),
    ...newBackground
  }
}

export async function equipBackground(
  monsterId: string,
  backgroundId: string | null
): Promise<void> {
  const client = await clientPromise
  const db = client.db()
  
  await db.collection('monsters').updateOne(
    { _id: monsterId },
    { $set: { backgroundId } }
  )
}
```

---

## 🔌 API Routes

### Server Actions pour Accessoires (`src/actions/accessories.actions.ts`)

```typescript
'use server'

import { auth } from '@/lib/auth'
import { getAccessoryById, getAccessoryPrice } from '@/config/accessories.config'
import { subtractKoins } from '@/actions/wallet.actions'
import {
  getUserAccessories,
  getMonsterAccessories,
  purchaseAccessory as dbPurchaseAccessory,
  equipAccessory as dbEquipAccessory,
  unequipAccessory as dbUnequipAccessory
} from '@/db/models/accessory.model'
import type { OwnedAccessory } from '@/types/accessories'

/**
 * Acheter un accessoire
 */
export async function purchaseAccessory(accessoryId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    return { success: false, error: 'Non authentifié' }
  }

  // Vérifier que l'accessoire existe
  const accessory = getAccessoryById(accessoryId)
  if (!accessory) {
    return { success: false, error: 'Accessoire introuvable' }
  }

  // Calculer le prix
  const price = getAccessoryPrice(accessory)

  // Vérifier si l'utilisateur possède déjà cet accessoire
  const userAccessories = await getUserAccessories(session.user.id)
  const alreadyOwned = userAccessories.some(acc => acc.accessoryId === accessoryId)
  
  if (alreadyOwned) {
    return { success: false, error: 'Accessoire déjà possédé' }
  }

  // Débiter les Koins
  const walletResult = await subtractKoins(price)
  if (!walletResult.success) {
    return { success: false, error: 'Pas assez de Koins' }
  }

  // Créer l'accessoire
  const newAccessory = await dbPurchaseAccessory(session.user.id, accessoryId)

  return {
    success: true,
    accessory: newAccessory
  }
}

/**
 * Équiper un accessoire sur une créature
 */
export async function equipAccessory(
  accessoryDbId: string,
  monsterId: string
) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    return { success: false, error: 'Non authentifié' }
  }

  // Vérifier que l'accessoire appartient à l'utilisateur
  const userAccessories = await getUserAccessories(session.user.id)
  const accessory = userAccessories.find(acc => acc._id === accessoryDbId)
  
  if (!accessory) {
    return { success: false, error: 'Accessoire introuvable' }
  }

  // Récupérer la catégorie depuis le catalogue
  const accessoryInfo = getAccessoryById(accessory.accessoryId)
  if (!accessoryInfo) {
    return { success: false, error: 'Configuration accessoire introuvable' }
  }

  // Équiper
  await dbEquipAccessory(accessoryDbId, monsterId, accessoryInfo.category)

  return { success: true }
}

/**
 * Retirer un accessoire
 */
export async function unequipAccessory(accessoryDbId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    return { success: false, error: 'Non authentifié' }
  }

  await dbUnequipAccessory(accessoryDbId)

  return { success: true }
}

/**
 * Obtenir tous les accessoires de l'utilisateur
 */
export async function getMyAccessories(): Promise<OwnedAccessory[]> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    return []
  }

  return getUserAccessories(session.user.id)
}

/**
 * Obtenir les accessoires équipés sur une créature
 */
export async function getCreatureAccessories(monsterId: string): Promise<OwnedAccessory[]> {
  return getMonsterAccessories(monsterId)
}
```

### Server Actions pour Arrière-plans (similaire)

---

## 🎨 Composants UI

### Sélecteur d'Accessoires (`src/components/accessories/accessory-selector.tsx`)

```tsx
'use client'

import { useState } from 'react'
import { useAccessories } from '@/hooks/accessories/use-accessories'
import { useEquipAccessory } from '@/hooks/accessories/use-equip-accessory'
import { getAccessoryById } from '@/config/accessories.config'
import { RarityBadge } from './rarity-badge'
import type { AccessoryCategory } from '@/types/accessories'

interface AccessorySelectorProps {
  monsterId: string
  category: AccessoryCategory
  onClose: () => void
}

export function AccessorySelector({ 
  monsterId, 
  category, 
  onClose 
}: AccessorySelectorProps) {
  const { accessories, loading } = useAccessories()
  const { equipAccessory, unequipAccessory, isEquipping } = useEquipAccessory(monsterId)

  // Filtrer par catégorie
  const categoryAccessories = accessories
    .filter(acc => {
      const info = getAccessoryById(acc.accessoryId)
      return info?.category === category
    })

  // Trouver l'accessoire actuellement équipé
  const equipped = categoryAccessories.find(acc => acc.equippedOnMonsterId === monsterId)

  const categoryLabels = {
    hat: { name: 'Chapeau', emoji: '🎩' },
    glasses: { name: 'Lunettes', emoji: '👓' },
    shoes: { name: 'Chaussures', emoji: '👟' }
  }

  const label = categoryLabels[category]

  async function handleEquip(accessoryDbId: string) {
    await equipAccessory(accessoryDbId)
    onClose()
  }

  async function handleUnequip() {
    if (equipped) {
      await unequipAccessory(equipped._id)
      onClose()
    }
  }

  if (loading) {
    return <div className="text-center py-8">⏳ Chargement...</div>
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-black">
            <span className="text-4xl mr-2">{label.emoji}</span>
            {label.name}
          </h3>
          <button
            onClick={onClose}
            className="text-3xl hover:scale-110 transition-transform"
          >
            ❌
          </button>
        </div>

        {/* Liste d'accessoires */}
        {categoryAccessories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-2xl mb-2">😢</p>
            <p>Aucun {label.name.toLowerCase()} possédé</p>
            <p className="text-sm mt-2">Va faire un tour à la boutique !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Option pour retirer */}
            {equipped && (
              <button
                onClick={handleUnequip}
                disabled={isEquipping}
                className="
                  w-full p-4 rounded-2xl
                  bg-gradient-to-r from-gray-400 to-gray-600
                  text-white font-bold text-lg
                  hover:brightness-110 hover:scale-105
                  transition-all duration-300
                  flex items-center justify-center gap-2
                "
              >
                <span className="text-2xl">🗑️</span>
                <span>Retirer</span>
              </button>
            )}

            {/* Liste des accessoires */}
            {categoryAccessories.map(acc => {
              const info = getAccessoryById(acc.accessoryId)
              if (!info) return null

              const isEquipped = acc._id === equipped?._id

              return (
                <button
                  key={acc._id}
                  onClick={() => handleEquip(acc._id)}
                  disabled={isEquipped || isEquipping}
                  className={`
                    w-full p-4 rounded-2xl
                    flex items-center gap-4
                    transition-all duration-300
                    ${isEquipped
                      ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-white ring-4 ring-green-300'
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 hover:scale-105'
                    }
                  `}
                >
                  {/* Emoji */}
                  <span className="text-5xl">{info.emoji}</span>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg">{info.name}</div>
                    <div className="text-sm opacity-80">{info.description}</div>
                  </div>

                  {/* Badge de rareté */}
                  <RarityBadge rarity={info.rarity} size="sm" />

                  {/* Indicateur équipé */}
                  {isEquipped && (
                    <span className="text-2xl">✅</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Slot d'Accessoire (`src/components/accessories/accessory-slot.tsx`)

```tsx
'use client'

import { useState } from 'react'
import { getAccessoryById } from '@/config/accessories.config'
import { AccessorySelector } from './accessory-selector'
import type { OwnedAccessory, AccessoryCategory } from '@/types/accessories'

interface AccessorySlotProps {
  monsterId: string
  category: AccessoryCategory
  equipped: OwnedAccessory | null
}

export function AccessorySlot({ monsterId, category, equipped }: AccessorySlotProps) {
  const [showSelector, setShowSelector] = useState(false)

  const info = equipped ? getAccessoryById(equipped.accessoryId) : null

  const categoryLabels = {
    hat: { name: 'Chapeau', emoji: '🎩' },
    glasses: { name: 'Lunettes', emoji: '👓' },
    shoes: { name: 'Chaussures', emoji: '👟' }
  }

  const label = categoryLabels[category]

  return (
    <>
      <button
        onClick={() => setShowSelector(true)}
        className="
          relative w-full aspect-square
          rounded-2xl overflow-hidden
          bg-gradient-to-br from-purple-100 to-pink-100
          hover:scale-105 hover:shadow-lg
          transition-all duration-300
          flex flex-col items-center justify-center
          gap-2
        "
      >
        {/* Emoji de l'accessoire ou placeholder */}
        <span className="text-5xl">
          {info?.emoji || label.emoji}
        </span>

        {/* Label */}
        <span className="text-sm font-bold text-gray-700">
          {info?.name || label.name}
        </span>

        {/* Badge équipé */}
        {equipped && (
          <span className="absolute top-2 right-2 text-xl">✅</span>
        )}
      </button>

      {/* Modal de sélection */}
      {showSelector && (
        <AccessorySelector
          monsterId={monsterId}
          category={category}
          onClose={() => setShowSelector(false)}
        />
      )}
    </>
  )
}
```

---

## 📱 UX et Affichage

### Dans le Détail d'une Créature

```tsx
// src/app/app/creatures/[id]/page.tsx (extrait)

import { AccessorySlot } from '@/components/accessories/accessory-slot'
import { getCreatureAccessories } from '@/actions/accessories.actions'

export default async function CreatureDetailPage({ params }: { params: { id: string } }) {
  // ... récupération de la créature
  
  const accessories = await getCreatureAccessories(params.id)
  
  const hat = accessories.find(acc => {
    const info = getAccessoryById(acc.accessoryId)
    return info?.category === 'hat' && acc.equippedOnMonsterId === params.id
  })
  
  // Idem pour glasses et shoes

  return (
    <div className="space-y-8">
      {/* Affichage de la créature avec accessoires visuels */}
      <div className="relative">
        <MonsterDisplay 
          monster={monster} 
          accessories={{ hat, glasses, shoes }}
        />
      </div>

      {/* Section personnalisation */}
      <div className="bg-white rounded-3xl p-6 shadow-xl">
        <h3 className="text-2xl font-black mb-4">
          🎨 Personnalisation
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <AccessorySlot 
            monsterId={params.id} 
            category="hat" 
            equipped={hat || null} 
          />
          <AccessorySlot 
            monsterId={params.id} 
            category="glasses" 
            equipped={glasses || null} 
          />
          <AccessorySlot 
            monsterId={params.id} 
            category="shoes" 
            equipped={shoes || null} 
          />
        </div>
      </div>
    </div>
  )
}
```

### Dans la Liste du Dashboard

```tsx
// src/components/dashboard/monster-card.tsx (extrait)

export function MonsterCard({ monster, accessories }: MonsterCardProps) {
  const hat = accessories.find(acc => {
    const info = getAccessoryById(acc.accessoryId)
    return info?.category === 'hat'
  })
  
  return (
    <div className="relative bg-white rounded-3xl p-4 shadow-xl">
      {/* Créature */}
      <MonsterDisplay monster={monster} size="sm" />
      
      {/* Icônes d'accessoires équipés */}
      {accessories.length > 0 && (
        <div className="absolute top-2 right-2 flex gap-1">
          {accessories.map(acc => {
            const info = getAccessoryById(acc.accessoryId)
            return info ? (
              <span key={acc._id} className="text-xl">
                {info.emoji}
              </span>
            ) : null
          })}
        </div>
      )}
      
      {/* Reste du contenu */}
    </div>
  )
}
```

### Rendu Visuel des Accessoires sur la Créature

```tsx
// src/components/creature/monster-with-accessories.tsx

interface MonsterWithAccessoriesProps {
  monster: DBMonster
  accessories: {
    hat: OwnedAccessory | null
    glasses: OwnedAccessory | null
    shoes: OwnedAccessory | null
  }
  background: Background | null
}

export function MonsterWithAccessories({ 
  monster, 
  accessories,
  background 
}: MonsterWithAccessoriesProps) {
  const hatInfo = accessories.hat ? getAccessoryById(accessories.hat.accessoryId) : null
  const glassesInfo = accessories.glasses ? getAccessoryById(accessories.glasses.accessoryId) : null
  const shoesInfo = accessories.shoes ? getAccessoryById(accessories.shoes.accessoryId) : null

  return (
    <div className={`
      relative w-full aspect-square
      rounded-3xl overflow-hidden
      ${background ? background.className : 'bg-gradient-to-br from-purple-100 to-pink-100'}
    `}>
      {/* Créature de base */}
      <div className="absolute inset-0 flex items-center justify-center">
        <MonsterPixelArt monster={monster} />
      </div>

      {/* Chapeau */}
      {hatInfo && (
        <div 
          className="absolute text-6xl"
          style={hatInfo.style}
        >
          {hatInfo.emoji}
        </div>
      )}

      {/* Lunettes */}
      {glassesInfo && (
        <div 
          className="absolute text-6xl"
          style={glassesInfo.style}
        >
          {glassesInfo.emoji}
        </div>
      )}

      {/* Chaussures */}
      {shoesInfo && (
        <div 
          className="absolute text-6xl"
          style={shoesInfo.style}
        >
          {shoesInfo.emoji}
        </div>
      )}
    </div>
  )
}
```

---

## 🔗 Gestion d'État

### Hook pour Accessoires (`src/hooks/accessories/use-accessories.ts`)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getMyAccessories } from '@/actions/accessories.actions'
import type { OwnedAccessory } from '@/types/accessories'

export function useAccessories() {
  const [accessories, setAccessories] = useState<OwnedAccessory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAccessories()
  }, [])

  async function loadAccessories() {
    try {
      setLoading(true)
      const data = await getMyAccessories()
      setAccessories(data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function refresh() {
    await loadAccessories()
  }

  return {
    accessories,
    loading,
    error,
    refresh
  }
}
```

### Hook pour Équiper (`src/hooks/accessories/use-equip-accessory.ts`)

```typescript
'use client'

import { useState } from 'react'
import { 
  equipAccessory as equipAccessoryAction,
  unequipAccessory as unequipAccessoryAction 
} from '@/actions/accessories.actions'
import { useAccessories } from './use-accessories'

export function useEquipAccessory(monsterId: string) {
  const [isEquipping, setIsEquipping] = useState(false)
  const { refresh } = useAccessories()

  async function equipAccessory(accessoryDbId: string) {
    setIsEquipping(true)
    try {
      const result = await equipAccessoryAction(accessoryDbId, monsterId)
      if (result.success) {
        await refresh()
        return { success: true }
      }
      return { success: false, error: result.error }
    } finally {
      setIsEquipping(false)
    }
  }

  async function unequipAccessory(accessoryDbId: string) {
    setIsEquipping(true)
    try {
      const result = await unequipAccessoryAction(accessoryDbId)
      if (result.success) {
        await refresh()
        return { success: true }
      }
      return { success: false, error: result.error }
    } finally {
      setIsEquipping(false)
    }
  }

  return {
    equipAccessory,
    unequipAccessory,
    isEquipping
  }
}
```

---

## ✅ Tests et Validation

### Checklist de Tests

#### Fonctionnels
- [ ] ✅ Acheter un accessoire commun
- [ ] ✅ Acheter un accessoire légendaire
- [ ] ✅ Impossible d'acheter deux fois le même
- [ ] ✅ Impossible d'acheter sans assez de Koins
- [ ] ✅ Équiper un chapeau sur une créature
- [ ] ✅ Équiper des lunettes remplace les anciennes
- [ ] ✅ Retirer un accessoire fonctionne
- [ ] ✅ Accessoires visibles dans le détail
- [ ] ✅ Accessoires visibles dans la liste
- [ ] ✅ Acheter un arrière-plan
- [ ] ✅ Équiper un arrière-plan
- [ ] ✅ Retirer un arrière-plan

#### UI/UX
- [ ] ✅ Design responsive mobile
- [ ] ✅ Animations fluides
- [ ] ✅ États de chargement clairs
- [ ] ✅ Messages d'erreur explicites
- [ ] ✅ Badges de rareté visibles
- [ ] ✅ Preview avant achat

#### Performance
- [ ] ✅ Chargement < 2s
- [ ] ✅ Pas de lag lors de l'équipement
- [ ] ✅ Images optimisées
- [ ] ✅ Cache approprié

---

## 🚀 Migration et Déploiement

### Étapes de Migration

#### 1. Préparation

```bash
# Créer les nouveaux fichiers de types
touch src/types/accessories.ts
touch src/types/backgrounds.ts

# Créer les configs
touch src/config/accessories.config.ts
touch src/config/backgrounds.config.ts

# Créer les models
touch src/db/models/accessory.model.ts
touch src/db/models/background.model.ts
```

#### 2. Base de Données

```typescript
// Script de migration: scripts/migrate-accessories.ts
import clientPromise from '@/db'

async function migrate() {
  const client = await clientPromise
  const db = client.db()

  // Créer les collections
  await db.createCollection('accessories')
  await db.createCollection('backgrounds')

  // Créer les index
  await db.collection('accessories').createIndex(
    { ownerId: 1, accessoryId: 1 },
    { unique: true }
  )
  await db.collection('accessories').createIndex({ equippedOnMonsterId: 1 })
  await db.collection('backgrounds').createIndex(
    { ownerId: 1, backgroundId: 1 },
    { unique: true }
  )

  // Ajouter le champ backgroundId aux monsters
  await db.collection('monsters').updateMany(
    { backgroundId: { $exists: false } },
    { $set: { backgroundId: null } }
  )
  await db.collection('monsters').createIndex({ backgroundId: 1 })

  console.log('✅ Migration terminée')
}

migrate().catch(console.error)
```

#### 3. Déploiement

1. **Test en local** : Vérifier toutes les fonctionnalités
2. **Migration DB en staging** : Exécuter le script de migration
3. **Tests en staging** : Validation complète
4. **Migration DB en production** : Fenêtre de maintenance
5. **Déploiement du code** : Via Vercel
6. **Monitoring** : Surveiller les erreurs

### Variables d'Environnement

Aucune nouvelle variable nécessaire, utilise l'infrastructure existante.

### Rollback

En cas de problème:

```typescript
// Rollback script
async function rollback() {
  const client = await clientPromise
  const db = client.db()

  // Supprimer les collections
  await db.collection('accessories').drop()
  await db.collection('backgrounds').drop()

  // Retirer le champ des monsters
  await db.collection('monsters').updateMany(
    {},
    { $unset: { backgroundId: '' } }
  )

  console.log('✅ Rollback terminé')
}
```

---

## 📊 Métriques de Succès

### KPIs à Suivre

- **Taux d'adoption** : % d'utilisateurs qui achètent au moins 1 accessoire
- **Revenu moyen** : Koins dépensés par utilisateur
- **Collection** : Nombre moyen d'accessoires possédés
- **Engagement** : Fréquence de changement d'accessoires
- **Raretés** : Distribution des achats par rareté
- **Conversion** : % d'utilisateurs qui passent de boutique Koins → accessoires

### Objectifs

- ✅ 50% des utilisateurs achètent au moins 1 accessoire dans les 7 jours
- ✅ Moyenne de 5 accessoires possédés par utilisateur actif
- ✅ 30% des Koins dépensés vont dans les accessoires
- ✅ Au moins 1 changement d'accessoire par semaine par utilisateur

---

## 🎯 Évolutions Futures

### Phase 2 - Court Terme
- 🎁 **Loot Boxes** : Packs mystère avec accessoires aléatoires
- 🎨 **Accessoires animés** : Effet de particules, brillance
- 👥 **Showcase** : Galerie pour montrer ses créatures stylées
- 🏆 **Achievements** : Collectionneur (100%), fashionista, etc.

### Phase 3 - Moyen Terme
- 🔄 **Échange** : Trading d'accessoires entre joueurs
- 🎲 **Événements** : Accessoires saisonniers limités
- 🎪 **Roulette** : Wheel of fortune pour accessoires
- 💎 **Crafting** : Combiner 3 communs → 1 rare

### Phase 4 - Long Terme
- 🖼️ **NFT Integration** : Accessoires uniques en blockchain
- 🎨 **User-Generated** : Créer ses propres accessoires
- 🏪 **Marketplace** : Vente entre joueurs
- 🌐 **Cross-Game** : Accessoires utilisables dans d'autres jeux

---

## 📚 Références

### Documentation Interne
- [Wallet Shop System](./WALLET_SHOP_SYSTEM.md)
- [Monster System](./monsters/monster-system.md)
- [Architecture SOLID](../documentation/docs/architecture/solid-principles.md)

### Technologies
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 👥 Contributeurs

- **Lead Developer** : À définir
- **UI/UX Designer** : À définir
- **Product Owner** : À définir

---

## 📝 Notes de Version

### v1.0.0 - Spécification Initiale
- ✅ Système d'accessoires complet (chapeaux, lunettes, chaussures)
- ✅ Système d'arrière-plans
- ✅ Système de rareté à 5 niveaux
- ✅ Intégration boutique avec Koins
- ✅ Affichage dans détail et liste
- ✅ Architecture SOLID

---

**Date de création** : [Date actuelle]  
**Dernière mise à jour** : [Date actuelle]  
**Statut** : 🟡 En attente de développement  
**Priorité** : 🔥 Haute

