import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'

/**
 * Endpoint de migration pour ajouter les champs XP aux monstres existants
 *
 * Cette API met à jour TOUS les monstres de la base de données qui n'ont pas
 * les champs xp et maxXp et les initialise avec les valeurs par défaut.
 *
 * À utiliser une seule fois après l'ajout du système d'XP.
 * ATTENTION : Cette route met à jour tous les monstres sans restriction.
 */
export async function POST (): Promise<Response> {
  try {
    await connectMongooseToDatabase()

    // Récupérer TOUS les monstres de la base de données
    const monsters = await Monster.find({}).exec()

    let updatedCount = 0

    // Mettre à jour chaque monstre sans champs XP
    for (const monster of monsters) {
      let needsUpdate = false

      if (monster.xp === undefined || monster.xp === null) {
        monster.xp = 0
        needsUpdate = true
      }

      if (monster.maxXp === undefined || monster.maxXp === null) {
        monster.maxXp = (monster.level ?? 1) * 100
        needsUpdate = true
      }

      if (needsUpdate) {
        monster.markModified('xp')
        monster.markModified('maxXp')
        await monster.save()
        updatedCount++
      }
    }

    return Response.json({
      success: true,
      message: `${updatedCount} monstre(s) mis à jour avec succès`,
      updatedCount
    })
  } catch (error) {
    console.error('Erreur lors de la migration des monstres :', error)
    return new Response('Erreur lors de la migration', { status: 500 })
  }
}
