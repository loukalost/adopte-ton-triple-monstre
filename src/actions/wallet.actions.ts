'use server'

import { connectMongooseToDatabase } from '@/db'
import Wallet from '@/db/models/wallet.model'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

/**
 * Interface représentant un wallet dans la base de données
 */
export interface DBWallet {
  _id: string
  ownerId: string
  balance: number
  createdAt: string
  updatedAt: string
}

/**
 * Récupère ou crée le wallet de l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Cherche le wallet existant de l'utilisateur
 * 3. Si aucun wallet n'existe, en crée un avec un solde initial de 100 Koins
 * 4. Retourne le wallet de l'utilisateur
 *
 * Responsabilité unique : récupérer ou initialiser le wallet
 * de l'utilisateur depuis la base de données.
 *
 * @async
 * @returns {Promise<DBWallet>} Le wallet de l'utilisateur
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * const wallet = await getWallet()
 * // { _id: "...", ownerId: "...", balance: 100, ... }
 */
export async function getWallet (): Promise<DBWallet> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Recherche du wallet existant
    let wallet = await Wallet.findOne({ ownerId: user.id }).exec()

    // Si aucun wallet n'existe, en créer un
    if (wallet === null || wallet === undefined) {
      wallet = new Wallet({
        ownerId: user.id,
        balance: 100 // Solde initial par défaut
      })
      await wallet.save()
    }

    // Sérialisation JSON pour éviter les problèmes de typage Next.js
    return JSON.parse(JSON.stringify(wallet))
  } catch (error) {
    console.error('Error fetching wallet:', error)
    throw error
  }
}

/**
 * Ajoute des Koins au wallet de l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Récupère ou crée le wallet de l'utilisateur
 * 3. Ajoute le montant spécifié au solde
 * 4. Sauvegarde les modifications
 * 5. Revalide le cache de la page wallet
 *
 * Responsabilité unique : augmenter le solde du wallet
 * de l'utilisateur de manière sécurisée.
 *
 * @async
 * @param {number} amount - Montant de Koins à ajouter (doit être positif)
 * @returns {Promise<DBWallet>} Le wallet mis à jour
 * @throws {Error} Si l'utilisateur n'est pas authentifié ou si le montant est invalide
 *
 * @example
 * await addKoins(50)
 * // Le solde augmente de 50 Koins
 */
export async function addKoins (amount: number): Promise<DBWallet> {
  try {
    // Validation du montant
    if (amount <= 0) {
      throw new Error('Amount must be positive')
    }

    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Recherche ou création du wallet
    let wallet = await Wallet.findOne({ ownerId: user.id }).exec()

    if (wallet === null || wallet === undefined) {
      wallet = new Wallet({
        ownerId: user.id,
        balance: amount
      })
    } else {
      // Ajout du montant au solde existant
      wallet.balance = Number(wallet.balance) + Number(amount)
      wallet.markModified('balance')
    }

    await wallet.save()

    // Revalidation du cache pour rafraîchir la page wallet
    revalidatePath('/wallet')

    // Sérialisation JSON pour éviter les problèmes de typage Next.js
    return JSON.parse(JSON.stringify(wallet))
  } catch (error) {
    console.error('Error adding koins:', error)
    throw error
  }
}

/**
 * Retire des Koins du wallet de l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Récupère le wallet de l'utilisateur
 * 3. Vérifie que le solde est suffisant
 * 4. Retire le montant spécifié du solde
 * 5. Sauvegarde les modifications
 * 6. Revalide le cache de la page wallet
 *
 * Responsabilité unique : diminuer le solde du wallet
 * de l'utilisateur de manière sécurisée.
 *
 * @async
 * @param {number} amount - Montant de Koins à retirer (doit être positif)
 * @returns {Promise<DBWallet>} Le wallet mis à jour
 * @throws {Error} Si l'utilisateur n'est pas authentifié, si le montant est invalide,
 *                 ou si le solde est insuffisant
 *
 * @example
 * await subtractKoins(30)
 * // Le solde diminue de 30 Koins
 */
export async function subtractKoins (amount: number): Promise<DBWallet> {
  try {
    // Validation du montant
    if (amount <= 0) {
      throw new Error('Amount must be positive')
    }

    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Recherche du wallet
    const wallet = await Wallet.findOne({ ownerId: user.id }).exec()

    if (wallet === null || wallet === undefined) {
      throw new Error('Wallet not found')
    }

    // Vérification du solde suffisant
    const newBalance = Number(wallet.balance) - Number(amount)
    if (newBalance < 0) {
      throw new Error('Insufficient balance')
    }

    // Retrait du montant
    wallet.balance = newBalance
    wallet.markModified('balance')

    await wallet.save()

    // Revalidation du cache pour rafraîchir la page wallet
    revalidatePath('/wallet')

    // Sérialisation JSON pour éviter les problèmes de typage Next.js
    return JSON.parse(JSON.stringify(wallet))
  } catch (error) {
    console.error('Error subtracting koins:', error)
    throw error
  }
}
