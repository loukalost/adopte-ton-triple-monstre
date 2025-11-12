/**
 * Badge de rareté pour accessoires
 * Respecte la charte graphique avec electric/neon-purple/neutral
 */

'use client'

import { getRarityConfig } from '@/lib/utils/rarity.utils'
import type { Rarity } from '@/types/accessories'

interface RarityBadgeProps {
  rarity: Rarity
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

export function RarityBadge ({
  rarity,
  size = 'md',
  showName = true
}: RarityBadgeProps): React.ReactNode {
  const config = getRarityConfig(rarity)

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div
      className={`
        inline-flex items-center gap-1 rounded-full
        text-white font-bold
        shadow-lg
        ${sizeClasses[size]}
      `}
      style={{ backgroundColor: config.color }}
    >
      <span>{config.emoji}</span>
      {showName && <span>{config.name}</span>}
    </div>
  )
}
