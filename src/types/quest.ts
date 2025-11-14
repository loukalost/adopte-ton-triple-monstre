import type { Types } from 'mongoose'

/**
 * Types de quêtes disponibles
 *
 * Extensible pour ajouter de nouveaux types de quêtes
 */
export type QuestType =
  | 'feed_monster' // Nourrir un monstre X fois
  | 'level_up' // Faire évoluer un monstre
  | 'interact' // Interagir avec X monstres différents
  | 'buy_accessory' // Acheter un accessoire
  | 'make_public' // Rendre un monstre public
  | 'visit_gallery' // Visiter la galerie
  | 'equip_accessory' // Équiper un accessoire

/**
 * Configuration d'une quête (template)
 *
 * Responsabilité : définir la structure d'une quête disponible
 */
export interface QuestTemplate {
  /** Identifiant unique de la quête */
  id: string
  /** Type de quête */
  type: QuestType
  /** Titre de la quête */
  title: string
  /** Description détaillée */
  description: string
  /** Objectif à atteindre (nombre de fois) */
  target: number
  /** Récompense en Koins */
  reward: number
  /** Icône/emoji pour l'affichage */
  icon: string
}

/**
 * Progression d'une quête pour un utilisateur
 *
 * Responsabilité : suivre l'avancement d'une quête spécifique
 */
export interface QuestProgress {
  /** ID de la quête (référence au template) */
  questId: string
  /** Progression actuelle */
  current: number
  /** Objectif à atteindre */
  target: number
  /** Quête complétée ou non */
  completed: boolean
  /** Date de complétion (si complétée) */
  completedAt?: Date
  /** Récompense réclamée ou non */
  claimed: boolean
  /** Date de réclamation (si réclamée) */
  claimedAt?: Date
}

/**
 * Quêtes journalières d'un utilisateur (document MongoDB)
 *
 * Responsabilité : stocker les quêtes actives d'un utilisateur pour un jour donné
 */
export interface DailyQuests {
  /** ID du document */
  _id: string | Types.ObjectId
  /** ID de l'utilisateur */
  userId: string | Types.ObjectId
  /** Date du jour (format YYYY-MM-DD) */
  date: string
  /** Liste des quêtes actives avec leur progression */
  quests: QuestProgress[]
  /** Date de création */
  createdAt: Date
  /** Date de dernière mise à jour */
  updatedAt: Date
}

/**
 * Type pour les quêtes affichées dans l'UI (avec template enrichi)
 *
 * Responsabilité : combiner template et progression pour l'affichage
 */
export interface EnrichedQuest extends QuestProgress {
  /** Titre de la quête */
  title: string
  /** Description */
  description: string
  /** Récompense */
  reward: number
  /** Icône */
  icon: string
}
