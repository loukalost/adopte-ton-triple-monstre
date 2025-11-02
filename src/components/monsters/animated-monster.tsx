'use client'

import { PixelMonster } from '@/components/monsters/pixel-monster'
import type { MonsterTraits, MonsterState } from '@/types/monster'

type MonsterAction = 'feed' | 'comfort' | 'hug' | 'wake' | null

interface AnimatedMonsterProps {
  state: MonsterState
  traits: MonsterTraits
  level: number
  currentAction: MonsterAction
}

export function AnimatedMonster ({
  state,
  traits,
  level,
  currentAction
}: AnimatedMonsterProps): React.ReactNode {
  return (
    <div className='relative overflow-visible'>
      <PixelMonster
        state={state}
        traits={traits}
        level={level}
        currentAction={currentAction}
      />
    </div>
  )
}
