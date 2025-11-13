import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { type NextRequest } from 'next/server'

const MONSTER_STATES = ['sad', 'angry', 'hungry', 'sleepy']

async function updateMonsterState (monsterId?: string | null): Promise<void> {
  const randomState = MONSTER_STATES[Math.floor(Math.random() * MONSTER_STATES.length)]

  await connectMongooseToDatabase()
  await Monster.updateOne(
    { _id: monsterId },
    { state: randomState }
  ).orFail()
}

export async function GET (request: NextRequest): Promise<Response> {
  const id = request.nextUrl.searchParams.get('id')
  try {
    await updateMonsterState(id)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'état du monstre :', error)
    return new Response('Failed to update monster state', { status: 500 })
  }
  return new Response('Monster state updated')
}
