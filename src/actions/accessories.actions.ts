/**
 * Server Actions pour les accessoires
 * Respecte SRP: Chaque action a une responsabilité unique
 */

'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getAccessoryById, getAccessoryPrice } from '@/config/accessories.config'
import {
  getUserAccessories,
  getMonsterAccessories,
  purchaseAccessory as dbPurchaseAccessory,
  equipAccessory as dbEquipAccessory,
  unequipAccessory as dbUnequipAccessory,
  userOwnsAccessory
} from '@/db/models/accessory.model'
import { subtractKoins } from '@/actions/wallet.actions'
import { updateQuestProgress } from '@/actions/quests.actions'
import type { OwnedAccessory } from '@/types/accessories'

/**
 * Acheter un accessoire
 * Débite les Koins et crée un OwnedAccessory
 */
export async function purchaseAccessory (
  accessoryId: string
): Promise<{ success: boolean, error?: string, accessory?: OwnedAccessory }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id === undefined) {
      return { success: false, error: 'Non authentifié' }
    }

    // Vérifier que l'accessoire existe dans le catalogue
    const accessory = getAccessoryById(accessoryId)
    if (accessory === undefined) {
      return { success: false, error: 'Accessoire introuvable' }
    }

    // Vérifier si l'utilisateur possède déjà cet accessoire
    const alreadyOwned = await userOwnsAccessory(session.user.id, accessoryId)
    if (alreadyOwned) {
      return { success: false, error: 'Accessoire déjà possédé' }
    }

    // Calculer le prix avec le multiplicateur de rareté
    const price = getAccessoryPrice(accessory)

    // Débiter les Koins (lance une exception en cas d'erreur)
    try {
      await subtractKoins(price)
    } catch (error) {
      return { success: false, error: 'Pas assez de Koins' }
    }

    // Créer l'accessoire possédé
    const newAccessory = await dbPurchaseAccessory(session.user.id, accessoryId)

    // Mettre à jour la progression de la quête "buy_accessory"
    void updateQuestProgress('buy_accessory', 1)

    // Revalider les paths pertinents
    revalidatePath('/app/wallet')
    revalidatePath('/app')

    return {
      success: true,
      accessory: newAccessory
    }
  } catch (error) {
    console.error('Error purchasing accessory:', error)
    return { success: false, error: 'Erreur lors de l\'achat' }
  }
}

/**
 * Équiper un accessoire sur une créature
 * Déséquipe automatiquement les autres accessoires de la même catégorie
 */
export async function equipAccessory (
  accessoryDbId: string,
  monsterId: string
): Promise<{ success: boolean, error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id === undefined) {
      return { success: false, error: 'Non authentifié' }
    }

    // Vérifier que l'accessoire appartient à l'utilisateur
    const userAccessories = await getUserAccessories(session.user.id)
    const ownedAccessory = userAccessories.find(acc => acc._id === accessoryDbId)

    if (ownedAccessory === undefined) {
      return { success: false, error: 'Accessoire introuvable' }
    }

    // Récupérer la catégorie depuis le catalogue
    const accessoryInfo = getAccessoryById(ownedAccessory.accessoryId)
    if (accessoryInfo === undefined) {
      return { success: false, error: 'Configuration accessoire introuvable' }
    }

    // Équiper l'accessoire
    await dbEquipAccessory(accessoryDbId, monsterId, accessoryInfo.category)

    // Mettre à jour la progression de la quête "equip_accessory"
    void updateQuestProgress('equip_accessory', 1)

    // Revalider les paths
    revalidatePath(`/app/creatures/${monsterId}`)
    revalidatePath('/app')

    return { success: true }
  } catch (error) {
    console.error('Error equipping accessory:', error)
    return { success: false, error: 'Erreur lors de l\'équipement' }
  }
}

/**
 * Retirer un accessoire d'une créature
 */
export async function unequipAccessory (
  accessoryDbId: string
): Promise<{ success: boolean, error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id === undefined) {
      return { success: false, error: 'Non authentifié' }
    }

    // Vérifier que l'accessoire appartient à l'utilisateur
    const userAccessories = await getUserAccessories(session.user.id)
    const ownedAccessory = userAccessories.find(acc => acc._id === accessoryDbId)

    if (ownedAccessory === undefined) {
      return { success: false, error: 'Accessoire introuvable' }
    }

    // Retirer l'accessoire
    await dbUnequipAccessory(accessoryDbId)

    // Revalider les paths
    if (ownedAccessory.equippedOnMonsterId !== null) {
      revalidatePath(`/app/creatures/${ownedAccessory.equippedOnMonsterId}`)
    }
    revalidatePath('/app')

    return { success: true }
  } catch (error) {
    console.error('Error unequipping accessory:', error)
    return { success: false, error: 'Erreur lors du retrait' }
  }
}

/**
 * Obtenir tous les accessoires de l'utilisateur authentifié
 */
export async function getMyAccessories (): Promise<OwnedAccessory[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user?.id === undefined) {
      return []
    }

    return await getUserAccessories(session.user.id)
  } catch (error) {
    console.error('Error getting user accessories:', error)
    return []
  }
}

/**
 * Obtenir les accessoires équipés sur une créature
 */
export async function getCreatureAccessories (
  monsterId: string
): Promise<OwnedAccessory[]> {
  try {
    return await getMonsterAccessories(monsterId)
  } catch (error) {
    console.error('Error getting creature accessories:', error)
    return []
  }
}
