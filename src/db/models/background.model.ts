/**
 * Modèle MongoDB pour la gestion des arrière-plans possédés
 * Respecte SRP: Uniquement responsable de la persistance des arrière-plans
 * Respecte DIP: Expose des abstractions, cache les détails MongoDB
 */

import { type Collection } from 'mongodb'
import clientPromise from '@/db'
import type { OwnedBackgroundDb } from '@/types/backgrounds'

/**
 * Obtenir la collection des arrière-plans possédés
 */
async function getBackgroundsCollection (): Promise<Collection<OwnedBackgroundDb>> {
  const client = await clientPromise
  const db = client.db()
  return db.collection<OwnedBackgroundDb>('backgrounds')
}

/**
 * Récupérer tous les arrière-plans possédés par un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Liste des arrière-plans possédés
 */
export async function getUserBackgrounds (userId: string): Promise<OwnedBackgroundDb[]> {
  try {
    const collection = await getBackgroundsCollection()
    const backgrounds = await collection
      .find({ userId })
      .sort({ purchasedAt: -1 }) // Plus récents en premier
      .toArray()

    return backgrounds
  } catch (error) {
    console.error('Error fetching user backgrounds:', error)
    return []
  }
}

/**
 * Vérifier si un utilisateur possède un arrière-plan spécifique
 * @param userId - ID de l'utilisateur
 * @param backgroundId - ID de l'arrière-plan
 * @returns true si l'utilisateur possède l'arrière-plan
 */
export async function hasBackground (userId: string, backgroundId: string): Promise<boolean> {
  try {
    const collection = await getBackgroundsCollection()
    const background = await collection.findOne({ userId, backgroundId })
    return background !== null
  } catch (error) {
    console.error('Error checking background ownership:', error)
    return false
  }
}

/**
 * Ajouter un arrière-plan à la collection d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @param backgroundId - ID de l'arrière-plan à ajouter
 * @returns L'arrière-plan ajouté ou null en cas d'erreur
 */
export async function purchaseBackground (
  userId: string,
  backgroundId: string
): Promise<OwnedBackgroundDb | null> {
  try {
    // Vérifier si l'utilisateur possède déjà cet arrière-plan
    const alreadyOwned = await hasBackground(userId, backgroundId)
    if (alreadyOwned) {
      console.warn(`User ${userId} already owns background ${backgroundId}`)
      return null
    }

    const collection = await getBackgroundsCollection()
    const newBackground: Omit<OwnedBackgroundDb, '_id'> = {
      userId,
      backgroundId,
      purchasedAt: new Date()
    }

    const result = await collection.insertOne(newBackground as OwnedBackgroundDb)

    if (result.acknowledged) {
      return {
        _id: result.insertedId,
        ...newBackground
      }
    }

    return null
  } catch (error) {
    console.error('Error purchasing background:', error)
    return null
  }
}

/**
 * Supprimer un arrière-plan de la collection d'un utilisateur
 * Utilisé principalement pour les tests ou la gestion administrative
 * @param userId - ID de l'utilisateur
 * @param backgroundId - ID de l'arrière-plan à supprimer
 * @returns true si la suppression a réussi
 */
export async function removeUserBackground (
  userId: string,
  backgroundId: string
): Promise<boolean> {
  try {
    const collection = await getBackgroundsCollection()
    const result = await collection.deleteOne({ userId, backgroundId })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error removing background:', error)
    return false
  }
}

/**
 * Obtenir un arrière-plan possédé spécifique
 * @param userId - ID de l'utilisateur
 * @param backgroundId - ID de l'arrière-plan
 * @returns L'arrière-plan possédé ou null
 */
export async function getOwnedBackground (
  userId: string,
  backgroundId: string
): Promise<OwnedBackgroundDb | null> {
  try {
    const collection = await getBackgroundsCollection()
    const background = await collection.findOne({ userId, backgroundId })
    return background
  } catch (error) {
    console.error('Error fetching owned background:', error)
    return null
  }
}

/**
 * Compter le nombre d'arrière-plans possédés par un utilisateur
 * @param userId - ID de l'utilisateur
 * @returns Nombre d'arrière-plans
 */
export async function countUserBackgrounds (userId: string): Promise<number> {
  try {
    const collection = await getBackgroundsCollection()
    const count = await collection.countDocuments({ userId })
    return count
  } catch (error) {
    console.error('Error counting backgrounds:', error)
    return 0
  }
}

/**
 * Récupérer les arrière-plans possédés avec pagination
 * Utile pour de grandes collections
 * @param userId - ID de l'utilisateur
 * @param limit - Nombre d'arrière-plans par page
 * @param skip - Nombre d'arrière-plans à sauter
 * @returns Liste paginée des arrière-plans
 */
export async function getUserBackgroundsPaginated (
  userId: string,
  limit: number = 20,
  skip: number = 0
): Promise<OwnedBackgroundDb[]> {
  try {
    const collection = await getBackgroundsCollection()
    const backgrounds = await collection
      .find({ userId })
      .sort({ purchasedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return backgrounds
  } catch (error) {
    console.error('Error fetching paginated backgrounds:', error)
    return []
  }
}
