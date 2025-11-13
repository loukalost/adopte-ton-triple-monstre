import type React from 'react'
import { AnimatedEmoji } from './ui/animated-emoji'
import { useCountUp } from '@/hooks/wallet/useCountUp'
import { ANIMATION_DURATIONS } from '@/config/ui.constants'

interface WalletBalanceProps {
  balance: number
}

/**
 * Composant d'affichage du solde du wallet avec animation de compteur
 * Principe SRP: Responsabilité unique d'affichage du solde
 */
export function WalletBalance ({ balance }: WalletBalanceProps): React.ReactElement {
  // Animation du compteur avec durée configurée
  const animatedBalance = useCountUp(balance, ANIMATION_DURATIONS.countUp)

  const getKoinLabel = (): string => {
    if (animatedBalance === 0 || animatedBalance === 1) return 'Koin'
    return 'Koins'
  }

  return (
    <div className='relative overflow-hidden rounded-lg bg-[color:var(--color-neutral-50)] p-6 mb-6 shadow-md border-2 border-[color:var(--color-neutral-200)]'>
      <div className='relative z-10'>
        <div className='text-center'>
          <p className='text-xs font-semibold text-[color:var(--color-neutral-600)] uppercase tracking-wider mb-2 flex items-center justify-center gap-1'>
            <span>💎</span>
            Ton Trésor Actuel
            <span>💎</span>
          </p>
          <div className='flex items-center justify-center gap-3'>
            <AnimatedEmoji emoji='🪙' size='md' animation='animate-spin-slow' />
            <h2 className='text-4xl font-bold text-[color:var(--color-electric-600)] transition-all duration-300'>
              {animatedBalance.toLocaleString('fr-FR')}
            </h2>
            <AnimatedEmoji
              emoji='🪙'
              size='md'
              animation='animate-spin-slow'
              className='[animation-delay:1s]'
            />
          </div>
          <p className='text-base font-semibold text-[color:var(--color-neutral-700)] mt-2'>
            {getKoinLabel()}
          </p>
        </div>
      </div>
    </div>
  )
}
