/**
 * Modal de sélection d'accessoires
 * Permet d'équiper ou retirer un accessoire par catégorie
 * Respecte SRP: Affichage et sélection d'accessoires uniquement
 */

'use client'

import { useState } from 'react'
import { useAccessories } from '@/hooks/accessories/use-accessories'
import { useEquipAccessory } from '@/hooks/accessories/use-equip-accessory'
import { getAccessoryById } from '@/config/accessories.config'
import { RarityBadge } from './rarity-badge'
import { AccessoryPreview } from './accessory-preview'
import type { AccessoryCategory } from '@/types/accessories'

interface AccessorySelectorProps {
  monsterId: string
  category: AccessoryCategory
  currentEquippedId: string | null
  onClose: () => void
}

const categoryLabels = {
  hat: { name: 'Chapeau', emoji: '🎩' },
  glasses: { name: 'Lunettes', emoji: '👓' },
  shoes: { name: 'Chaussures', emoji: '👟' }
}

export function AccessorySelector ({
  monsterId,
  category,
  currentEquippedId,
  onClose
}: AccessorySelectorProps): React.ReactNode {
  const { accessories, loading } = useAccessories()
  const { equipAccessory, unequipAccessory, isEquipping } = useEquipAccessory()
  const [error, setError] = useState<string | null>(null)

  const label = categoryLabels[category]

  // Filtrer les accessoires par catégorie
  const categoryAccessories = accessories.filter(acc => {
    const info = getAccessoryById(acc.accessoryId)
    return info?.category === category
  })

  async function handleEquip (accessoryDbId: string): Promise<void> {
    setError(null)
    const result = await equipAccessory(accessoryDbId, monsterId)
    if (result.success) {
      onClose()
    } else {
      setError(result.error ?? 'Erreur lors de l\'équipement')
    }
  }

  async function handleUnequip (): Promise<void> {
    if (currentEquippedId === null) return

    setError(null)
    const result = await unequipAccessory(currentEquippedId)
    if (result.success) {
      onClose()
    } else {
      setError(result.error ?? 'Erreur lors du retrait')
    }
  }

  if (loading) {
    return (
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
        <div className='bg-white rounded-3xl p-8 max-w-md w-full text-center'>
          <span className='text-4xl animate-spin inline-block'>⏳</span>
          <p className='mt-4 text-[color:var(--color-neutral-600)] font-medium'>
            Chargement...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-2xl font-black text-[color:var(--color-electric-600)]'>
            <span className='text-3xl mr-2'>{label.emoji}</span>
            {label.name}
          </h3>
          <button
            onClick={onClose}
            className='text-3xl hover:scale-110 transition-transform active:scale-95'
          >
            ❌
          </button>
        </div>

        {/* Message d'erreur */}
        {error !== null && (
          <div className='bg-red-100 border-2 border-red-300 text-red-700 px-4 py-2 rounded-xl mb-4 text-sm font-medium'>
            <span className='text-xl mr-2'>⚠️</span>
            {error}
          </div>
        )}

        {/* Liste d'accessoires */}
        {categoryAccessories.length === 0
          ? (
            <div className='text-center py-12 text-[color:var(--color-neutral-500)]'>
              <p className='text-5xl mb-3'>😢</p>
              <p className='font-bold text-lg mb-1'>Aucun {label.name.toLowerCase()} possédé</p>
              <p className='text-sm'>Va faire un tour à la boutique !</p>
            </div>
            )
          : (
            <div className='space-y-3'>
              {/* Option pour retirer */}
              {currentEquippedId !== null && (
                <button
                  onClick={() => { void handleUnequip() }}
                  disabled={isEquipping}
                  className='
                  w-full p-4 rounded-2xl
                  bg-[color:var(--color-neutral-400)] text-white
                  font-bold text-base
                  hover:bg-[color:var(--color-neutral-500)] hover:scale-105
                  active:scale-95
                  transition-all duration-300
                  flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                '
                >
                  <span className='text-2xl'>🗑️</span>
                  <span>Retirer l'accessoire</span>
                </button>
              )}

              {/* Liste des accessoires */}
              {categoryAccessories.map(acc => {
                const info = getAccessoryById(acc.accessoryId)
                if (info === undefined) return null

                const isEquipped = acc._id === currentEquippedId

                return (
                  <button
                    key={acc._id}
                    onClick={() => { void handleEquip(acc._id) }}
                    disabled={isEquipped || isEquipping}
                    className={`
                    w-full p-4 rounded-2xl
                    flex items-center gap-4
                    transition-all duration-300
                    ${isEquipped
                      ? 'bg-[color:var(--color-electric-100)] border-2 border-[color:var(--color-electric-500)] ring-4 ring-[color:var(--color-electric-200)]'
                      : 'bg-white border-2 border-[color:var(--color-neutral-200)] hover:scale-105 hover:shadow-lg'
                    }
                    disabled:cursor-not-allowed
                  `}
                  >
                    {/* Preview Canvas */}
                    <div className='flex-shrink-0'>
                      {info.drawData != null && (
                        <AccessoryPreview
                          drawData={info.drawData}
                          category={category}
                          size={60}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className='flex-1 text-left'>
                      <div className='font-bold text-lg text-[color:var(--color-neutral-800)]'>
                        {info.name}
                      </div>
                      <div className='text-sm text-[color:var(--color-neutral-600)]'>
                        {info.description}
                      </div>
                    </div>

                    {/* Badge de rareté */}
                    <RarityBadge rarity={info.rarity} size='sm' />

                    {/* Indicateur équipé */}
                    {isEquipped && (
                      <span className='text-2xl'>✅</span>
                    )}
                  </button>
                )
              })}
            </div>
            )}
      </div>
    </div>
  )
}
