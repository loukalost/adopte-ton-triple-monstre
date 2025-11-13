/**
 * Modal de sélection d'arrière-plans
 * Permet d'appliquer ou retirer un arrière-plan sur un monstre
 * Respecte SRP: Affichage et sélection d'arrière-plans uniquement
 */

'use client'

import { useState } from 'react'
import { useBackgrounds } from '@/hooks/backgrounds/use-backgrounds'
import { useApplyBackground } from '@/hooks/backgrounds/use-apply-background'
import { getBackgroundById, backgroundRarityConfig } from '@/config/backgrounds.config'
import BackgroundRenderer from './background-renderer'

interface BackgroundSelectorProps {
  monsterId: string
  currentBackgroundId: string | null
  onClose: () => void
  onSuccess?: () => void
}

export function BackgroundSelector ({
  monsterId,
  currentBackgroundId,
  onClose,
  onSuccess
}: BackgroundSelectorProps): React.ReactNode {
  const { backgrounds, loading } = useBackgrounds()
  const { applyBackground, removeBackground, isApplying } = useApplyBackground()
  const [error, setError] = useState<string | null>(null)

  async function handleApply (backgroundId: string): Promise<void> {
    setError(null)
    const result = await applyBackground(backgroundId, monsterId)
    if (result.success) {
      onSuccess?.()
      onClose()
    } else {
      setError(result.error ?? 'Erreur lors de l\'application')
    }
  }

  async function handleRemove (): Promise<void> {
    setError(null)
    const result = await removeBackground(monsterId)
    if (result.success) {
      onSuccess?.()
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
      <div className='bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-2xl font-black text-[color:var(--color-electric-600)]'>
            <span className='text-3xl mr-2'>🖼️</span>
            Arrière-plans
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

        {/* Liste d'arrière-plans */}
        {backgrounds.length === 0
          ? (
            <div className='text-center py-12 text-[color:var(--color-neutral-500)]'>
              <p className='text-5xl mb-3'>😢</p>
              <p className='font-bold text-lg mb-1'>Aucun arrière-plan possédé</p>
              <p className='text-sm'>Va faire un tour à la boutique !</p>
            </div>
            )
          : (
            <div className='space-y-3'>
              {/* Option pour retirer */}
              {currentBackgroundId !== null && (
                <button
                  onClick={() => { void handleRemove() }}
                  disabled={isApplying}
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
                  <span>Retirer l'arrière-plan</span>
                </button>
              )}

              {/* Grille des arrière-plans */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {backgrounds.map(bg => {
                  const info = getBackgroundById(bg.backgroundId)
                  if (info === null) return null

                  const isApplied = bg.backgroundId === currentBackgroundId
                  const rarityInfo = backgroundRarityConfig[info.rarity]

                  return (
                    <button
                      key={bg._id.toString()}
                      onClick={() => { void handleApply(bg.backgroundId) }}
                      disabled={isApplied || isApplying}
                      className={`
                      relative p-4 rounded-2xl
                      transition-all duration-300
                      ${isApplied
                        ? 'bg-[color:var(--color-electric-100)] border-2 border-[color:var(--color-electric-500)] ring-4 ring-[color:var(--color-electric-200)]'
                        : 'bg-white border-2 border-[color:var(--color-neutral-200)] hover:scale-105 hover:shadow-lg'
                      }
                      disabled:cursor-not-allowed
                    `}
                    >
                      {/* Badge de rareté */}
                      <div className='absolute top-2 right-2 z-10'>
                        <div
                          className='px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg'
                          style={{ backgroundColor: rarityInfo.color }}
                        >
                          {rarityInfo.emoji}
                        </div>
                      </div>

                      {/* Indicateur appliqué */}
                      {isApplied && (
                        <div className='absolute top-2 left-2 z-10 bg-[color:var(--color-electric-500)] text-white px-2 py-1 rounded-full text-xs font-bold'>
                          ✅ Appliqué
                        </div>
                      )}

                      {/* Preview de l'arrière-plan */}
                      <div className='w-full h-32 rounded-xl overflow-hidden border-2 border-[color:var(--color-neutral-300)] shadow-inner mb-3'>
                        <BackgroundRenderer
                          backgroundData={info.data}
                          className='w-full h-full'
                        />
                      </div>

                      {/* Nom */}
                      <div className='font-bold text-base text-[color:var(--color-neutral-800)] text-center mb-1'>
                        {info.name}
                      </div>

                      {/* Description */}
                      <div className='text-xs text-[color:var(--color-neutral-600)] text-center'>
                        {info.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            )}
      </div>
    </div>
  )
}
