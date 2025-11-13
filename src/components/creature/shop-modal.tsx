'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { buyXpBoost } from '@/actions/shop.actions'
import { getWallet } from '@/actions/wallet.actions'
import { xpBoosts } from '@/config/shop.config'
import { XPBoostCard } from './xp-boost-card'
import { AccessoriesShop } from '@/components/shop/accessories-shop'
import { BackgroundsShop } from '@/components/shop/backgrounds-shop'

interface ShopModalProps {
  /** Fonction pour fermer le modal */
  onClose: () => void
  /** Nom de la créature */
  creatureName: string
  /** ID de la créature */
  creatureId: string
}

type ShopTab = 'boosts' | 'accessories' | 'backgrounds'

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
  const [activeTab, setActiveTab] = useState<ShopTab>('boosts')
  const [currentKoins, setCurrentKoins] = useState(0)

  // Charger le solde de Koins
  useEffect(() => {
    const loadWallet = async (): Promise<void> => {
      try {
        const wallet = await getWallet()
        setCurrentKoins(wallet.balance)
      } catch (error) {
        console.error('Erreur lors du chargement du portefeuille:', error)
      }
    }
    void loadWallet()
  }, [])

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
      await buyXpBoost(creatureId, boostId)

      // Recharger le portefeuille
      const wallet = await getWallet()
      setCurrentKoins(wallet.balance)

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

  // Callback après achat d'accessoire ou arrière-plan
  const handlePurchaseSuccess = async (): Promise<void> => {
    const wallet = await getWallet()
    setCurrentKoins(wallet.balance)
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
          <div className='bg-white rounded-lg shadow-2xl p-6 relative border border-[color:var(--color-neutral-200)]'>
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className='absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[color:var(--color-neon-purple-500)] hover:bg-[color:var(--color-neon-purple-600)] text-white font-bold text-lg transition-all duration-300 shadow-lg hover:scale-110 active:scale-95'
              aria-label='Fermer'
            >
              ✕
            </button>

            {/* En-tête du modal */}
            <div className='relative z-10 text-center mb-4'>
              <h2 className='text-2xl font-bold text-[color:var(--color-electric-600)] mb-2'>
                🛍️ Boutique de {creatureName}
              </h2>
              <p className='text-[color:var(--color-neutral-600)] text-sm'>
                Améliorez votre créature avec nos produits !
              </p>
            </div>

            {/* Navigation par onglets */}
            <div className='relative z-10 flex gap-2 mb-6 justify-center border-b-2 border-gray-200 pb-2'>
              <button
                onClick={() => setActiveTab('boosts')}
                className={`px-6 py-3 font-semibold transition-all rounded-t-lg ${
                  activeTab === 'boosts'
                    ? 'text-white bg-[color:var(--color-electric-600)] shadow-lg'
                    : 'text-gray-600 hover:text-[color:var(--color-electric-600)] hover:bg-gray-100'
                }`}
              >
                ⚡ Boosts
              </button>
              <button
                onClick={() => setActiveTab('accessories')}
                className={`px-6 py-3 font-semibold transition-all rounded-t-lg ${
                  activeTab === 'accessories'
                    ? 'text-white bg-[color:var(--color-electric-600)] shadow-lg'
                    : 'text-gray-600 hover:text-[color:var(--color-electric-600)] hover:bg-gray-100'
                }`}
              >
                🎨 Accessoires
              </button>
              <button
                onClick={() => setActiveTab('backgrounds')}
                className={`px-6 py-3 font-semibold transition-all rounded-t-lg ${
                  activeTab === 'backgrounds'
                    ? 'text-white bg-[color:var(--color-electric-600)] shadow-lg'
                    : 'text-gray-600 hover:text-[color:var(--color-electric-600)] hover:bg-gray-100'
                }`}
              >
                🖼️ Arrière-plans
              </button>
            </div>

            {/* Contenu des onglets */}
            <div className='relative z-10'>
              {/* Section Boosts d'XP */}
              {activeTab === 'boosts' && (
                <div>
                  {/* Titre de section */}
                  <div className='mb-4 text-center'>
                    <h3 className='text-lg font-bold text-[color:var(--color-electric-600)] mb-1 inline-flex items-center gap-2'>
                      <span className='text-xl'>⚡</span>
                      Boosts d'XP
                      <span className='text-xl'>⚡</span>
                    </h3>
                    <p className='text-xs text-[color:var(--color-neutral-600)]'>
                      Faites progresser votre créature plus rapidement !
                    </p>
                  </div>

                  {/* Grille des boosts */}
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-4 px-2 py-4 pb-2'>
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
              )}

              {/* Section Accessoires */}
              {activeTab === 'accessories' && (
                <AccessoriesShop
                  currentKoins={currentKoins}
                  onPurchaseSuccess={() => {
                    void handlePurchaseSuccess()
                  }}
                />
              )}

              {/* Section Arrière-plans */}
              {activeTab === 'backgrounds' && (
                <BackgroundsShop
                  currentKoins={currentKoins}
                  onPurchaseSuccess={() => {
                    void handlePurchaseSuccess()
                  }}
                />
              )}
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
