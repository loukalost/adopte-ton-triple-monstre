'use client'

import { useEffect, useState, useCallback } from 'react'

/**
 * Props pour le composant LevelUpAnimation
 */
interface LevelUpAnimationProps {
  /** Nouveau niveau atteint */
  newLevel: number
  /** Si true, affiche l'animation */
  show: boolean
  /** Callback appelé quand l'animation se termine */
  onComplete?: () => void
}

/**
 * Animation de passage de niveau (Level Up)
 *
 * Responsabilité unique : afficher une animation spectaculaire
 * lorsque le monstre passe au niveau supérieur.
 *
 * Fonctionnalités :
 * - Modal full-screen avec overlay
 * - Animation de texte "LEVEL UP!" avec effets
 * - Confettis et particules d'étoiles
 * - Affichage du nouveau niveau
 * - Auto-fermeture après 3 secondes
 *
 * @param {LevelUpAnimationProps} props - Props du composant
 * @returns {React.ReactNode | null} Modal d'animation ou null si non affiché
 *
 * @example
 * <LevelUpAnimation
 *   newLevel={6}
 *   show={true}
 *   onComplete={() => console.log('Animation terminée')}
 * />
 */
export function LevelUpAnimation ({
  newLevel,
  show,
  onComplete
}: LevelUpAnimationProps): React.ReactNode | null {
  const [isVisible, setIsVisible] = useState(false)

  // Fonction pour fermer l'animation
  const handleClose = useCallback((): void => {
    setIsVisible(false)
    if (onComplete !== undefined) {
      onComplete()
    }
  }, [onComplete])

  useEffect(() => {
    if (show) {
      setIsVisible(true)

      // Auto-fermeture après 3 secondes
      const timer = setTimeout(() => {
        handleClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, handleClose])

  if (!isVisible) return null

  // Génération de confettis aléatoires
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    color: ['#fe7d6b', '#5da499', '#ab9bea', '#ffe66d'][Math.floor(Math.random() * 4)]
  }))

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Overlay avec effet - cliquable pour fermer */}
      <div
        className='absolute inset-0 bg-[color:var(--color-neon-purple-100)]/80 cursor-pointer'
        onClick={handleClose}
        role='button'
        tabIndex={0}
        aria-label='Fermer'
      />

      {/* Confettis */}
      {confetti.map((item) => (
        <div
          key={item.id}
          className='absolute w-2 h-2 animate-confetti-fall pointer-events-none'
          style={{
            left: item.left,
            top: '-20px',
            backgroundColor: item.color,
            animationDelay: item.delay
          }}
        />
      ))}

      {/* Contenu principal */}
      <div className='relative z-10 text-center pointer-events-auto'>
        {/* Bouton de fermeture */}
        <button
          onClick={handleClose}
          className='absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer border-2 border-[color:var(--color-electric-400)]'
          aria-label='Fermer'
          type='button'
        >
          ✕
        </button>

        {/* Étoile principale */}
        <div className='flex justify-center mb-6'>
          <div className='relative'>
            <span className='text-6xl animate-star-burst'>⭐</span>
            {/* Étoiles secondaires */}
            <span className='absolute -top-3 -left-3 text-2xl animate-star-burst' style={{ animationDelay: '0.1s' }}>✨</span>
            <span className='absolute -top-3 -right-3 text-2xl animate-star-burst' style={{ animationDelay: '0.2s' }}>✨</span>
            <span className='absolute -bottom-3 -left-4 text-xl animate-star-burst' style={{ animationDelay: '0.15s' }}>💫</span>
            <span className='absolute -bottom-3 -right-4 text-xl animate-star-burst' style={{ animationDelay: '0.25s' }}>💫</span>
          </div>
        </div>

        {/* Texte "LEVEL UP!" */}
        <div className='mb-4 animate-level-up-scale'>
          <h1 className='text-4xl font-bold text-[color:var(--color-electric-600)] drop-shadow-lg'>
            LEVEL UP!
          </h1>
        </div>

        {/* Nouveau niveau */}
        <div className='animate-level-up-scale' style={{ animationDelay: '0.2s' }}>
          <div className='bg-white/95 backdrop-blur-sm rounded-lg px-8 py-4 shadow-lg border-2 border-[color:var(--color-electric-400)] inline-block'>
            <p className='text-neutral-600 text-sm font-medium mb-1'>Nouveau niveau</p>
            <p className='text-4xl font-bold text-[color:var(--color-electric-600)]'>
              {newLevel}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
