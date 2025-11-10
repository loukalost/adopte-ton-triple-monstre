'use server'

import { xpBoosts } from '@/config/shop.config'
import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function buyXpBoost (creatureId: string, boostId: string): Promise<void> {
  console.log(`Achat du boost ${boostId} pour la créature ${creatureId}`)
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }
  const { user } = session

  await connectMongooseToDatabase()

  const monster = await Monster.findOne({ _id: creatureId, ownerId: user.id })

  if (monster === null || monster === undefined) {
    throw new Error('Monster not found')
  }

  const boost = xpBoosts.find((boost) => boost.id === boostId)

  if (boost === undefined || boost === null) {
    throw new Error('Boost not found')
  }

  monster.xp = Number(monster.xp) + Number(boost.xpAmount)
  monster.markModified('xp')
  if (Number(monster.xp) >= Number(monster.maxXp)) {
    monster.level = Number(monster.level) + 1
    monster.maxXp = Number(monster.level) * 100
    monster.markModified('level')
    monster.markModified('maxXp')
    monster.xp = 0
    monster.markModified('xp')
  }
  await monster.save()
  revalidatePath(`/creature/${creatureId}`)
}
