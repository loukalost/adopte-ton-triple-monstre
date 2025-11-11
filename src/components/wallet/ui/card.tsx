import type React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

/**
 * Composant carte réutilisable
 * Principe SRP: Responsabilité unique d'affichage d'une carte
 * Principe OCP: Ouvert à l'extension via className et children
 */
export function Card ({ children, className = '', hover = false }: CardProps): React.ReactElement {
  return (
    <div
      className={`
        relative overflow-hidden rounded-lg 
        bg-[color:var(--color-neutral-50)] 
        p-4 shadow-md border border-[color:var(--color-neutral-200)]
        ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
