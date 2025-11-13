/**
 * Monster Action Types
 *
 * Types partagés pour les actions sur les monstres.
 * Séparé des hooks pour permettre l'import dans les server actions.
 *
 * @module types/monster-action
 */

/**
 * Type représentant une action possible sur un monstre
 *
 * Actions disponibles :
 * - 'feed': Nourrir le monstre
 * - 'comfort': Consoler le monstre
 * - 'hug': Câliner le monstre
 * - 'wake': Réveiller le monstre
 * - null: Aucune action en cours
 */
export type MonsterAction = 'feed' | 'comfort' | 'hug' | 'wake' | null
