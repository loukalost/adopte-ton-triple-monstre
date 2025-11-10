'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { buyXpBoost } from '@/actions/shop.actions'
import { xpBoosts } from '@/config/shop.config'
import { XPBoostCard } from './xp-boost-card'

interface ShopModalProps {
  /** Fonction pour fermer le modal */
  onClose: () => void
  /** Nom de la créature */
  creatureName: string
  /** ID de la créature */
  creatureId: string
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
export function ShopModal ({ onClose, creatureName, creatureId }: ShopModalProps): React.ReactElement {
  const [isPurchasing, setIsPurchasing] = useState(false)

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

  /**
   * Gère l'achat d'un boost d'XP
   * @param {string} boostId - ID du boost à acheter
   */
  const handlePurchase = async (boostId: string): Promise<void> => {
    setIsPurchasing(true)
    try {
      console.log(`Achat du boost ${boostId} pour la créature ${creatureId}`)

      await buyXpBoost(creatureId, boostId)

      // Afficher un toast de succès
      toast.success('Boost d\'XP acheté avec succès ! 🎉', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

      // Fermer la boutique après un court délai pour laisser l'utilisateur voir le toast
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      console.error('Erreur lors de l\'achat du boost:', error)

      // Afficher un toast d'erreur avec plus de détails si disponibles
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erreur lors de l\'achat du boost 😢'

      toast.error(errorMessage, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  // Fermeture du modal en cliquant sur le backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-fade-in'
      onClick={handleBackdropClick}
    >
      <div className='fixed inset-0 z-[70] flex items-center justify-center p-4'>
        <div className='relative max-w-7xl w-full animate-scale-in'>
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
                Boostez l'XP de votre créature avec nos offres spéciales !
              </p>
            </div>

            {/* Section Boosts d'XP */}
            <div className='relative z-10'>
              {/* Titre de section */}
              <div className='mb-6 text-center'>
                <h3 className='text-2xl font-black text-indigo-700 mb-2 inline-flex items-center gap-2'>
                  <span className='text-3xl'>⚡</span>
                  Boosts d'XP
                  <span className='text-3xl'>⚡</span>
                </h3>
                <p className='text-sm text-gray-600'>
                  Faites progresser votre créature plus rapidement !
                </p>
              </div>

              {/* Grille des boosts */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-6 px-2 py-8 pb-2'>
                {xpBoosts.map((boost) => (
                  <XPBoostCard
                    key={boost.id}
                    boost={boost}
                    isPurchasing={isPurchasing}
                    onPurchase={(boostId) => { void handlePurchase(boostId) }}
                  />
                ))}
              </div>

              {/* Message informatif */}
              <div className='mt-6 p-4 bg-blue-100/50 rounded-xl border-2 border-blue-200'>
                <p className='text-sm text-blue-800 text-center font-semibold'>
                  💡 Astuce : Plus le boost est gros, plus votre créature gagnera d'XP !
                </p>
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
