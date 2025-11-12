/**
 * Boutique d'accessoires
 * Respecte SRP: Affichage et achat d'accessoires uniquement
 */

'use client'

import { useState } from 'react'
import { accessoriesCatalog, getAccessoryPrice } from '@/config/accessories.config'
import { purchaseAccessory } from '@/actions/accessories.actions'
import { RarityBadge } from '@/components/accessories/rarity-badge'
import { AccessoryPreview } from '@/components/accessories/accessory-preview'
import { useAccessories } from '@/hooks/accessories/use-accessories'
import type { AccessoryCategory } from '@/types/accessories'

interface AccessoriesShopProps {
  currentKoins: number
  onPurchaseSuccess?: () => void
}

export function AccessoriesShop ({
  currentKoins,
  onPurchaseSuccess
}: AccessoriesShopProps): React.ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<AccessoryCategory | 'all'>('all')
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { accessories: ownedAccessories, refresh } = useAccessories()

  const categories: Array<{ id: AccessoryCategory | 'all', name: string, emoji: string }> = [
    { id: 'all', name: 'Tous', emoji: '🎨' },
    { id: 'hat', name: 'Chapeaux', emoji: '🎩' },
    { id: 'glasses', name: 'Lunettes', emoji: '👓' },
    { id: 'shoes', name: 'Chaussures', emoji: '👟' }
  ]

  const filteredAccessories = selectedCategory === 'all'
    ? accessoriesCatalog
    : accessoriesCatalog.filter(acc => acc.category === selectedCategory)

  async function handlePurchase (accessoryId: string): Promise<void> {
    setIsPurchasing(accessoryId)
    setError(null)

    try {
      const result = await purchaseAccessory(accessoryId)

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
      setIsPurchasing(null)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-black text-[color:var(--color-electric-600)] mb-2'>
          🎨 Accessoires
        </h2>
        <p className='text-[color:var(--color-neutral-600)] text-sm font-medium'>
          Personnalise tes créatures avec style !
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

      {/* Grille d'accessoires */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredAccessories.map(accessory => {
          const price = getAccessoryPrice(accessory)
          const canAfford = currentKoins >= price
          const isLoading = isPurchasing === accessory.id
          const isOwned = ownedAccessories.some(owned => owned.accessoryId === accessory.id)

          return (
            <div
              key={accessory.id}
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
              <div className='absolute top-3 right-3'>
                <RarityBadge rarity={accessory.rarity} size='sm' />
              </div>

              {/* Preview Canvas */}
              <div className='flex justify-center items-center mb-3 mt-6'>
                {accessory.drawData != null && (
                  <AccessoryPreview
                    drawData={accessory.drawData}
                    category={accessory.category}
                    size={80}
                  />
                )}
              </div>

              {/* Nom */}
              <h3 className='text-lg font-black text-center text-[color:var(--color-neutral-800)] mb-1'>
                {accessory.name}
              </h3>

              {/* Description */}
              <p className='text-center text-[color:var(--color-neutral-600)] mb-3 text-xs'>
                {accessory.description}
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
                    onClick={() => { void handlePurchase(accessory.id) }}
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

      {/* Message si aucun accessoire */}
      {filteredAccessories.length === 0 && (
        <div className='text-center py-12 text-[color:var(--color-neutral-500)]'>
          <p className='text-4xl mb-2'>🤷</p>
          <p className='font-medium'>Aucun accessoire dans cette catégorie</p>
        </div>
      )}
    </div>
  )
}
