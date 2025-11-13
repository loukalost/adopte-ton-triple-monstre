'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import type { DBMonster } from '@/types/monster'

/**
 * Récupère tous les monstres publics pour la galerie
 *
 * Cette server action :
 * 1. Se connecte à la base de données
 * 2. Récupère tous les monstres avec isPublic = true
 * 3. Trie par date de création (plus récents en premier)
 * 4. Retourne un tableau vide en cas d'erreur (résilience)
 *
 * Responsabilité unique : récupérer la liste des monstres publics
 * depuis la base de données pour affichage dans la galerie.
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement la récupération des monstres publics
 * - OCP : Extensible (peut être étendu pour ajouter des filtres)
 * - DIP : Dépend de l'abstraction Monster (modèle Mongoose)
 *
 * @async
 * @returns {Promise<DBMonster[]>} Liste des monstres publics ou tableau vide en cas d'erreur
 *
 * @example
 * const publicMonsters = await getPublicMonsters()
 * // [{ _id: "...", name: "Pikachu", isPublic: true, ... }, ...]
 */
export async function getPublicMonsters (): Promise<DBMonster[]> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Récupération des monstres publics, triés par date de création (plus récents en premier)
    const monsters = await Monster.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .exec()

    // Sérialisation JSON pour éviter les problèmes de typage Next.js
    return JSON.parse(JSON.stringify(monsters))
  } catch (error) {
    console.error('Error fetching public monsters:', error)
    return []
  }
}
