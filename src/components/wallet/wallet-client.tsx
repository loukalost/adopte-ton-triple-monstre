'use client'

import type React from 'react'
import { type DBWallet } from '@/actions/wallet.actions'
import { useState, useEffect } from 'react'
import { usePaymentModal } from '@/hooks/wallet/usePaymentModal'
import { useWalletPayment } from '@/hooks/wallet/useWalletPayment'
import { walletPackages } from '@/config/wallet-packages'
import { WalletBalance } from './wallet-balance'
import { KoinPackageCard } from './koin-package-card'
import { PaymentFeatures } from './payment-features'
import PaymentModal from './payment-modal'
import { AnimatedEmoji } from './ui/animated-emoji'
import { AccessoriesShop } from '@/components/shop/accessories-shop'
import { BackgroundsShop } from '@/components/shop/backgrounds-shop'

type ShopCategory = 'koins' | 'accessories' | 'backgrounds'

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
  const [wallet, setWallet] = useState<DBWallet>(initialWallet)
  const [shopCategory, setShopCategory] = useState<ShopCategory>('koins')
  const { isPurchasing, error, handlePurchase } = useWalletPayment()
  const { showModal, modalType, closeModal } = usePaymentModal()

  // Met à jour le wallet local quand initialWallet change (après router.refresh())
  useEffect(() => {
    setWallet(initialWallet)
  }, [initialWallet])

  // Callback pour rafraîchir le wallet après un achat d'accessoire
  const handleAccessoryPurchaseSuccess = (): void => {
    // Recharger la page pour mettre à jour le solde
    window.location.reload()
  }

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

        {/* Onglets de catégorie */}
        <div className='flex justify-center gap-4 mb-6'>
          <button
            onClick={() => { setShopCategory('koins') }}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
              shopCategory === 'koins'
                ? 'bg-[color:var(--color-electric-500)] text-white shadow-lg scale-105'
                : 'bg-white text-[color:var(--color-neutral-700)] border-2 border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-electric-400)]'
            }`}
          >
            <span className='mr-2'>🪙</span>
            Acheter des Koins
          </button>
          <button
            onClick={() => { setShopCategory('accessories') }}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
              shopCategory === 'accessories'
                ? 'bg-[color:var(--color-electric-500)] text-white shadow-lg scale-105'
                : 'bg-white text-[color:var(--color-neutral-700)] border-2 border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-electric-400)]'
            }`}
          >
            <span className='mr-2'>🎨</span>
            Accessoires
          </button>
          <button
            onClick={() => { setShopCategory('backgrounds') }}
            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
              shopCategory === 'backgrounds'
                ? 'bg-[color:var(--color-electric-500)] text-white shadow-lg scale-105'
                : 'bg-white text-[color:var(--color-neutral-700)] border-2 border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-electric-400)]'
            }`}
          >
            <span className='mr-2'>🖼️</span>
            Arrière-plans
          </button>
        </div>

        {/* Message d'erreur */}
        {error !== null && shopCategory === 'koins' && (
          <div className='bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-center text-sm font-medium shadow'>
            <span className='text-xl mr-2'>⚠️</span>
            {error}
          </div>
        )}

        {/* Contenu selon la catégorie sélectionnée */}
        {shopCategory === 'koins'
          ? (
            <>
              {/* Titre de la boutique Koins */}
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
            </>
            )
          : shopCategory === 'accessories'
            ? (
              <>
                {/* Titre de la boutique Accessoires */}
                <div className='text-center mb-4'>
                  <h2 className='text-xl font-bold text-[color:var(--color-electric-600)] mb-2'>
                    Personnalise tes Créatures ! 🎨
                  </h2>
                  <p className='text-sm text-[color:var(--color-neutral-600)] font-medium'>
                    Achète des accessoires avec tes Koins
                  </p>
                </div>

                {/* Boutique d'accessoires */}
                <AccessoriesShop
                  currentKoins={wallet.balance}
                  onPurchaseSuccess={handleAccessoryPurchaseSuccess}
                />
              </>
              )
            : (
              <>
                {/* Titre de la boutique Arrière-plans */}
                <div className='text-center mb-4'>
                  <h2 className='text-xl font-bold text-[color:var(--color-electric-600)] mb-2'>
                    Embellis tes Créatures ! 🖼️
                  </h2>
                  <p className='text-sm text-[color:var(--color-neutral-600)] font-medium'>
                    Achète des arrière-plans avec tes Koins
                  </p>
                </div>

                {/* Boutique d'arrière-plans */}
                <BackgroundsShop
                  currentKoins={wallet.balance}
                  onPurchaseSuccess={handleAccessoryPurchaseSuccess}
                />
              </>
              )}
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
