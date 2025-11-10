'use client'

import { type DBWallet } from '@/actions/wallet.actions'
import { useState } from 'react'
import type React from 'react'
import { pricingTable } from '@/config/pricing'

interface WalletClientProps {
  initialWallet: DBWallet
}

/**
 * Composant client pour afficher et gérer le wallet de l'utilisateur - Version Jeu Vidéo Fun
 *
 * Fonctionnalités :
 * - Affichage du solde de Koins avec animations spectaculaires
 * - Cartes d'achat de Koins via Stripe
 * - Animations de particules explosives
 * - Design kawaii et engageant
 *
 * @param {WalletClientProps} props - Les propriétés du composant
 * @param {DBWallet} props.initialWallet - Le wallet initial de l'utilisateur
 */
export default function WalletClient ({ initialWallet }: WalletClientProps): React.ReactElement {
  const [wallet] = useState<DBWallet>(initialWallet)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Gère l'achat de Koins via Stripe
   * @param amount - Montant de Koins à acheter
   */
  const handlePurchase = async (amount: number): Promise<void> => {
    setError(null)
    setIsPurchasing(true)

    try {
      const response = await fetch('/api/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement')
      }

      const { url } = await response.json()

      if (url !== null && url !== undefined && url !== '') {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'achat de Koins')
      setIsPurchasing(false)
    }
  }

  // Packages d'achat avec leurs caractéristiques
  const packages = [
    {
      amount: 10,
      price: pricingTable[10].price,
      emoji: '🪙',
      color: 'from-yellow-400 to-orange-500',
      badge: 'Débutant',
      popular: false
    },
    {
      amount: 50,
      price: pricingTable[50].price,
      emoji: '💰',
      color: 'from-orange-400 to-red-500',
      badge: 'Populaire',
      popular: true
    },
    {
      amount: 500,
      price: pricingTable[500].price,
      emoji: '💎',
      color: 'from-blue-400 to-cyan-500',
      badge: 'Pro',
      popular: false
    },
    {
      amount: 1000,
      price: pricingTable[1000].price,
      emoji: '👑',
      color: 'from-purple-400 to-pink-500',
      badge: 'Royal',
      popular: false
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-200 p-8'>
      {/* Bulles décoratives animées */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-400/30 blur-3xl animate-float' />
        <div className='absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-pink-300/30 to-purple-400/30 blur-3xl animate-float-delayed' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gradient-to-br from-orange-300/20 to-red-400/20 blur-3xl animate-pulse-slow' />
      </div>

      {/* Étoiles décoratives */}
      <div className='pointer-events-none fixed top-20 right-40 text-6xl animate-twinkle'>⭐</div>
      <div className='pointer-events-none fixed top-40 left-20 text-5xl animate-twinkle-delayed'>💎</div>
      <div className='pointer-events-none fixed bottom-40 right-60 text-6xl animate-twinkle'>🪙</div>

      <div className='relative max-w-6xl mx-auto'>
        {/* En-tête ultra fun */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-4 mb-6'>
            <span className='text-7xl animate-bounce'>💰</span>
            <h1 className='text-6xl font-black text-transparent bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text'>
              Boutique de Koins
            </h1>
            <span className='text-7xl animate-bounce' style={{ animationDelay: '0.2s' }}>🪙</span>
          </div>
          <p className='text-2xl font-bold text-orange-600 flex items-center justify-center gap-3'>
            <span className='text-3xl'>✨</span>
            Achète des Koins pour ton aventure !
            <span className='text-3xl'>✨</span>
          </p>
        </div>

        {/* Carte du solde actuel */}
        <div className='relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white via-yellow-50 to-orange-100 p-12 mb-12 shadow-[0_30px_90px_rgba(0,0,0,0.25)] ring-8 ring-white/80'>
          <div className='absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-orange-200/30 to-red-200/30 animate-pulse-slow' />
          <div className='relative z-10'>
            <div className='text-center'>
              <p className='text-xl font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center justify-center gap-2'>
                <span className='text-2xl'>💎</span>
                Ton Trésor Actuel
                <span className='text-2xl'>💎</span>
              </p>
              <div className='flex items-center justify-center gap-6'>
                <span className='text-8xl animate-spin-slow'>🪙</span>
                <h2 className='text-9xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text drop-shadow-2xl'>
                  {wallet.balance.toLocaleString('fr-FR')}
                </h2>
                <span className='text-8xl animate-spin-slow' style={{ animationDelay: '1s' }}>🪙</span>
              </div>
              <p className='text-3xl font-black text-orange-600 mt-6'>
                {wallet.balance === 0 && 'Koin'}
                {wallet.balance === 1 && 'Koin'}
                {wallet.balance > 1 && 'Koins'}
              </p>
            </div>
          </div>
        </div>

        {/* Message d'erreur */}
        {error !== null && (
          <div className='bg-red-100 border-4 border-red-300 text-red-700 px-8 py-5 rounded-3xl mb-8 text-center text-xl font-bold shadow-xl'>
            <span className='text-4xl mr-3'>⚠️</span>
            {error}
          </div>
        )}

        {/* Titre de la boutique */}
        <div className='text-center mb-8'>
          <h2 className='text-5xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-4'>
            Choisis ton Pack de Koins ! 🎁
          </h2>
          <p className='text-xl text-gray-700 font-bold'>
            Paiement sécurisé par Stripe 🔒
          </p>
        </div>

        {/* Grille des packages */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {packages.map((pkg) => (
            <div
              key={pkg.amount}
              className={`group relative rounded-[2rem] bg-gradient-to-br from-white via-pink-50 to-purple-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] ring-4 ring-white/80 transition-all duration-300 hover:scale-105 hover:shadow-[0_30px_90px_rgba(0,0,0,0.25)] ${
                pkg.popular ? 'ring-8 ring-yellow-400 transform scale-105' : ''
              }`}
            >
              {/* Badge populaire */}
              {pkg.popular && (
                <div className='absolute -top-6 -right-6 z-20'>
                  <div className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-sm px-6 py-2 rounded-full shadow-xl ring-4 ring-white transform rotate-12 animate-bounce'>
                    ⭐ {pkg.badge} ⭐
                  </div>
                </div>
              )}

              {/* Badge du pack */}
              {!pkg.popular && (
                <div className='absolute top-4 right-4 z-10'>
                  <div className={`bg-gradient-to-r ${pkg.color} text-white font-black text-xs px-4 py-2 rounded-full shadow-lg`}>
                    {pkg.badge}
                  </div>
                </div>
              )}

              {/* Bulles décoratives */}
              <div className='pointer-events-none absolute -right-8 top-8 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-xl group-hover:scale-150 transition-transform duration-500 overflow-hidden' />

              {/* Contenu */}
              <div className='relative text-center'>
                {/* Emoji du pack */}
                <div className='text-8xl mb-6 animate-float'>{pkg.emoji}</div>

                {/* Montant de Koins */}
                <div className='mb-6'>
                  <div className={`inline-block bg-gradient-to-r ${pkg.color} text-white font-black text-5xl px-8 py-4 rounded-3xl shadow-2xl ring-4 ring-white/50`}>
                    {pkg.amount.toLocaleString('fr-FR')}
                  </div>
                  <p className='text-2xl font-bold text-purple-600 mt-3'>Koins</p>
                </div>

                {/* Prix */}
                <div className='mb-8'>
                  <div className='text-5xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text mb-2'>
                    {pkg.price}€
                  </div>
                  <p className='text-sm text-gray-600 font-medium'>
                    Soit {(pkg.price / pkg.amount).toFixed(2)}€ par Koin
                  </p>
                </div>

                {/* Bouton d'achat */}
                <button
                  onClick={() => { void handlePurchase(pkg.amount) }}
                  disabled={isPurchasing}
                  className={`group/btn relative overflow-hidden w-full bg-gradient-to-r ${pkg.color} hover:brightness-110 text-white font-black text-xl py-5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl ring-4 ring-white/50 active:scale-105`}
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover/btn:animate-shine' />
                  <span className='relative flex items-center justify-center gap-3'>
                    {isPurchasing
                      ? (
                        <>
                          <span className='animate-spin text-2xl'>⏳</span>
                          <span>Chargement...</span>
                        </>
                        )
                      : (
                        <>
                          <span className='text-2xl'>🛒</span>
                          <span>Acheter</span>
                          <span className='text-2xl'>✨</span>
                        </>
                        )}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Informations supplémentaires */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            { icon: '🔒', title: 'Paiement Sécurisé', text: 'Crypté SSL via Stripe' },
            { icon: '⚡', title: 'Instantané', text: 'Koins ajoutés immédiatement' },
            { icon: '💳', title: 'Tous moyens', text: 'CB, PayPal, Apple Pay...' }
          ].map((item, index) => (
            <div key={index} className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-purple-100 p-6 shadow-xl ring-4 ring-white/50 transform hover:scale-105 transition-transform duration-300'>
              <div className='text-center'>
                <div className='text-5xl mb-3'>{item.icon}</div>
                <h3 className='text-xl font-black text-purple-600 mb-2'>{item.title}</h3>
                <p className='text-gray-700 font-medium'>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-35px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }

        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.4; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(-180deg); }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-twinkle-delayed { animation: twinkle-delayed 4s ease-in-out infinite; }
        .animate-shine { animation: shine 1.5s ease-in-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}
      </style>
    </div>
  )
}
