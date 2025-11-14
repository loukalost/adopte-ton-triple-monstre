'use client'

import { useEffect, useState } from 'react'

/**
 * Props pour le composant QuestCompletionToast
 */
interface QuestCompletionToastProps {
  /** Récompense gagnée */
  reward: number
  /** Callback quand le toast est fermé */
  onClose: () => void
}

/**
 * Composant de notification pour la complétion de quête
 *
 * Responsabilité unique : afficher une notification animée de complétion de quête
 *
 * @param {QuestCompletionToastProps} props - Props du composant
 * @returns {React.ReactNode} Toast de notification
 */
export function QuestCompletionToast ({ reward, onClose }: QuestCompletionToastProps): React.ReactNode {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Auto-fermeture après 4 secondes
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Laisser le temps à l'animation de sortie
    }, 4000)

    return () => {
      clearTimeout(timer)
    }
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className='bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-green-400 min-w-[320px]'>
        <div className='flex items-center gap-3'>
          <span className='text-3xl' aria-hidden='true'>🎉</span>
          <div className='flex-1'>
            <h3 className='text-lg font-bold'>Quête complétée !</h3>
            <p className='text-sm text-green-100 mt-1'>
              +{reward} Koins gagnés
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className='text-white/80 hover:text-white transition-colors'
            aria-label='Fermer'
          >
            <span className='text-xl'>✕</span>
          </button>
        </div>
      </div>
    </div>
  )
}
