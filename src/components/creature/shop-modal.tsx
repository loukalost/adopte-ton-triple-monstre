'use client'

import type React from 'react'
import { useEffect } from 'react'

interface ShopModalProps {
  /** Fonction pour fermer le modal */
  onClose: () => void
  /** Nom de la créature */
  creatureName: string
}

/**
 * Modal de la boutique pour la créature
 *
 * Responsabilité unique : afficher le modal de la boutique avec son contenu
 * Pour l'instant, affiche une div d'exemple pour tester
 *
 * @param {ShopModalProps} props - Props du composant
 * @returns {React.ReactElement} Modal de la boutique
 */
export function ShopModal ({ onClose, creatureName }: ShopModalProps): React.ReactElement {
  // Fermeture du modal avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Fermeture du modal en cliquant sur le backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // if (e.target === e.currentTarget) {
    onClose()
    // }
  }

  return (
    <div
      className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fade-in'
      onClick={handleBackdropClick}
    >
      <div className='fixed inset-0 z-[70] flex items-center justify-center p-4'>
        <div className='relative max-w-4xl w-full animate-scale-in'>
          {/* Contenu du modal */}
          <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-2xl p-8 relative overflow-hidden'>
            {/* Éléments décoratifs */}
            <div className='absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-3xl' />
            <div className='absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl' />

            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className='absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 text-white font-bold text-xl hover:from-red-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95'
              aria-label='Fermer'
            >
              ✕
            </button>

            {/* En-tête du modal */}
            <div className='relative z-10 text-center mb-6'>
              <h2 className='text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-2'>
                🛍️ Boutique de {creatureName}
              </h2>
              <p className='text-gray-600 text-lg'>
                Gâtez votre créature avec des objets spéciaux !
              </p>
            </div>

            {/* Contenu de test */}
            <div className='relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-inner'>
              <div className='text-center'>
                <div className='text-6xl mb-4 animate-bounce'>
                  🎁
                </div>
                <h3 className='text-2xl font-bold text-purple-600 mb-3'>
                  Boutique en construction
                </h3>
                <p className='text-gray-700 text-lg mb-4'>
                  Bientôt disponible : nourriture, accessoires, et bien plus !
                </p>
                <div className='flex gap-4 justify-center flex-wrap'>
                  <div className='bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-xl p-4 shadow-md'>
                    <span className='text-3xl'>🍰</span>
                    <p className='text-sm font-semibold mt-2'>Nourriture</p>
                  </div>
                  <div className='bg-gradient-to-br from-pink-200 to-pink-300 rounded-xl p-4 shadow-md'>
                    <span className='text-3xl'>👑</span>
                    <p className='text-sm font-semibold mt-2'>Accessoires</p>
                  </div>
                  <div className='bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl p-4 shadow-md'>
                    <span className='text-3xl'>🎨</span>
                    <p className='text-sm font-semibold mt-2'>Customisation</p>
                  </div>
                  <div className='bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl p-4 shadow-md'>
                    <span className='text-3xl'>⚡</span>
                    <p className='text-sm font-semibold mt-2'>Boosts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}
      </style>
    </div>
  )
}
