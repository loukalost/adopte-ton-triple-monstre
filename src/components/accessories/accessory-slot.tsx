/**
 * Slot d'accessoire cliquable
 * Affiche l'accessoire équipé ou un placeholder et ouvre le sélecteur
 * Respecte SRP: Affichage et déclenchement de la modal uniquement
 */

'use client'

import { useState } from 'react'
import { getAccessoryById } from '@/config/accessories.config'
import { AccessorySelector } from './accessory-selector'
import { AccessoryPreview } from './accessory-preview'
import type { OwnedAccessory, AccessoryCategory } from '@/types/accessories'

interface AccessorySlotProps {
  monsterId: string
  category: AccessoryCategory
  equipped: OwnedAccessory | null
}

const categoryLabels = {
  hat: { name: 'Chapeau', emoji: '🎩' },
  glasses: { name: 'Lunettes', emoji: '👓' },
  shoes: { name: 'Chaussures', emoji: '👟' }
}

export function AccessorySlot ({
  monsterId,
  category,
  equipped
}: AccessorySlotProps): React.ReactNode {
  const [showSelector, setShowSelector] = useState(false)

  const info = equipped !== null ? getAccessoryById(equipped.accessoryId) : null
  const label = categoryLabels[category]

  return (
    <>
      <button
        onClick={() => { setShowSelector(true) }}
        className='
          relative w-full aspect-square
          rounded-2xl overflow-hidden
          bg-gradient-to-br from-[color:var(--color-electric-50)] to-[color:var(--color-neon-purple-50)]
          hover:scale-105 hover:shadow-xl
          active:scale-95
          transition-all duration-300
          flex flex-col items-center justify-center
          gap-2
          border-2 border-[color:var(--color-neutral-200)]
        '
      >
        {/* Preview de l'accessoire ou placeholder */}
        <div className='flex-1 flex items-center justify-center'>
          {info?.drawData != null
            ? (
              <AccessoryPreview
                drawData={info.drawData}
                category={category}
                size={60}
              />
              )
            : (
              <span className='text-5xl'>{label.emoji}</span>
              )}
        </div>

        {/* Label */}
        <span className='text-sm font-bold text-[color:var(--color-neutral-700)]'>
          {info?.name ?? label.name}
        </span>

        {/* Badge équipé */}
        {equipped !== null && (
          <span className='absolute top-2 right-2 text-xl'>✅</span>
        )}

        {/* Indicateur "Ajouter" si vide */}
        {equipped === null && (
          <span className='absolute bottom-2 text-xs text-[color:var(--color-neutral-500)] font-medium'>
            Cliquer pour équiper
          </span>
        )}
      </button>

      {/* Modal de sélection */}
      {showSelector && (
        <AccessorySelector
          monsterId={monsterId}
          category={category}
          currentEquippedId={equipped?._id ?? null}
          onClose={() => { setShowSelector(false) }}
        />
      )}
    </>
  )
}
