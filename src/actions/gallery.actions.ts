'use server'

import { connectMongooseToDatabase, client } from '@/db'
import Monster from '@/db/models/monster.model'
import type { DBMonster } from '@/types/monster'
import { ObjectId } from 'mongodb'

/**
 * Options de filtrage pour la galerie
 */
export interface GalleryFilters {
  /** Niveau minimum */
  minLevel?: number
  /** Niveau maximum */
  maxLevel?: number
  /** État/humeur du monstre */
  state?: string
  /** Limite de résultats */
  limit?: number
  /** Offset pour pagination */
  offset?: number
}

/**
 * Monstre public avec informations du créateur
 */
export interface PublicMonsterWithCreator extends DBMonster {
  /** Nom d'utilisateur du créateur (anonymisé) */
  creatorName?: string
  /** Email du créateur (anonymisé) */
  creatorEmail?: string
}

/**
 * Récupère tous les monstres publics pour la galerie avec filtres
 *
 * Cette server action :
 * 1. Se connecte à la base de données
 * 2. Récupère tous les monstres avec isPublic = true
 * 3. Applique les filtres demandés
 * 4. Enrichit avec les informations du créateur (anonymisées)
 * 5. Trie par date de création (plus récents en premier)
 * 6. Retourne un tableau vide en cas d'erreur (résilience)
 *
 * Responsabilité unique : récupérer la liste des monstres publics
 * depuis la base de données pour affichage dans la galerie.
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement la récupération des monstres publics
 * - OCP : Extensible via les filtres
 * - DIP : Dépend de l'abstraction Monster (modèle Mongoose)
 *
 * @async
 * @param {GalleryFilters} filters - Filtres optionnels
 * @returns {Promise<PublicMonsterWithCreator[]>} Liste des monstres publics ou tableau vide en cas d'erreur
 *
 * @example
 * const publicMonsters = await getPublicMonsters({ minLevel: 5, limit: 20 })
 * // [{ _id: "...", name: "Pikachu", isPublic: true, creatorName: "User***", ... }, ...]
 */
export async function getPublicMonsters (filters: GalleryFilters = {}): Promise<PublicMonsterWithCreator[]> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Construction de la requête avec filtres
    const query: any = { isPublic: true }

    // Filtre par niveau
    if (filters.minLevel !== undefined || filters.maxLevel !== undefined) {
      query.level = {}
      if (filters.minLevel !== undefined) {
        query.level.$gte = filters.minLevel
      }
      if (filters.maxLevel !== undefined) {
        query.level.$lte = filters.maxLevel
      }
    }

    // Filtre par état
    if (filters.state !== undefined && filters.state !== '') {
      query.state = filters.state
    }

    // Récupération des monstres publics avec filtres
    let monstersQuery = Monster.find(query)
      .sort({ createdAt: -1 })

    // Pagination
    if (filters.offset !== undefined) {
      monstersQuery = monstersQuery.skip(filters.offset)
    }
    if (filters.limit !== undefined) {
      monstersQuery = monstersQuery.limit(filters.limit)
    }

    const monsters = await monstersQuery.exec()

    // Récupération des informations des créateurs depuis la collection Better Auth
    const ownerIds = [...new Set(monsters.map(m => m.ownerId))]
    const db = client.db(process.env.MONGODB_DATABASE_NAME as string)
    const usersCollection = db.collection('user')

    const users = await usersCollection.find({
      _id: { $in: ownerIds.map(id => new ObjectId(id.toString())) }
    }).toArray()

    // Création d'un map pour accès rapide aux users
    const userMap = new Map(users.map(u => [u._id.toString(), u]))

    // Enrichissement avec les informations du créateur (anonymisées)
    const enrichedMonsters: PublicMonsterWithCreator[] = monsters.map(monster => {
      const owner = userMap.get(monster.ownerId.toString()) as { name?: string, email?: string } | undefined
      const monsterObj = JSON.parse(JSON.stringify(monster)) as PublicMonsterWithCreator

      if (owner !== undefined) {
        // Anonymisation du nom : garde les 4 premiers caractères + ***
        const name = owner.name ?? 'Anonymous'
        monsterObj.creatorName = name.length > 4 ? `${name.substring(0, 4)}***` : name

        // Anonymisation de l'email : garde le début + ***@domain
        const email = owner.email
        if (email !== undefined && email !== null && typeof email === 'string') {
          const emailParts = email.split('@')
          if (emailParts.length === 2) {
            const localPart = emailParts[0]
            const domain = emailParts[1]
            const anonymizedLocal = localPart.length > 3 ? localPart.substring(0, 3) : localPart
            monsterObj.creatorEmail = `${anonymizedLocal}***@${domain}`
          }
        }
      }

      return monsterObj
    })

    return enrichedMonsters
  } catch (error) {
    console.error('Error fetching public monsters:', error)
    return []
  }
}

/**
 * Compte le nombre total de monstres publics (pour pagination)
 *
 * @async
 * @param {GalleryFilters} filters - Mêmes filtres que getPublicMonsters
 * @returns {Promise<number>} Nombre total de monstres publics
 */
export async function countPublicMonsters (filters: GalleryFilters = {}): Promise<number> {
  try {
    await connectMongooseToDatabase()

    const query: any = { isPublic: true }

    if (filters.minLevel !== undefined || filters.maxLevel !== undefined) {
      query.level = {}
      if (filters.minLevel !== undefined) {
        query.level.$gte = filters.minLevel
      }
      if (filters.maxLevel !== undefined) {
        query.level.$lte = filters.maxLevel
      }
    }

    if (filters.state !== undefined && filters.state !== '') {
      query.state = filters.state
    }

    return await Monster.countDocuments(query).exec()
  } catch (error) {
    console.error('Error counting public monsters:', error)
    return 0
  }
}
