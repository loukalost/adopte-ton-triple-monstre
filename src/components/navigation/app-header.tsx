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

  const navItems = [{ href: '/app', label: 'Dashboard', icon: '🏠' }]

  return (
    <header className='hidden md:block bg-[color:var(--color-neutral-100)] border-b-2 border-[color:var(--color-neutral-300)] sticky top-0 z-50 shadow-sm'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/app' className='flex-shrink-0 group'>
            <div className='flex items-center space-x-2 transform transition-transform duration-200 group-hover:scale-105'>
              <div className='relative'>
                <Image
                  src='/logo_comp.webp'
                  alt='ATTM Logo'
                  width={32}
                  height={32}
                  className='w-8 h-8 relative rounded-full shadow-sm'
                  priority
                />
              </div>
              <span className='text-lg font-bold text-[color:var(--color-electric-600)]'>
                ATTM
              </span>
            </div>
          </Link>

          {/* Navigation + Wallet */}
          <div className='flex items-center space-x-2'>
            {/* Navigation principale */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-[color:var(--color-electric-500)] text-white shadow-sm'
                    : 'bg-white text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-50)] border border-[color:var(--color-neutral-200)]'
                }`}
              >
                <span className='text-lg'>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Mini Wallet Display */}
            <Link
              href='/app/wallet'
              className='flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-[color:var(--color-electric-500)] text-white hover:bg-[color:var(--color-electric-600)] shadow-sm'
            >
              <span className='text-lg'>
                🪙
              </span>
              <span className='font-bold'>{walletBalance.toLocaleString()}</span>
              <span className='text-xs uppercase opacity-90'>Koins</span>
            </Link>
          </div>

          {/* Actions utilisateur */}
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => { void handleLogout() }}
              disabled={isLoggingOut}
              className='flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoggingOut
                ? (
                  <>
                    <span className='text-base animate-spin'>⏳</span>
                    <span>Déconnexion...</span>
                  </>
                  )
                : (
                  <>
                    <span className='text-base'>🚪</span>
                    <span>Quitter</span>
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
