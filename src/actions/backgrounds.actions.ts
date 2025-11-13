/**
 * Server Actions pour la gestion des arrière-plans
 * Respecte SRP: Chaque action a une responsabilité unique
 * Respecte DIP: Dépend des abstractions (models, types)
 */

'use server'

import { connectMongooseToDatabase } from '@/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
  getUserBackgrounds,
  hasBackground,
  purchaseBackground as purchaseBackgroundDb
} from '@/db/models/background.model'
import Wallet from '@/db/models/wallet.model'
import Monster from '@/db/models/monster.model'
import { getBackgroundById, getBackgroundPrice } from '@/config/backgrounds.config'
import type { OwnedBackground } from '@/types/backgrounds'

/**
 * Type de retour standardisé pour les actions
 */
interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Récupérer les arrière-plans possédés par l'utilisateur connecté
 */
export async function getUserOwnedBackgrounds (): Promise<ActionResult<OwnedBackground[]>> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      return { success: false, error: 'Non authentifié' }
    }

    const { user } = session
    const backgrounds = await getUserBackgrounds(user.id)
    return { success: true, data: backgrounds }
  } catch (error) {
    console.error('Error getting user backgrounds:', error)
    return { success: false, error: 'Erreur lors de la récupération des arrière-plans' }
  }
}

/**
 * Acheter un arrière-plan
 * Vérifie que l'utilisateur a suffisamment de Koins et ne possède pas déjà l'arrière-plan
 */
export async function purchaseBackground (backgroundId: string): Promise<ActionResult<OwnedBackground>> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      return { success: false, error: 'Non authentifié' }
    }

    const { user } = session

    // Vérifier que l'arrière-plan existe
    const background = getBackgroundById(backgroundId)
    if (background === null) {
      return { success: false, error: 'Arrière-plan introuvable' }
    }

    // Vérifier que l'utilisateur ne possède pas déjà cet arrière-plan
    const alreadyOwned = await hasBackground(user.id, backgroundId)
    if (alreadyOwned) {
      return { success: false, error: 'Vous possédez déjà cet arrière-plan' }
    }

    // Calculer le prix
    const price = getBackgroundPrice(background)

    // Vérifier le solde de Koins
    let wallet = await Wallet.findOne({ ownerId: user.id }).exec()

    if (wallet === null || wallet === undefined) {
      wallet = new Wallet({
        ownerId: user.id,
        balance: 100
      })
      await wallet.save()
    }

    if (wallet.balance < price) {
      return {
        success: false,
        error: `Koins insuffisants. Requis: ${String(price)}, Disponibles: ${String(wallet.balance)}`
      }
    }

    // Débiter les Koins
    wallet.balance -= price
    await wallet.save()

    // Ajouter l'arrière-plan à la collection
    const ownedBackground = await purchaseBackgroundDb(user.id, backgroundId)
    if (ownedBackground === null) {
      // Rembourser l'utilisateur en cas d'erreur
      wallet.balance += price
      await wallet.save()
      return { success: false, error: 'Erreur lors de l\'achat de l\'arrière-plan' }
    }

    return {
      success: true,
      data: ownedBackground
    }
  } catch (error) {
    console.error('Error purchasing background:', error)
    return { success: false, error: 'Erreur lors de l\'achat' }
  }
}

/**
 * Appliquer un arrière-plan à un monstre
 * Vérifie que l'utilisateur possède l'arrière-plan et le monstre
 */
export async function applyBackgroundToMonster (
  monsterId: string,
  backgroundId: string
): Promise<ActionResult<boolean>> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      return { success: false, error: 'Non authentifié' }
    }

    const { user } = session

    // Vérifier que l'arrière-plan existe dans le catalogue
    const background = getBackgroundById(backgroundId)
    if (background === null) {
      return { success: false, error: 'Arrière-plan introuvable' }
    }

    // Vérifier que l'utilisateur possède cet arrière-plan
    const owned = await hasBackground(user.id, backgroundId)
    if (!owned) {
      return { success: false, error: 'Vous ne possédez pas cet arrière-plan' }
    }

    // Vérifier que le monstre existe et appartient à l'utilisateur
    const monster = await Monster.findById(monsterId).exec()
    if (monster === null || monster === undefined) {
      return { success: false, error: 'Monstre introuvable' }
    }
    if (String(monster.ownerId) !== user.id) {
      return { success: false, error: 'Ce monstre ne vous appartient pas' }
    }

    // Appliquer l'arrière-plan au monstre
    monster.backgroundId = backgroundId
    await monster.save()

    return { success: true, data: true }
  } catch (error) {
    console.error('Error applying background to monster:', error)
    return { success: false, error: 'Erreur lors de l\'application' }
  }
}

/**
 * Retirer l'arrière-plan d'un monstre
 * Réinitialise le backgroundId à undefined
 */
export async function removeBackgroundFromMonster (monsterId: string): Promise<ActionResult<boolean>> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      return { success: false, error: 'Non authentifié' }
    }

    const { user } = session

    // Vérifier que le monstre existe et appartient à l'utilisateur
    const monster = await Monster.findById(monsterId).exec()
    if (monster === null || monster === undefined) {
      return { success: false, error: 'Monstre introuvable' }
    }
    if (String(monster.ownerId) !== user.id) {
      return { success: false, error: 'Ce monstre ne vous appartient pas' }
    }

    // Retirer l'arrière-plan
    monster.backgroundId = undefined
    await monster.save()

    return { success: true, data: true }
  } catch (error) {
    console.error('Error removing background from monster:', error)
    return { success: false, error: 'Erreur lors du retrait' }
  }
}

/**
 * Vérifier si l'utilisateur possède un arrière-plan spécifique
 */
export async function checkBackgroundOwnership (backgroundId: string): Promise<ActionResult<boolean>> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      return { success: false, error: 'Non authentifié' }
    }

    const { user } = session
    const owned = await hasBackground(user.id, backgroundId)
    return { success: true, data: owned }
  } catch (error) {
    console.error('Error checking background ownership:', error)
    return { success: false, error: 'Erreur lors de la vérification' }
  }
}
