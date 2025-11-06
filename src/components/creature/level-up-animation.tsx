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
      {/* Overlay avec effet de flash - cliquable pour fermer */}
      <div
        className='absolute inset-0 bg-gradient-to-br from-yellow-300/30 via-purple-400/30 to-pink-400/30 animate-pulse cursor-pointer'
        onClick={handleClose}
        role='button'
        tabIndex={0}
        aria-label='Fermer'
      />

      {/* Confettis */}
      {confetti.map((item) => (
        <div
          key={item.id}
          className='absolute w-3 h-3 animate-confetti-fall pointer-events-none'
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
          className='absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-pointer border-2 border-yellow-400'
          aria-label='Fermer'
          type='button'
        >
          ✕
        </button>

        {/* Étoile principale avec burst */}
        <div className='flex justify-center mb-8'>
          <div className='relative'>
            <span className='text-9xl animate-star-burst'>⭐</span>
            {/* Étoiles secondaires */}
            <span className='absolute -top-4 -left-4 text-4xl animate-star-burst' style={{ animationDelay: '0.1s' }}>✨</span>
            <span className='absolute -top-4 -right-4 text-4xl animate-star-burst' style={{ animationDelay: '0.2s' }}>✨</span>
            <span className='absolute -bottom-4 -left-8 text-3xl animate-star-burst' style={{ animationDelay: '0.15s' }}>💫</span>
            <span className='absolute -bottom-4 -right-8 text-3xl animate-star-burst' style={{ animationDelay: '0.25s' }}>💫</span>
          </div>
        </div>

        {/* Texte "LEVEL UP!" */}
        <div className='mb-6 animate-level-up-scale'>
          <h1 className='text-8xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-transparent bg-clip-text drop-shadow-2xl'>
            LEVEL UP!
          </h1>
        </div>

        {/* Nouveau niveau */}
        <div className='animate-level-up-scale' style={{ animationDelay: '0.2s' }}>
          <div className='bg-white/90 backdrop-blur-sm rounded-3xl px-12 py-6 shadow-2xl border-4 border-yellow-400 inline-block'>
            <p className='text-gray-600 text-xl font-medium mb-2'>Nouveau niveau</p>
            <p className='text-7xl font-bold bg-gradient-to-br from-moccaccino-500 to-lochinvar-500 text-transparent bg-clip-text'>
              {newLevel}
            </p>
          </div>
        </div>

        {/* Rayons de lumière */}
        <div className='absolute inset-0 -z-10'>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='absolute top-1/2 left-1/2 w-2 h-40 bg-gradient-to-t from-yellow-300/50 to-transparent origin-bottom animate-pulse'
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
