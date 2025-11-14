'use server'

import { connectMongooseToDatabase } from '@/db'
import DailyQuestsModel from '@/db/models/daily-quests.model'
import Wallet from '@/db/models/wallet.model'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getRandomQuests, getQuestTemplateById } from '@/config/quests.config'
import type { EnrichedQuest, QuestType } from '@/types/quest'

/**
 * Récupère les quêtes journalières de l'utilisateur connecté
 *
 * Responsabilité unique : récupérer et enrichir les quêtes du jour
 *
 * @returns {Promise<EnrichedQuest[]>} Liste des quêtes enrichies avec leurs templates
 */
export async function getDailyQuests (): Promise<EnrichedQuest[]> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id === undefined) {
      return []
    }

    const userId = session.user.id
    const today = new Date().toISOString().split('T')[0]

    // Récupérer ou créer les quêtes du jour
    let dailyQuests = await DailyQuestsModel.findOne({ userId, date: today })

    // Si pas de quêtes pour aujourd'hui, en créer de nouvelles
    if (dailyQuests === null) {
      const randomQuests = getRandomQuests(3)
      dailyQuests = await DailyQuestsModel.create({
        userId,
        date: today,
        quests: randomQuests.map(template => ({
          questId: template.id,
          current: 0,
          target: template.target,
          completed: false,
          claimed: false
        }))
      })
    }

    // Enrichir les quêtes avec leurs templates
    const enrichedQuests: EnrichedQuest[] = dailyQuests.quests.map(quest => {
      const template = getQuestTemplateById(quest.questId)
      if (template === undefined) {
        throw new Error(`Quest template not found: ${quest.questId}`)
      }

      return {
        questId: quest.questId,
        current: quest.current,
        target: quest.target,
        completed: quest.completed,
        completedAt: quest.completedAt,
        claimed: quest.claimed,
        claimedAt: quest.claimedAt,
        title: template.title,
        description: template.description,
        reward: template.reward,
        icon: template.icon
      }
    })

    return enrichedQuests
  } catch (error) {
    console.error('Error getting daily quests:', error)
    return []
  }
}

/**
 * Met à jour la progression d'une quête
 *
 * Responsabilité unique : incrémenter la progression et gérer la complétion
 *
 * @param {QuestType} questType - Type de quête à mettre à jour
 * @param {number} increment - Valeur d'incrémentation (défaut: 1)
 * @returns {Promise<{ success: boolean, completed?: boolean, reward?: number }>}
 */
export async function updateQuestProgress (
  questType: QuestType,
  increment: number = 1
): Promise<{ success: boolean, completed?: boolean, reward?: number }> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id === undefined) {
      return { success: false }
    }

    const userId = session.user.id
    const today = new Date().toISOString().split('T')[0]

    const dailyQuests = await DailyQuestsModel.findOne({ userId, date: today })

    if (dailyQuests === null) {
      return { success: false }
    }

    // Trouver la quête du type spécifié qui n'est pas encore complétée
    const questIndex = dailyQuests.quests.findIndex(q => {
      const template = getQuestTemplateById(q.questId)
      return template?.type === questType && !q.completed
    })

    if (questIndex === -1) {
      return { success: false }
    }

    const quest = dailyQuests.quests[questIndex]
    quest.current = Math.min(quest.current + increment, quest.target)

    // Vérifier si la quête est maintenant complétée
    if (quest.current >= quest.target && !quest.completed) {
      quest.completed = true
      quest.completedAt = new Date()

      await dailyQuests.save()
      revalidatePath('/app')

      return { success: true, completed: true }
    }

    await dailyQuests.save()
    revalidatePath('/app')

    return { success: true, completed: false }
  } catch (error) {
    console.error('Error updating quest progress:', error)
    return { success: false }
  }
}

/**
 * Réclame la récompense d'une quête complétée
 *
 * Responsabilité unique : donner les Koins au joueur quand il réclame la récompense
 *
 * @param {string} questId - ID de la quête à réclamer
 * @returns {Promise<{ success: boolean, reward?: number, error?: string }>}
 */
export async function claimQuestReward (
  questId: string
): Promise<{ success: boolean, reward?: number, error?: string }> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id === undefined) {
      return { success: false, error: 'Not authenticated' }
    }

    const userId = session.user.id
    const today = new Date().toISOString().split('T')[0]

    const dailyQuests = await DailyQuestsModel.findOne({ userId, date: today })

    if (dailyQuests === null) {
      return { success: false, error: 'No quests found' }
    }

    // Trouver la quête par ID
    const quest = dailyQuests.quests.find(q => q.questId === questId)

    if (quest === undefined) {
      return { success: false, error: 'Quest not found' }
    }

    if (!quest.completed) {
      return { success: false, error: 'Quest not completed yet' }
    }

    if (quest.claimed) {
      return { success: false, error: 'Reward already claimed' }
    }

    // Récupérer le template pour la récompense
    const template = getQuestTemplateById(quest.questId)
    if (template === undefined) {
      return { success: false, error: 'Quest template not found' }
    }

    const { user } = session

    // Ajouter les Koins au wallet
    const wallet = await Wallet.findOne({ ownerId: user.id }).exec()
    if (wallet === null) {
      return { success: false, error: 'Wallet not found' }
    }

    const currentBalance = wallet.balance as number
    wallet.balance = currentBalance + template.reward
    await wallet.save()

    // Marquer comme réclamée
    quest.claimed = true
    quest.claimedAt = new Date()
    await dailyQuests.save()

    revalidatePath('/app')
    revalidatePath('/app/wallet')

    return { success: true, reward: template.reward }
  } catch (error) {
    console.error('Error claiming quest reward:', error)
    return { success: false, error: 'Internal error' }
  }
}

/**
 * Renouvelle les quêtes journalières pour un utilisateur
 *
 * Responsabilité unique : générer de nouvelles quêtes pour un nouveau jour
 * (Appelé par le cron job à minuit)
 *
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<boolean>} Succès ou échec
 */
export async function renewDailyQuests (userId: string): Promise<boolean> {
  try {
    await connectMongooseToDatabase()

    const today = new Date().toISOString().split('T')[0]

    // Vérifier si les quêtes existent déjà pour aujourd'hui
    const existing = await DailyQuestsModel.findOne({ userId, date: today })
    if (existing !== null) {
      return true // Déjà créées
    }

    // Créer de nouvelles quêtes aléatoires
    const randomQuests = getRandomQuests(3)
    await DailyQuestsModel.create({
      userId,
      date: today,
      quests: randomQuests.map(template => ({
        questId: template.id,
        current: 0,
        target: template.target,
        completed: false,
        claimed: false
      }))
    })

    return true
  } catch (error) {
    console.error('Error renewing daily quests:', error)
    return false
  }
}

/**
 * Renouvelle les quêtes pour tous les utilisateurs
 *
 * Responsabilité unique : orchestrer le renouvellement global
 * (Appelé par le cron job)
 *
 * @returns {Promise<{ success: boolean, count: number }>}
 */
export async function renewAllDailyQuests (): Promise<{ success: boolean, count: number }> {
  try {
    await connectMongooseToDatabase()

    // Récupérer tous les utilisateurs ayant déjà eu des quêtes
    const userIds = await DailyQuestsModel.distinct('userId')

    let count = 0
    for (const userId of userIds) {
      const success = await renewDailyQuests(userId.toString())
      if (success) count++
    }

    return { success: true, count }
  } catch (error) {
    console.error('Error renewing all daily quests:', error)
    return { success: false, count: 0 }
  }
}
