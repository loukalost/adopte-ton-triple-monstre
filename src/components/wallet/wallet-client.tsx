'use client'

import { addKoins, subtractKoins, type DBWallet } from '@/actions/wallet.actions'
import { useState, useTransition } from 'react'

interface WalletClientProps {
  initialWallet: DBWallet
}

/**
 * Composant client pour afficher et gérer le wallet de l'utilisateur - Version Jeu Vidéo Fun
 *
 * Fonctionnalités :
 * - Affichage du solde de Koins avec animations spectaculaires
 * - Boutons fun pour ajouter/retirer des Koins
 * - Animations de particules explosives lors des transactions
 * - Design kawaii et engageant
 *
 * @param {WalletClientProps} props - Les propriétés du composant
 * @param {DBWallet} props.initialWallet - Le wallet initial de l'utilisateur
 */
export default function WalletClient ({ initialWallet }: WalletClientProps): JSX.Element {
  const [wallet, setWallet] = useState<DBWallet>(initialWallet)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [animatingAmount, setAnimatingAmount] = useState<number | null>(null)
  const [animationType, setAnimationType] = useState<'add' | 'subtract' | null>(null)

  /**
   * Gère l'ajout de Koins au wallet
   * @param amount - Montant à ajouter
   */
  const handleAddKoins = (amount: number): void => {
    setError(null)
    setAnimatingAmount(amount)
    setAnimationType('add')

    startTransition(async () => {
      try {
        const updatedWallet = await addKoins(amount)
        setWallet(updatedWallet)

        setTimeout(() => {
          setAnimatingAmount(null)
          setAnimationType(null)
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de Koins')
        setAnimatingAmount(null)
        setAnimationType(null)
      }
    })
  }

  /**
   * Gère le retrait de Koins du wallet
   * @param amount - Montant à retirer
   */
  const handleSubtractKoins = (amount: number): void => {
    setError(null)
    setAnimatingAmount(amount)
    setAnimationType('subtract')

    startTransition(async () => {
      try {
        const updatedWallet = await subtractKoins(amount)
        setWallet(updatedWallet)

        setTimeout(() => {
          setAnimatingAmount(null)
          setAnimationType(null)
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du retrait de Koins')
        setAnimatingAmount(null)
        setAnimationType(null)
      }
    })
  }

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

      <div className='relative max-w-5xl mx-auto'>
        {/* En-tête ultra fun */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-4 mb-6'>
            <span className='text-7xl animate-bounce'>💰</span>
            <h1 className='text-6xl font-black text-transparent bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text'>
              Mon Wallet
            </h1>
            <span className='text-7xl animate-bounce' style={{ animationDelay: '0.2s' }}>🪙</span>
          </div>
          <p className='text-2xl font-bold text-orange-600 flex items-center justify-center gap-3'>
            <span className='text-3xl'>✨</span>
            Gérez vos précieux Koins !
            <span className='text-3xl'>✨</span>
          </p>
        </div>

        {/* Carte principale du wallet - GROSSE ET VISIBLE */}
        <div className='relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white via-yellow-50 to-orange-100 p-12 mb-12 shadow-[0_30px_90px_rgba(0,0,0,0.25)] ring-8 ring-white/80'>
          {/* Effet de fond animé */}
          <div className='absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-orange-200/30 to-red-200/30 animate-pulse-slow' />

          {/* Particules d'animation */}
          {animatingAmount !== null && (
            <>
              <div className='absolute inset-0 pointer-events-none'>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute text-4xl animate-explode-particle ${
                      animationType === 'add' ? 'text-green-500' : 'text-red-500'
                    }`}
                    style={{
                      left: '50%',
                      top: '40%',
                      animationDelay: `${i * 0.1}s`,
                      transform: `rotate(${i * 30}deg)`
                    }}
                  >
                    {animationType === 'add' ? '💚' : '💔'}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className='relative z-10'>
            {/* Affichage du solde - ÉNORME */}
            <div className='text-center mb-12'>
              <p className='text-xl font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center justify-center gap-2'>
                <span className='text-2xl'>💎</span>
                Ton Trésor
                <span className='text-2xl'>💎</span>
              </p>
              <div className='flex items-center justify-center gap-6'>
                <span className='text-8xl animate-spin-slow'>🪙</span>
                <div className='relative'>
                  <h2 className='text-9xl font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text drop-shadow-2xl'>
                    {wallet.balance.toLocaleString('fr-FR')}
                  </h2>

                  {/* Animation de changement de montant - EXPLOSIVE */}
                  {animatingAmount !== null && (
                    <div
                      className={`absolute top-0 left-full ml-8 text-6xl font-black animate-explode ${
                        animationType === 'add' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {animationType === 'add' ? '+' : '-'}
                      {animatingAmount}
                    </div>
                  )}
                </div>
                <span className='text-8xl animate-spin-slow' style={{ animationDelay: '1s' }}>🪙</span>
              </div>
              <p className='text-3xl font-black text-orange-600 mt-6'>
                {wallet.balance === 0 && 'Koin'}
                {wallet.balance === 1 && 'Koin'}
                {wallet.balance > 1 && 'Koins'}
              </p>
            </div>

            {/* Message d'erreur */}
            {error !== null && (
              <div className='bg-red-100 border-4 border-red-300 text-red-700 px-8 py-5 rounded-3xl mb-8 text-center text-xl font-bold shadow-xl'>
                <span className='text-4xl mr-3'>⚠️</span>
                {error}
              </div>
            )}

            {/* Boutons d'action - GROS ET FUN */}
            <div className='border-t-4 border-orange-300 pt-10'>
              <p className='text-center text-orange-700 text-xl font-bold mb-6 flex items-center justify-center gap-2'>
                <span className='text-2xl'>🎮</span>
                Boutons Magiques de Test
                <span className='text-2xl'>🎮</span>
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Bouton Ajouter */}
                <div className='space-y-4'>
                  <p className='text-center text-2xl font-black text-green-600 flex items-center justify-center gap-2'>
                    <span className='text-3xl'>💚</span>
                    Gagner des Koins
                  </p>
                  <div className='flex flex-col gap-4'>
                    {[10, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => { handleAddKoins(amount) }}
                        disabled={isPending}
                        className='group relative overflow-hidden bg-gradient-to-r from-green-400 via-emerald-500 to-green-500 hover:from-green-500 hover:via-emerald-600 hover:to-green-600 text-white font-black text-2xl py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl ring-4 ring-green-200/50 hover:shadow-[0_20px_50px_rgba(34,197,94,0.4)] active:scale-105'
                      >
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shine' />
                        <span className='relative flex items-center justify-center gap-3'>
                          <span className='text-4xl'>➕</span>
                          <span>{amount}</span>
                          <span className='text-4xl'>🪙</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bouton Retirer */}
                <div className='space-y-4'>
                  <p className='text-center text-2xl font-black text-red-600 flex items-center justify-center gap-2'>
                    <span className='text-3xl'>💔</span>
                    Dépenser des Koins
                  </p>
                  <div className='flex flex-col gap-4'>
                    {[10, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => { handleSubtractKoins(amount) }}
                        disabled={isPending || wallet.balance < amount}
                        className='group relative overflow-hidden bg-gradient-to-r from-red-400 via-rose-500 to-red-500 hover:from-red-500 hover:via-rose-600 hover:to-red-600 text-white font-black text-2xl py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl ring-4 ring-red-200/50 hover:shadow-[0_20px_50px_rgba(239,68,68,0.4)] active:scale-105'
                      >
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shine' />
                        <span className='relative flex items-center justify-center gap-3'>
                          <span className='text-4xl'>➖</span>
                          <span>{amount}</span>
                          <span className='text-4xl'>🪙</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicateur de chargement */}
          {isPending && (
            <div className='absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-20 rounded-[3rem]'>
              <div className='text-center'>
                <div className='inline-block animate-spin-fast text-9xl mb-4'>🪙</div>
                <p className='text-3xl font-black text-orange-600'>Traitement...</p>
              </div>
            </div>
          )}
        </div>

        {/* Informations supplémentaires - Fun */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            { icon: '📅', label: 'Créé le', value: new Date(wallet.createdAt).toLocaleDateString('fr-FR'), color: 'from-blue-400 to-cyan-500' },
            { icon: '🔄', label: 'Mis à jour le', value: new Date(wallet.updatedAt).toLocaleDateString('fr-FR'), color: 'from-purple-400 to-pink-500' },
            {
              icon: wallet.balance > 100 ? '🤑' : wallet.balance > 50 ? '😊' : '😅',
              label: 'Statut',
              value: wallet.balance > 100 ? 'Riche !' : wallet.balance > 50 ? 'Confortable' : 'Économe',
              color: 'from-yellow-400 to-orange-500'
            }
          ].map((item, index) => (
            <div key={index} className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.color} p-8 shadow-2xl ring-4 ring-white/50 transform hover:scale-105 transition-transform duration-300`}>
              <div className='text-center'>
                <div className='text-6xl mb-3'>{item.icon}</div>
                <p className='text-sm font-bold text-white/90 uppercase mb-2'>{item.label}</p>
                <p className='text-xl font-black text-white drop-shadow-lg'>
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
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

        @keyframes explode {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(3) translateY(-150px); }
        }

        @keyframes explode-particle {
          0% { opacity: 0; transform: translate(0, 0) scale(0); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translate(0, -200px) scale(1.5); }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-fast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(720deg); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-twinkle-delayed { animation: twinkle-delayed 4s ease-in-out infinite; }
        .animate-explode { animation: explode 2s ease-out forwards; }
        .animate-explode-particle { animation: explode-particle 1.5s ease-out forwards; }
        .animate-shine { animation: shine 1.5s ease-in-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-fast { animation: spin-fast 1s linear infinite; }
      `}
      </style>
    </div>
  )
}
