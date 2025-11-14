import type React from 'react'
import { AnimatedEmoji } from './ui'
import Button from '../button'

export interface KoinPackage {
  amount: number
  price: number
  emoji: string
  color: string
  badge: string
  popular: boolean
}

interface KoinPackageCardProps {
  package: KoinPackage
  isPurchasing: boolean
  onPurchase: (amount: number) => void
}

/**
 * Composant carte d'affichage d'un package de Koins
 * Principe SRP: Responsabilité unique d'affichage d'un package
 */
export function KoinPackageCard ({
  package: pkg,
  isPurchasing,
  onPurchase
}: KoinPackageCardProps): React.ReactElement {
  return (
    <div
      className={`
        relative rounded-lg 
        bg-[color:var(--color-neutral-50)] 
        p-4 shadow-md 
        border-2 ${pkg.popular ? 'border-[color:var(--color-electric-500)]' : 'border-[color:var(--color-neutral-200)]'}
        transition-all duration-200 hover:shadow-lg
      `}
    >
      {/* Badge */}
      {pkg.popular && (
        <div className='absolute -top-2 -right-2 bg-[color:var(--color-electric-500)] text-white font-bold text-xs px-3 py-1 rounded-full shadow'>
          {pkg.badge}
        </div>
      )}

      {/* Contenu */}
      <div className='relative text-center'>
        {/* Emoji du pack */}
        <AnimatedEmoji emoji={pkg.emoji} size='md' className='mb-3' />

        {/* Montant de Koins */}
        <div className='mb-3'>
          <div className='inline-block bg-[color:var(--color-electric-100)] text-[color:var(--color-electric-700)] font-bold text-2xl px-4 py-2 rounded-lg'>
            {pkg.amount.toLocaleString('fr-FR')}
          </div>
          <p className='text-sm font-medium text-[color:var(--color-neutral-600)] mt-1'>Koins</p>
        </div>

        {/* Prix */}
        <div className='mb-4'>
          <div className='text-2xl font-bold text-[color:var(--color-electric-600)]'>
            {pkg.price}€
          </div>
          <p className='text-xs text-[color:var(--color-neutral-500)]'>
            Soit {(pkg.price / pkg.amount).toFixed(2)}€ par Koin
          </p>
        </div>

        {/* Bouton d'achat */}
        <Button
          onClick={() => { onPurchase(pkg.amount) }}
          disabled={isPurchasing}
          variant='primary'
          size='md'
        >
          {isPurchasing
            ? (
              <>
                <span className='animate-spin mr-1'>⏳</span>
                <span>Chargement...</span>
              </>
              )
            : (
              <>
                <span className='mr-1'>🛒</span>
                <span>Acheter</span>
              </>
              )}
        </Button>
      </div>
    </div>
  )
}
