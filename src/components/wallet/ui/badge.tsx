import type React from 'react'

interface BadgeProps {
  text: string
  gradient: string
  isPopular?: boolean
}

/**
 * Composant badge réutilisable
 * Principe SRP: Responsabilité unique d'affichage d'un badge
 * Principe LSP: Peut être remplacé par n'importe quelle variante de badge
 */
export function Badge ({ text, gradient, isPopular = false }: BadgeProps): React.ReactElement {
  if (isPopular) {
    return (
      <div className='absolute -top-6 -right-6 z-20'>
        <div className={`bg-gradient-to-r ${gradient} text-white font-black text-sm px-6 py-2 rounded-full shadow-xl ring-4 ring-white transform rotate-12 animate-bounce`}>
          ⭐ {text} ⭐
        </div>
      </div>
    )
  }

  return (
    <div className='absolute top-4 right-4 z-10'>
      <div className={`bg-gradient-to-r ${gradient} text-white font-black text-xs px-4 py-2 rounded-full shadow-lg`}>
        {text}
      </div>
    </div>
  )
}
