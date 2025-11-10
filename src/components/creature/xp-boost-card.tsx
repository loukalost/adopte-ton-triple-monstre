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
        group relative rounded-[2rem]
        bg-gradient-to-br from-white via-blue-50 to-indigo-100
        p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        ring-4 ring-white/80
        transition-all duration-300 hover:scale-105 hover:shadow-[0_30px_90px_rgba(0,0,0,0.25)]
        ${boost.popular ? 'ring-8 ring-yellow-400 transform scale-105' : ''}
      `}
    >
      {/* Badge */}
      <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 z-10'>
        <div
          className={`
            px-6 py-2 rounded-full font-black text-sm text-white shadow-2xl
            bg-gradient-to-r ${boost.popular ? 'from-yellow-400 to-orange-500' : boost.color}
            ${boost.popular ? 'animate-pulse ring-4 ring-yellow-200' : ''}
          `}
        >
          {boost.badge}
        </div>
      </div>

      {/* Bulles décoratives */}
      <div className='pointer-events-none absolute -right-6 top-6 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-xl group-hover:scale-150 transition-transform duration-500 overflow-hidden' />

      {/* Contenu */}
      <div className='relative text-center pt-4'>
        {/* Emoji du boost */}
        <div className='text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300'>
          {boost.emoji}
        </div>

        {/* Nom du boost */}
        <h3 className='text-2xl font-black text-purple-700 mb-2'>
          {boost.name}
        </h3>

        {/* Description */}
        <p className='text-sm text-gray-600 mb-4 min-h-[40px]'>
          {boost.description}
        </p>

        {/* Montant d'XP */}
        <div className='mb-4'>
          <div className={`inline-block bg-gradient-to-r ${boost.color} text-white font-black text-3xl px-6 py-3 rounded-2xl shadow-xl ring-4 ring-white/50`}>
            +{boost.xpAmount}
          </div>
          <p className='text-lg font-bold text-indigo-600 mt-2'>XP</p>
        </div>

        {/* Prix en Koins */}
        <div className='mb-6'>
          <div className='flex items-center justify-center gap-2'>
            <span className='text-3xl'>🪙</span>
            <span className='text-4xl font-black text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text'>
              {boost.price}
            </span>
            <span className='text-xl font-bold text-gray-600'>Koins</span>
          </div>
        </div>

        {/* Bouton d'achat */}
        <button
          onClick={() => { onPurchase(boost.id) }}
          disabled={isPurchasing}
          className={`
            group/btn relative overflow-hidden w-full
            bg-gradient-to-r ${boost.color}
            text-white font-black text-lg
            px-6 py-4 rounded-2xl
            shadow-2xl ring-4 ring-white/50
            transition-all duration-300
            hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
            active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          `}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover/btn:animate-shine' />
          <div className='relative flex items-center justify-center gap-3'>
            {isPurchasing
              ? (
                <>
                  <span className='animate-spin text-2xl'>⏳</span>
                  <span>Achat en cours...</span>
                </>
                )
              : (
                <>
                  <span className='text-2xl'>🛒</span>
                  <span>Acheter</span>
                  <span className='text-2xl transform group-hover/btn:scale-125 transition-transform'>
                    {boost.emoji}
                  </span>
                </>
                )}
          </div>
        </button>
      </div>

      {/* Styles pour l'animation shine */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        .group/btn:hover .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}
      </style>
    </div>
  )
}
