import type React from 'react'
import Button from '@/components/button'

interface ErrorModalContentProps {
  onClose: () => void
}

/**
 * Composant contenu du modal d'erreur
 * Principe SRP: Responsabilité unique d'affichage du contenu d'erreur
 */
export function ErrorModalContent ({ onClose }: ErrorModalContentProps): React.ReactElement {
  return (
    <div className='relative overflow-hidden rounded-lg bg-[color:var(--color-neutral-50)] p-6 shadow-xl border-2 border-[color:var(--color-electric-400)]'>
      {/* Contenu */}
      <div className='relative'>
        {/* Emoji principal */}
        <div className='text-center mb-4'>
          <div className='text-6xl'>
            😢
          </div>
        </div>

        {/* Titre */}
        <h2 className='text-2xl font-bold text-center mb-3 text-[color:var(--color-electric-600)]'>
          Oups !
        </h2>

        {/* Message */}
        <p className='text-base font-medium text-center text-[color:var(--color-neutral-700)] mb-4'>
          Une erreur s'est produite... 💔
        </p>

        {/* Détails */}
        <div className='bg-[color:var(--color-electric-50)] rounded-lg p-4 mb-4 border border-[color:var(--color-electric-200)]'>
          <div className='flex flex-col items-center gap-2 text-sm font-medium text-[color:var(--color-neutral-700)]'>
            <div className='flex items-center gap-2'>
              <span>🔧</span>
              <span>Le paiement n'a pas pu être traité</span>
              <span>🔧</span>
            </div>
            <p className='text-xs text-[color:var(--color-neutral-600)]'>
              Pas d'inquiétude, tu n'as pas été débité !
            </p>
          </div>
        </div>

        {/* Boutons */}
        <div className='space-y-2'>
          <Button
            onClick={onClose}
            variant='primary'
            size='lg'
          >
            <span className='mr-1'>🔄</span>
            <span>Réessayer</span>
            <span className='ml-1'>💪</span>
          </Button>

          <button
            onClick={onClose}
            className='w-full text-[color:var(--color-neutral-600)] hover:text-[color:var(--color-neutral-800)] font-medium text-sm py-2 transition-colors duration-200'
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
