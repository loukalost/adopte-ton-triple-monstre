// Clean Architecture: Presentation layer imports application components
import ActionsSection from '@/components/sections/actions-section'
import BenefitsSection from '@/components/sections/benefits-section'
import Footer from '@/components/sections/footer'
import HeaderWrapper from '@/components/sections/header-wrapper'
import HeroSection from '@/components/sections/hero-section'
import MonstersSection from '@/components/sections/monsters-section'
import NewsletterSection from '@/components/sections/newsletter-section'
import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { decideHomeRedirect } from '@/services/navigation.service'

export const metadata: Readonly<Metadata> = {
  title: 'ATTM - Adopte Ton Triple Monstre',
  description: 'ATTM (Adopte Ton Triple Monstre) est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !',
  keywords: 'ATTM, Adopte Ton Triple Monstre, monstre virtuel, adoption, jeu, aventure',
  openGraph: {
    title: 'ATTM - Adopte Ton Triple Monstre',
    description: 'ATTM (Adopte Ton Triple Monstre) est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !'
  },
  twitter: {
    title: 'ATTM - Adopte Ton Triple Monstre',
    description: 'ATTM (Adopte Ton Triple Monstre) est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !'
  }
}

/**
 * Page d'accueil avec redirection intelligente
 *
 * Single Responsibility: Orchestrer l'affichage de la landing page OU rediriger vers l'app
 * Dependency Inversion: Dépend du service de navigation (abstraction) pas de Next.js
 *
 * Comportement:
 * - Utilisateur non connecté → Affiche la landing page
 * - Utilisateur connecté → Redirige automatiquement vers /app
 */
export default async function Home (): Promise<React.ReactNode> {
  // Vérification de la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Décision de navigation basée sur le service (domain layer)
  const navigationDecision = decideHomeRedirect({
    isAuthenticated: session !== null && session !== undefined,
    userId: session?.user?.id
  })

  // Si redirection nécessaire, rediriger vers /app
  if (navigationDecision.shouldRedirect) {
    redirect(navigationDecision.path)
  }

  // Sinon, afficher la landing page publique
  return (
    <div className='font-sans'>
      <HeaderWrapper />
      <HeroSection />
      <BenefitsSection />
      <MonstersSection />
      <ActionsSection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
