/**
 * Modèle MongoDB pour les accessoires
 * Respecte DIP: Dépend d'abstractions (types) plutôt que d'implémentations
 */

import clientPromise from '@/db'
import type { OwnedAccessory, AccessoryCategory } from '@/types/accessories'
import { ObjectId } from 'mongodb'

/**
 * Obtenir tous les accessoires d'un utilisateur
 */
export async function getUserAccessories (userId: string): Promise<OwnedAccessory[]> {
  const client = await clientPromise
  const db = client.db()

  const accessories = await db.collection<Omit<OwnedAccessory, '_id'> & { _id: ObjectId }>('accessories')
    .find({ ownerId: userId })
    .toArray()

  return accessories.map(acc => ({
    ...acc,
    _id: acc._id.toString()
  }))
}

/**
 * Obtenir tous les accessoires équipés sur un monstre
 */
export async function getMonsterAccessories (monsterId: string): Promise<OwnedAccessory[]> {
  const client = await clientPromise
  const db = client.db()

  const accessories = await db.collection<Omit<OwnedAccessory, '_id'> & { _id: ObjectId }>('accessories')
    .find({ equippedOnMonsterId: monsterId })
    .toArray()

  return accessories.map(acc => ({
    ...acc,
    _id: acc._id.toString()
  }))
}

/**
 * Acheter un accessoire (créer un OwnedAccessory)
 */
export async function purchaseAccessory (
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

/**
 * Équiper un accessoire sur un monstre
 * Déséquipe automatiquement les autres accessoires de la même catégorie
 */
export async function equipAccessory (
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
      accessoryId: { $regex: `^${category}-` } // Pattern matching par catégorie
    },
    { $set: { equippedOnMonsterId: null } }
  )

  // Équiper le nouvel accessoire
  await db.collection('accessories').updateOne(
    { _id: new ObjectId(accessoryDbId) },
    { $set: { equippedOnMonsterId: monsterId } }
  )
}

/**
 * Retirer un accessoire (déséquiper)
 */
export async function unequipAccessory (accessoryDbId: string): Promise<void> {
  const client = await clientPromise
  const db = client.db()

  await db.collection('accessories').updateOne(
    { _id: new ObjectId(accessoryDbId) },
    { $set: { equippedOnMonsterId: null } }
  )
}

/**
 * Vérifier si un utilisateur possède déjà un accessoire
 */
export async function userOwnsAccessory (
  userId: string,
  accessoryId: string
): Promise<boolean> {
  const client = await clientPromise
  const db = client.db()

  const count = await db.collection('accessories').countDocuments({
    ownerId: userId,
    accessoryId
  })

  return count > 0
}
