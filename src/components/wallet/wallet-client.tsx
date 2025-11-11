'use client'

import type React from 'react'
import { type DBWallet } from '@/actions/wallet.actions'
import { useState } from 'react'
import { usePaymentModal } from '@/hooks/wallet/usePaymentModal'
import { useWalletPayment } from '@/hooks/wallet/useWalletPayment'
import { walletPackages } from '@/config/wallet-packages'
import { WalletBalance } from './wallet-balance'
import { KoinPackageCard } from './koin-package-card'
import { PaymentFeatures } from './payment-features'
import PaymentModal from './payment-modal'
import { AnimatedEmoji } from './ui/animated-emoji'

interface WalletClientProps {
  initialWallet: DBWallet
}

/**
 * Composant client pour afficher et gérer le wallet de l'utilisateur
 * Refactorisé selon les principes SOLID
 *
 * Principe SRP: Responsabilité unique de coordination de la page wallet
 * Principe OCP: Ouvert à l'extension via composants modulaires
 * Principe DIP: Dépend d'abstractions (hooks et composants)
 *
 * @param {WalletClientProps} props - Les propriétés du composant
 * @param {DBWallet} props.initialWallet - Le wallet initial de l'utilisateur
 */
export default function WalletClient ({ initialWallet }: WalletClientProps): React.ReactElement {
  const [wallet] = useState<DBWallet>(initialWallet)
  const { isPurchasing, error, handlePurchase } = useWalletPayment()
  const { showModal, modalType, closeModal } = usePaymentModal()

  return (
    <div className='min-h-screen bg-[color:var(--color-neutral-50)] p-4'>
      <div className='relative max-w-4xl mx-auto'>
        {/* En-tête */}
        <div className='text-center mb-6'>
          <div className='inline-flex items-center gap-2 mb-3'>
            <AnimatedEmoji emoji='💰' size='md' animation='animate-bounce' />
            <h1 className='text-2xl font-bold text-[color:var(--color-neutral-900)]'>
              Boutique de Koins
            </h1>
            <AnimatedEmoji
              emoji='🪙'
              size='md'
              animation='animate-bounce'
              className='[animation-delay:0.2s]'
            />
          </div>
          <p className='text-sm font-medium text-[color:var(--color-neutral-600)] flex items-center justify-center gap-2'>
            <span>✨</span>
            Achète des Koins pour ton aventure !
            <span>✨</span>
          </p>
        </div>

        {/* Solde du wallet */}
        <WalletBalance balance={wallet.balance} />

        {/* Message d'erreur */}
        {error !== null && (
          <div className='bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-center text-sm font-medium shadow'>
            <span className='text-xl mr-2'>⚠️</span>
            {error}
          </div>
        )}

        {/* Titre de la boutique */}
        <div className='text-center mb-4'>
          <h2 className='text-xl font-bold text-[color:var(--color-electric-600)] mb-2'>
            Choisis ton Pack de Koins ! 🎁
          </h2>
          <p className='text-sm text-[color:var(--color-neutral-600)] font-medium'>
            Paiement sécurisé par Stripe 🔒
          </p>
        </div>

        {/* Grille des packages */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
          {walletPackages.map((pkg) => (
            <KoinPackageCard
              key={pkg.amount}
              package={pkg}
              isPurchasing={isPurchasing}
              onPurchase={(amount) => { void handlePurchase(amount) }}
            />
          ))}
        </div>

        {/* Informations supplémentaires */}
        <PaymentFeatures />
      </div>

      {/* Modal de confirmation/erreur de paiement */}
      {showModal && (
        <PaymentModal
          type={modalType}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
