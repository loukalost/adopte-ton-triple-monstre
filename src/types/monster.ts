export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const

export type MonsterState = typeof MONSTER_STATES[number]

export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]
