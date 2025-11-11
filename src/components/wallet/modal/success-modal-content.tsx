import type React from 'react'
import Button from '@/components/button'

interface SuccessModalContentProps {
  onClose: () => void
}

/**
 * Composant contenu du modal de succès
 * Principe SRP: Responsabilité unique d'affichage du contenu de succès
 */
export function SuccessModalContent ({ onClose }: SuccessModalContentProps): React.ReactElement {
  return (
    <div className='relative overflow-hidden rounded-lg bg-[color:var(--color-neutral-50)] p-6 shadow-xl border-2 border-[color:var(--color-electric-400)]'>
      {/* Contenu */}
      <div className='relative'>
        {/* Emoji principal */}
        <div className='text-center mb-4'>
          <div className='text-6xl'>
            🎉
          </div>
        </div>

        {/* Titre */}
        <h2 className='text-2xl font-bold text-center mb-3 text-[color:var(--color-electric-600)]'>
          Succès !
        </h2>

        {/* Message */}
        <p className='text-base font-medium text-center text-[color:var(--color-neutral-700)] mb-4'>
          Tes Koins ont été ajoutés ! 🪙✨
        </p>

        {/* Détails */}
        <div className='bg-[color:var(--color-electric-50)] rounded-lg p-4 mb-4 border border-[color:var(--color-electric-200)]'>
          <div className='flex items-center justify-center gap-2 text-sm font-medium text-[color:var(--color-neutral-700)]'>
            <span className='text-xl'>💰</span>
            <span>Ton trésor s'agrandit !</span>
            <span className='text-xl'>🎊</span>
          </div>
        </div>

        {/* Bouton de fermeture */}
        <Button
          onClick={onClose}
          variant='primary'
          size='lg'
        >
          <span className='mr-1'>🎮</span>
          <span>Continuer l'Aventure</span>
          <span className='ml-1'>🚀</span>
        </Button>
      </div>
    </div>
  )
}
