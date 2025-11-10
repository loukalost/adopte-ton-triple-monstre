import type React from 'react'

interface AnimatedEmojiProps {
  emoji: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  animation?: string
  className?: string
}

const sizeMap = {
  sm: 'text-4xl',
  md: 'text-6xl',
  lg: 'text-8xl',
  xl: 'text-9xl',
  '2xl': 'text-[10rem]'
}

/**
 * Composant emoji animé réutilisable
 * Principe SRP: Responsabilité unique d'affichage d'un emoji animé
 * Principe OCP: Ouvert à l'extension via props et className
 */
export function AnimatedEmoji ({
  emoji,
  size = 'lg',
  animation = 'animate-float',
  className = ''
}: AnimatedEmojiProps): React.ReactElement {
  return (
    <div className={`${sizeMap[size]} ${animation} ${className}`}>
      {emoji}
    </div>
  )
}
