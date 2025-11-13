/**
 * Boutique d'arrière-plans
 * Respecte SRP: Affichage et achat d'arrière-plans uniquement
 */

'use client'

import { useState } from 'react'
import { backgroundsCatalog, getBackgroundPrice, backgroundRarityConfig } from '@/config/backgrounds.config'
import { useBackgrounds } from '@/hooks/backgrounds/use-backgrounds'
import { usePurchaseBackground } from '@/hooks/backgrounds/use-purchase-background'
import BackgroundRenderer from '@/components/backgrounds/background-renderer'
import type { BackgroundCategory } from '@/types/backgrounds'

interface BackgroundsShopProps {
  currentKoins: number
  onPurchaseSuccess?: () => void
}

export function BackgroundsShop ({
  currentKoins,
  onPurchaseSuccess
}: BackgroundsShopProps): React.ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<BackgroundCategory | 'all'>('all')
  const [error, setError] = useState<string | null>(null)
  const { backgrounds: ownedBackgrounds, refresh } = useBackgrounds()
  const { purchaseBackground: purchaseBg } = usePurchaseBackground()
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  const categories: Array<{ id: BackgroundCategory | 'all', name: string, emoji: string }> = [
    { id: 'all', name: 'Tous', emoji: '🎨' },
    { id: 'gradient', name: 'Dégradés', emoji: '🌈' },
    { id: 'pattern', name: 'Motifs', emoji: '🎯' },
    { id: 'animated', name: 'Animés', emoji: '✨' }
  ]

  const filteredBackgrounds = selectedCategory === 'all'
    ? backgroundsCatalog
    : backgroundsCatalog.filter(bg => bg.category === selectedCategory)

  async function handlePurchase (backgroundId: string): Promise<void> {
    setPurchasingId(backgroundId)
    setError(null)

    try {
      const result = await purchaseBg(backgroundId)

      if (result.success) {
        await refresh()
        onPurchaseSuccess?.()
      } else {
        setError(result.error ?? 'Erreur lors de l\'achat')
      }
    } catch (err) {
      console.error('Purchase error:', err)
      setError('Erreur inattendue')
    } finally {
      setPurchasingId(null)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-black text-[color:var(--color-electric-600)] mb-2'>
          🖼️ Arrière-plans
        </h2>
        <p className='text-[color:var(--color-neutral-600)] text-sm font-medium'>
          Mets en valeur tes créatures avec des arrière-plans uniques !
        </p>
      </div>

      {/* Message d'erreur */}
      {error !== null && (
        <div className='bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-center text-sm font-medium shadow'>
          <span className='text-xl mr-2'>⚠️</span>
          {error}
        </div>
      )}

      {/* Filtres de catégorie */}
      <div className='flex gap-2 justify-center flex-wrap'>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id) }}
            className={`
              px-4 py-2 rounded-full font-bold text-sm
              transition-all duration-300
              ${selectedCategory === cat.id
                ? 'bg-[color:var(--color-electric-500)] text-white scale-105 shadow-lg'
                : 'bg-white text-[color:var(--color-neutral-700)] hover:scale-105 shadow-md border-2 border-[color:var(--color-neutral-200)]'
              }
            `}
          >
            <span className='text-xl mr-1'>{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grille d'arrière-plans */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredBackgrounds.map(background => {
          const price = getBackgroundPrice(background)
          const canAfford = currentKoins >= price
          const isLoading = purchasingId === background.id
          const isOwned = ownedBackgrounds.some(owned => owned.backgroundId === background.id)
          const rarityInfo = backgroundRarityConfig[background.rarity]

          return (
            <div
              key={background.id}
              className='
                relative overflow-hidden rounded-2xl
                bg-white
                p-4 shadow-md
                border-2 border-[color:var(--color-neutral-200)]
                hover:scale-105 hover:shadow-xl
                transition-all duration-300
              '
            >
              {/* Badge de rareté */}
              <div className='absolute top-3 right-3 z-10'>
                <div
                  className='px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg'
                  style={{ backgroundColor: rarityInfo.color }}
                >
                  {rarityInfo.emoji} {rarityInfo.name}
                </div>
              </div>

              {/* Preview de l'arrière-plan */}
              <div className='relative mb-3 mt-2'>
                <div className='w-full h-32 rounded-xl overflow-hidden border-2 border-[color:var(--color-neutral-300)] shadow-inner'>
                  <BackgroundRenderer
                    backgroundData={background.data}
                    className='w-full h-full'
                  />
                </div>
              </div>

              {/* Nom */}
              <h3 className='text-lg font-black text-center text-[color:var(--color-neutral-800)] mb-1'>
                {background.name}
              </h3>

              {/* Catégorie */}
              <div className='text-center mb-2'>
                <span className='inline-block px-2 py-1 rounded-full text-xs font-bold bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-600)]'>
                  {categories.find(c => c.id === background.category)?.emoji}{' '}
                  {categories.find(c => c.id === background.category)?.name}
                </span>
              </div>

              {/* Description */}
              <p className='text-center text-[color:var(--color-neutral-600)] mb-3 text-xs'>
                {background.description}
              </p>

              {/* Prix */}
              <div className='flex items-center justify-center gap-1 mb-3'>
                <span className='text-2xl font-black text-[color:var(--color-electric-600)]'>
                  {price}
                </span>
                <span className='text-xl'>🪙</span>
              </div>

              {/* Bouton d'achat */}
              {isOwned
                ? (
                  <div className='w-full py-2 rounded-xl font-bold text-sm bg-[color:var(--color-electric-100)] text-[color:var(--color-electric-700)] text-center border-2 border-[color:var(--color-electric-300)]'>
                    <span className='text-lg mr-1'>✅</span>
                    Possédé
                  </div>
                  )
                : (
                  <button
                    onClick={() => { void handlePurchase(background.id) }}
                    disabled={!canAfford || isLoading}
                    className={`
                    w-full py-2 rounded-xl font-bold text-sm
                    transition-all duration-300
                    flex items-center justify-center gap-1
                    ${canAfford && !isLoading
                      ? 'bg-[color:var(--color-electric-500)] text-white hover:bg-[color:var(--color-electric-600)] hover:scale-105 active:scale-95'
                      : 'bg-[color:var(--color-neutral-300)] text-[color:var(--color-neutral-500)] cursor-not-allowed'
                    }
                  `}
                  >
                    {isLoading
                      ? (
                        <>
                          <span className='animate-spin text-lg'>⏳</span>
                          <span>Achat...</span>
                        </>
                        )
                      : canAfford
                        ? (
                          <>
                            <span className='text-lg'>🛒</span>
                            <span>Acheter</span>
                          </>
                          )
                        : (
                          <>
                            <span className='text-lg'>❌</span>
                            <span>Pas assez de Koins</span>
                          </>
                          )}
                  </button>
                  )}
            </div>
          )
        })}
      </div>

      {/* Message si aucun arrière-plan */}
      {filteredBackgrounds.length === 0 && (
        <div className='text-center py-12 text-[color:var(--color-neutral-500)]'>
          <p className='text-4xl mb-2'>🤷</p>
          <p className='font-medium'>Aucun arrière-plan dans cette catégorie</p>
        </div>
      )}
    </div>
  )
}
