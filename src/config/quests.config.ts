import type { QuestTemplate } from '@/types/quest'

/**
 * Configuration centralisée de toutes les quêtes disponibles
 *
 * Responsabilité unique : définir le catalogue complet des quêtes possibles
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement la configuration des quêtes
 * - OCP : Extensible (ajouter de nouvelles quêtes sans modifier le code existant)
 * - DIP : Les modules qui utilisent ces quêtes dépendent de l'interface QuestTemplate
 */

/**
 * Catalogue complet des quêtes disponibles
 */
export const QUEST_TEMPLATES: QuestTemplate[] = [
  // Quêtes de nourrissage
  {
    id: 'feed_3',
    type: 'feed_monster',
    title: 'Petit Festin',
    description: 'Nourris 3 fois ton monstre aujourd\'hui',
    target: 3,
    reward: 15,
    icon: '🍖'
  },
  {
    id: 'feed_5',
    type: 'feed_monster',
    title: 'Grand Festin',
    description: 'Nourris 5 fois ton monstre aujourd\'hui',
    target: 5,
    reward: 20,
    icon: '🍗'
  },
  {
    id: 'feed_10',
    type: 'feed_monster',
    title: 'Banquet Royal',
    description: 'Nourris 10 fois ton monstre aujourd\'hui',
    target: 10,
    reward: 35,
    icon: '🍖'
  },

  // Quêtes d'évolution
  {
    id: 'level_up_1',
    type: 'level_up',
    title: 'Évolution',
    description: 'Fais évoluer un monstre d\'un niveau',
    target: 1,
    reward: 50,
    icon: '⭐'
  },
  {
    id: 'level_up_2',
    type: 'level_up',
    title: 'Double Évolution',
    description: 'Fais évoluer un monstre de 2 niveaux',
    target: 2,
    reward: 100,
    icon: '🌟'
  },

  // Quêtes d'interaction
  {
    id: 'interact_3',
    type: 'interact',
    title: 'Sociable',
    description: 'Interagis avec 3 monstres différents',
    target: 3,
    reward: 30,
    icon: '🤝'
  },
  {
    id: 'interact_5',
    type: 'interact',
    title: 'Très Sociable',
    description: 'Interagis avec 5 monstres différents',
    target: 5,
    reward: 45,
    icon: '👥'
  },

  // Quêtes d'achat
  {
    id: 'buy_accessory_1',
    type: 'buy_accessory',
    title: 'Shopping Time',
    description: 'Achète un accessoire dans la boutique',
    target: 1,
    reward: 40,
    icon: '🛍️'
  },
  {
    id: 'buy_accessory_3',
    type: 'buy_accessory',
    title: 'Fashionista',
    description: 'Achète 3 accessoires dans la boutique',
    target: 3,
    reward: 100,
    icon: '💎'
  },

  // Quêtes de partage
  {
    id: 'make_public_1',
    type: 'make_public',
    title: 'Partage',
    description: 'Rends un monstre public',
    target: 1,
    reward: 15,
    icon: '🌍'
  },

  // Quêtes de galerie
  {
    id: 'visit_gallery_1',
    type: 'visit_gallery',
    title: 'Explorateur',
    description: 'Visite la galerie communautaire',
    target: 1,
    reward: 10,
    icon: '🖼️'
  },

  // Quêtes d'équipement
  {
    id: 'equip_accessory_1',
    type: 'equip_accessory',
    title: 'Styliste',
    description: 'Équipe un accessoire sur ton monstre',
    target: 1,
    reward: 25,
    icon: '👔'
  },
  {
    id: 'equip_accessory_3',
    type: 'equip_accessory',
    title: 'Fashion Expert',
    description: 'Équipe 3 accessoires différents',
    target: 3,
    reward: 60,
    icon: '👗'
  }
]

/**
 * Récupère un template de quête par son ID
 *
 * @param {string} questId - ID de la quête
 * @returns {QuestTemplate | undefined} Template de la quête ou undefined si non trouvée
 */
export function getQuestTemplateById (questId: string): QuestTemplate | undefined {
  return QUEST_TEMPLATES.find(q => q.id === questId)
}

/**
 * Récupère tous les templates de quêtes d'un type spécifique
 *
 * @param {string} type - Type de quête
 * @returns {QuestTemplate[]} Liste des templates du type spécifié
 */
export function getQuestTemplatesByType (type: string): QuestTemplate[] {
  return QUEST_TEMPLATES.filter(q => q.type === type)
}

/**
 * Sélectionne aléatoirement N quêtes du catalogue
 *
 * Responsabilité : générer une sélection aléatoire de quêtes pour un utilisateur
 *
 * @param {number} count - Nombre de quêtes à sélectionner (défaut: 3)
 * @returns {QuestTemplate[]} Liste de quêtes sélectionnées aléatoirement
 */
export function getRandomQuests (count: number = 3): QuestTemplate[] {
  const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, QUEST_TEMPLATES.length))
}
