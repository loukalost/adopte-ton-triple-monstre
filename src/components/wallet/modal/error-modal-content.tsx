import type React from 'react'
import { GradientButton } from '../ui/gradient-button'

interface ErrorModalContentProps {
  onClose: () => void
}

/**
 * Composant contenu du modal d'erreur
 * Principe SRP: Responsabilité unique d'affichage du contenu d'erreur
 */
export function ErrorModalContent ({ onClose }: ErrorModalContentProps): React.ReactElement {
  return (
    <div className='relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-red-400 via-orange-400 to-pink-500 p-1 shadow-[0_30px_90px_rgba(0,0,0,0.4)]'>
      {/* Animations de fond */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-300/30 via-orange-300/30 to-pink-300/30 animate-error-pulse' />
      </div>

      {/* Contenu */}
      <div className='relative bg-gradient-to-br from-white via-red-50 to-orange-100 rounded-[2.8rem] p-12'>
        {/* Nuages d'orage décoratifs */}
        <div className='absolute top-8 left-8 text-5xl animate-error-shake'>⛈️</div>
        <div className='absolute top-12 right-12 text-4xl animate-error-shake [animation-delay:0.2s]'>💥</div>
        <div className='absolute bottom-12 left-16 text-4xl animate-error-shake [animation-delay:0.4s]'>⚡</div>

        {/* Emoji principal animé */}
        <div className='text-center mb-8'>
          <div className='inline-block animate-error-wobble'>
            <div className='text-[10rem] leading-none filter drop-shadow-2xl'>
              😢
            </div>
          </div>
        </div>

        {/* Titre */}
        <h2 className='text-6xl font-black text-center mb-4 text-transparent bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text drop-shadow-lg'>
          Oups !
        </h2>

        {/* Message */}
        <p className='text-3xl font-bold text-center text-red-700 mb-8'>
          Une erreur s'est produite... 💔
        </p>

        {/* Détails fun */}
        <div className='bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-6 mb-8 border-4 border-red-300 shadow-xl'>
          <div className='flex flex-col items-center gap-3 text-xl font-bold text-red-800'>
            <div className='flex items-center gap-3'>
              <span className='text-3xl'>🔧</span>
              <span>Le paiement n'a pas pu être traité</span>
              <span className='text-3xl'>🔧</span>
            </div>
            <p className='text-lg text-red-600'>
              Pas d'inquiétude, tu n'as pas été débité !
            </p>
          </div>
        </div>

        {/* Boutons */}
        <div className='space-y-4'>
          <GradientButton
            onClick={onClose}
            gradient='from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
            className='text-2xl py-6 px-8 rounded-3xl'
          >
            <span className='text-3xl'>🔄</span>
            <span>Réessayer</span>
            <span className='text-3xl'>💪</span>
          </GradientButton>

          <button
            onClick={onClose}
            className='w-full text-red-600 hover:text-red-700 font-bold text-lg py-3 transition-colors duration-200'
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
