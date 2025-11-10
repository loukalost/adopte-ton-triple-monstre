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
        relative overflow-hidden rounded-3xl 
        bg-gradient-to-br from-white to-purple-100 
        p-6 shadow-xl ring-4 ring-white/50 
        ${hover ? 'transform hover:scale-105 transition-transform duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
