import type React from 'react'

interface GradientButtonProps {
  onClick: () => void
  disabled?: boolean
  gradient: string
  children: React.ReactNode
  className?: string
}

/**
 * Composant bouton avec dégradé réutilisable
 * Principe SRP: Responsabilité unique d'affichage d'un bouton avec dégradé
 * Principe OCP: Ouvert à l'extension via className et children
 */
export function GradientButton ({
  onClick,
  disabled = false,
  gradient,
  children,
  className = ''
}: GradientButtonProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative overflow-hidden w-full 
        bg-gradient-to-r ${gradient} 
        hover:brightness-110 text-white font-black text-xl 
        py-5 px-6 rounded-2xl 
        transition-all duration-300 transform hover:scale-110 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none 
        shadow-2xl ring-4 ring-white/50 active:scale-105
        ${className}
      `}
    >
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shine' />
      <span className='relative flex items-center justify-center gap-3'>
        {children}
      </span>
    </button>
  )
}
