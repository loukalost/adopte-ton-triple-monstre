'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

interface BottomNavProps {
  /** Solde du wallet de l'utilisateur */
  walletBalance: number
}

/**
 * Barre de navigation en bas pour mobile et tablette - Version Jeu Vidéo Fun
 *
 * Affiche une navigation de type "app mobile" en bas de l'écran.
 * Design coloré et engageant style jeu vidéo kawaii.
 *
 * Responsabilité unique : Gérer la navigation mobile/tablette de l'application
 */
export default function BottomNav ({ walletBalance }: BottomNavProps): React.ReactNode {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)
      setShowLogoutConfirm(false)

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/sign-in')
            router.refresh()
          },
          onError: (ctx) => {
            console.error('Erreur lors de la déconnexion:', ctx.error)
            router.push('/sign-in')
            router.refresh()
          }
        }
      })
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      window.location.href = '/sign-in'
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (path: string): boolean => {
    return pathname === path
  }

  const navItems = [
    { href: '/app', label: 'Home', icon: '🏠', color: 'bg-[color:var(--color-electric-500)]' },
    { href: '/app/gallery', label: 'Galerie', icon: '🌍', color: 'bg-[color:var(--color-neon-purple-500)]' },
    { href: '/app/wallet', label: String(walletBalance.toLocaleString()), icon: '🪙', color: 'bg-[color:var(--color-neon-purple-400)]', isWallet: true },
    { href: '#logout', label: 'Quitter', icon: '🚪', action: 'logout', color: 'bg-red-500' }
  ]

  const handleNavClick = (item: typeof navItems[0]): void => {
    if (item.action === 'logout') {
      setShowLogoutConfirm(true)
    }
  }

  return (
    <>
      {/* Barre de navigation fixée en bas */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-neutral-100 border-t-2 border-neutral-200 z-50 shadow-lg'>
        <div className='grid grid-cols-4 gap-2 px-3 py-2 safe-area-inset-bottom'>
          {navItems.map((item) => {
            if (item.action === 'logout') {
              return (
                <button
                  key={item.label}
                  onClick={() => { handleNavClick(item) }}
                  className={`flex flex-col items-center justify-center gap-1 py-2 rounded-md font-bold transition-all duration-300 active:scale-95 ${item.color} text-white shadow-md hover:shadow-lg`}
                >
                  <span className='text-xl'>{item.icon}</span>
                  <span className='text-xs'>{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-md font-bold transition-all duration-300 active:scale-95 ${
                  isActive(item.href)
                    ? `${item.color} text-white shadow-lg`
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 hover:shadow-md border border-neutral-200'
                }`}
              >
                <span className='text-xl'>
                  {item.icon}
                </span>
                <span className='text-xs'>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className='md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4 animate-fade-in'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-sm mb-24 animate-slide-up border-2 border-neutral-200'>
            <div className='p-6'>
              <div className='text-center mb-6'>
                <div className='text-5xl mb-3'>👋</div>
                <h3 className='text-xl font-bold text-[color:var(--color-electric-600)] mb-2'>
                  Tu pars déjà ?
                </h3>
                <p className='text-sm text-neutral-600'>
                  Tes créatures vont te manquer ! 😢
                </p>
              </div>

              <div className='flex flex-col gap-3'>
                <button
                  onClick={() => {
                    void handleLogout()
                  }}
                  className='w-full bg-red-500 text-white font-bold text-base py-3 px-4 rounded-md hover:bg-red-600 transition-all duration-300 active:scale-95 shadow-md'
                >
                  <span className='flex items-center justify-center gap-2'>
                    <span className='text-lg'>🚪</span>
                    <span>Oui, me déconnecter</span>
                  </span>
                </button>
                <button
                  onClick={() => { setShowLogoutConfirm(false) }}
                  className='w-full bg-neutral-200 text-neutral-800 font-bold text-base py-3 px-4 rounded-md hover:bg-neutral-300 transition-all duration-300 active:scale-95 shadow-md'
                >
                  <span className='flex items-center justify-center gap-2'>
                    <span className='text-lg'>💖</span>
                    <span>Rester</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles pour les animations */}
      <style jsx>
        {`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }

        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}
      </style>
    </>
  )
}
