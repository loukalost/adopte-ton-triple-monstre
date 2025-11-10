'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

interface AppHeaderProps {
  /** Solde du wallet de l'utilisateur */
  walletBalance: number
}

/**
 * Header de l'application pour desktop - Version Jeu Vidéo Fun
 *
 * Affiche la navigation principale en haut de l'écran sur les écrans desktop.
 * Design coloré et engageant style jeu vidéo kawaii.
 *
 * Responsabilité unique : Gérer la navigation desktop de l'application
 */
export default function AppHeader ({ walletBalance }: AppHeaderProps): React.ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return // Éviter les double-clics

    try {
      setIsLoggingOut(true)

      // Déconnexion via Better Auth
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // Redirection après succès
            router.push('/sign-in')
            router.refresh() // Force le rafraîchissement pour nettoyer la session
          },
          onError: (ctx) => {
            console.error('Erreur lors de la déconnexion:', ctx.error)
            // Redirection même en cas d'erreur pour éviter un état bloqué
            router.push('/sign-in')
            router.refresh()
          }
        }
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Fallback : redirection forcée
      window.location.href = '/sign-in'
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (path: string): boolean => {
    return pathname === path
  }

  const navItems = [{ href: '/app', label: 'Dashboard', icon: '🏠', color: 'from-purple-400 to-pink-500' }]

  return (
    <header className='hidden md:block bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 border-b-4 border-purple-300 sticky top-0 z-50 shadow-lg'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo - Plus fun */}
          <Link href='/app' className='flex-shrink-0 group'>
            <div className='flex items-center space-x-3 transform transition-transform duration-300 group-hover:scale-110'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity' />
                <Image
                  src='/logo_comp.webp'
                  alt='Tamagotcho Logo'
                  width={48}
                  height={48}
                  className='w-12 h-12 relative rounded-full ring-4 ring-white shadow-lg'
                  priority
                />
              </div>
              <span className='text-3xl font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text'>
                Tamagotcho
              </span>
            </div>
          </Link>

          {/* Navigation + Wallet */}
          <div className='flex items-center space-x-3'>
            {/* Navigation principale */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-black transition-all duration-300 transform hover:scale-110 active:scale-105 ${
                  isActive(item.href)
                    ? `bg-gradient-to-r ${item.color} text-white shadow-xl ring-4 ring-white/50`
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg ring-2 ring-gray-200'
                }`}
              >
                {/* Effet de brillance au hover */}
                {!isActive(item.href) && (
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine' />
                )}

                <span className={`text-3xl relative z-10 ${isActive(item.href) ? 'animate-bounce-slow' : 'group-hover:scale-125 transition-transform duration-300'}`}>
                  {item.icon}
                </span>
                <span className='relative z-10'>{item.label}</span>
              </Link>
            ))}

            {/* Mini Wallet Display */}
            <Link
              href='/app/wallet'
              className='group relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-2xl text-lg font-black transition-all duration-300 transform hover:scale-110 active:scale-105 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl ring-4 ring-yellow-200/50 hover:from-yellow-500 hover:to-orange-600'
            >
              {/* Effet de brillance au hover */}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shine' />

              <span className='text-3xl relative z-10 group-hover:scale-125 transition-transform duration-300'>
                🪙
              </span>
              <span className='relative z-10 text-2xl font-black'>{walletBalance.toLocaleString()}</span>
              <span className='relative z-10 text-sm uppercase tracking-wider opacity-90'>Koins</span>
            </Link>
          </div>

          {/* Actions utilisateur - Plus fun */}
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => { void handleLogout() }}
              disabled={isLoggingOut}
              className='group relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-black bg-gradient-to-r from-red-400 to-rose-500 text-white hover:from-red-500 hover:to-rose-600 transition-all duration-300 transform hover:scale-110 active:scale-105 shadow-xl ring-4 ring-red-200/50 hover:shadow-[0_10px_30px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shine' />
              {isLoggingOut
                ? (
                  <>
                    <span className='text-2xl relative z-10 animate-spin'>⏳</span>
                    <span className='relative z-10'>Déconnexion...</span>
                  </>
                  )
                : (
                  <>
                    <span className='text-2xl relative z-10 group-hover:scale-125 transition-transform duration-300'>🚪</span>
                    <span className='relative z-10'>Quitter</span>
                  </>
                  )}
            </button>
          </div>
        </div>
      </nav>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-shine { animation: shine 1.5s ease-in-out; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}
      </style>
    </header>
  )
}
