/**
 * Monster Actions Configuration
 *
 * Configuration centralisée des actions disponibles pour les monstres
 * et de leurs propriétés visuelles.
 *
 * Principe OCP : Facile d'ajouter de nouvelles actions sans modifier le code
 * Principe SRP : Responsabilité unique de configuration des actions
 *
 * @module config/monster-actions
 */

import type { MonsterAction } from '@/types/monster-action'

/**
 * Définition d'une action disponible
 */
export interface ActionDefinition {
  /** Clé de l'action */
  action: NonNullable<MonsterAction>
  /** Emoji représentant l'action */
  emoji: string
  /** Label textuel de l'action */
  label: string
  /** Couleur de fond (Tailwind CSS) */
  bgColor: string
  /** Couleur de fond au hover (Tailwind CSS) */
  bgColorHover: string
  /** Description de l'action */
  description?: string
}

/**
 * Liste des actions disponibles pour interagir avec un monstre
 *
 * Pour ajouter une nouvelle action :
 * 1. Ajouter le type dans MonsterAction
 * 2. Ajouter la récompense dans rewards.config.ts
 * 3. Ajouter l'action ici
 */
export const MONSTER_ACTIONS: ActionDefinition[] = [
  {
    action: 'feed',
    emoji: '🍎',
    label: 'Nourrir',
    bgColor: 'bg-orange-500',
    bgColorHover: 'hover:bg-orange-600',
    description: 'Donne à manger à ton monstre'
  },
  {
    action: 'comfort',
    emoji: '💙',
    label: 'Consoler',
    bgColor: 'bg-blue-500',
    bgColorHover: 'hover:bg-blue-600',
    description: 'Réconforte ton monstre'
  },
  {
    action: 'hug',
    emoji: '🤗',
    label: 'Câliner',
    bgColor: 'bg-pink-500',
    bgColorHover: 'hover:bg-pink-600',
    description: 'Fais un câlin à ton monstre'
  },
  {
    action: 'wake',
    emoji: '⏰',
    label: 'Réveiller',
    bgColor: 'bg-yellow-500',
    bgColorHover: 'hover:bg-yellow-600',
    description: 'Réveille ton monstre'
  }
]

/**
 * Map des couleurs par action (pour accès rapide)
 */
export const ACTION_COLORS: Record<NonNullable<MonsterAction>, { bg: string, hover: string }> = {
  feed: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-600'
  },
  comfort: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600'
  },
  hug: {
    bg: 'bg-pink-500',
    hover: 'hover:bg-pink-600'
  },
  wake: {
    bg: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600'
  }
}

/**
 * Helper pour obtenir les couleurs d'une action
 */
export function getActionColors (action: NonNullable<MonsterAction>): string {
  const colors = ACTION_COLORS[action]
  return `${colors.bg} ${colors.hover}`
}

/**
 * Helper pour obtenir l'emoji d'une action
 */
export function getActionEmoji (action: NonNullable<MonsterAction>): string {
  const actionDef = MONSTER_ACTIONS.find(a => a.action === action)
  return actionDef?.emoji ?? '❓'
}

/**
 * Helper pour obtenir le label d'une action
 */
export function getActionLabel (action: NonNullable<MonsterAction>): string {
  const actionDef = MONSTER_ACTIONS.find(a => a.action === action)
  return actionDef?.label ?? 'Action'
}
