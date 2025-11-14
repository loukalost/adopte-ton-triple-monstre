'use client'

import { useCallback, useMemo } from 'react'
import Image from 'next/image'
import type { NavigationItem } from '@/types/components'
import Button from './button'

interface HeaderProps {
  /** Indique si l'utilisateur est connecté */
  isLoggedIn?: boolean
}

// ✅ OPTIMISATION 1: Déplacer navigationItems hors du composant (donnée statique)
const NAVIGATION_ITEMS: NavigationItem[] = [
  { href: '#hero', label: 'Accueil' },
  { href: '#benefits', label: 'Avantages' },
  { href: '#monsters', label: 'Créatures' },
  { href: '#actions', label: 'Actions' },
  { href: '#newsletter', label: 'Newsletter' }
]

/**
 * Header navigation component
 *
 * Single Responsibility: Header handles only navigation and branding
 *
 * Optimisations :
 * - Navigation items statiques déplacés hors du composant
 * - useCallback pour mémoriser les handlers
 * - Évite les re-renders inutiles
 */
export default function Header ({ isLoggedIn = false }: HeaderProps): React.ReactNode {
  // ✅ OPTIMISATION 2: Mémoriser le callback du CTA
  const handleCTA = useCallback((): void => {
    window.location.href = isLoggedIn ? '/app' : '/sign-in'
  }, [isLoggedIn])

  // ✅ OPTIMISATION 4: Mémoriser le texte du bouton CTA
  const ctaButtonText = useMemo(() => {
    return isLoggedIn ? 'Mes monstres' : 'Créer mon monstre'
  }, [isLoggedIn])

  return (
    <header className='bg-black text-white shadow-sm sticky top-0 z-50'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <div className='flex items-center space-x-2'>
              <Image
                src='/logo_comp.webp'
                alt='Adopte ton triple monstre Logo'
                width={40}
                height={40}
                className='w-10 h-10'
                priority
              />
              <span className='text-2xl font-bold text-white'>
                Adopte ton triple monstre
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-8'>
              {NAVIGATION_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className='text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors'
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className='flex items-center'>
            <Button variant='primary' size='md' onClick={handleCTA}>
              {ctaButtonText}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
