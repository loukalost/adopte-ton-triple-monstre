'use client'

import type React from 'react'
import type { XPBoost } from '@/types/shop'

interface XPBoostCardProps {
  /** Boost d'XP à afficher */
  boost: XPBoost
  /** Est-ce que l'achat est en cours ? */
  isPurchasing: boolean
  /** Callback lors de l'achat */
  onPurchase: (boostId: string) => void
}

/**
 * Composant carte d'affichage d'un boost d'XP
 * Principe SRP: Responsabilité unique d'affichage d'un boost
 *
 * @param {XPBoostCardProps} props - Props du composant
 * @returns {React.ReactElement} Card du boost d'XP
 */
export function XPBoostCard ({
  boost,
  isPurchasing,
  onPurchase
}: XPBoostCardProps): React.ReactElement {
  return (
    <div
      className={`
        group relative rounded-lg
        bg-white
        p-4 shadow-lg border-2
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${boost.popular ? 'border-[color:var(--color-electric-500)]' : 'border-[color:var(--color-neutral-200)]'}
      `}
    >
      {/* Badge */}
      {boost.badge && (
        <div className='absolute -top-2 left-1/2 transform -translate-x-1/2 z-10'>
          <div
            className={`
              px-3 py-1 rounded-full font-bold text-xs text-white shadow-lg
              ${boost.popular ? 'bg-[color:var(--color-electric-500)]' : 'bg-[color:var(--color-neon-purple-500)]'}
            `}
          >
            {boost.badge}
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className='relative text-center pt-2'>
        {/* Emoji du boost */}
        <div className='text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300'>
          {boost.emoji}
        </div>

        {/* Nom du boost */}
        <h3 className='text-base font-bold text-[color:var(--color-electric-600)] mb-2'>
          {boost.name}
        </h3>

        {/* Description */}
        <p className='text-xs text-[color:var(--color-neutral-600)] mb-3 min-h-[30px]'>
          {boost.description}
        </p>

        {/* Montant d'XP */}
        <div className='mb-3'>
          <div className='inline-block bg-[color:var(--color-electric-500)] text-white font-bold text-xl px-4 py-2 rounded-lg shadow-lg'>
            +{boost.xpAmount}
          </div>
          <p className='text-sm font-bold text-[color:var(--color-electric-600)] mt-1'>XP</p>
        </div>

        {/* Prix en Koins */}
        <div className='mb-3'>
          <div className='flex items-center justify-center gap-2'>
            <span className='text-lg'>🪙</span>
            <span className='text-xl font-bold text-[color:var(--color-electric-600)]'>
              {boost.price}
            </span>
            <span className='text-sm font-medium text-[color:var(--color-neutral-600)]'>Koins</span>
          </div>
        </div>

        {/* Bouton d'achat */}
        <button
          onClick={() => { onPurchase(boost.id) }}
          disabled={isPurchasing}
          className={`
            w-full
            bg-[color:var(--color-electric-500)] hover:bg-[color:var(--color-electric-600)]
            text-white font-bold text-sm
            px-4 py-2 rounded-lg
            shadow-lg
            transition-all duration-300
            hover:scale-105
            active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          `}
        >
          <div className='flex items-center justify-center gap-2'>
            {isPurchasing
              ? (
                <>
                  <span className='animate-spin text-lg'>⏳</span>
                  <span>Achat...</span>
                </>
                )
              : (
                <>
                  <span className='text-lg'>🛒</span>
                  <span>Acheter</span>
                </>
                )}
          </div>
        </button>
      </div>
    </div>
  )
}
