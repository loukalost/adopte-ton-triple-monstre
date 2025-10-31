'use server'

import { authClient } from '@/lib/auth-client'

export async function createMonster (monsterData: unknown): Promise<void> {
  const { data: session } = await authClient.getSession()
  if (session === null || session === undefined) throw new Error('User not authenticated')

  console.log(session)
}
