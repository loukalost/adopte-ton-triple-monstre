// Clean Architecture: Presentation layer imports application components
import ActionsSection from '@/components/sections/actions-section'
import BenefitsSection from '@/components/sections/benefits-section'
import Footer from '@/components/sections/footer'
import HeaderWrapper from '@/components/sections/header-wrapper'
import HeroSection from '@/components/sections/hero-section'
import MonstersSection from '@/components/sections/monsters-section'
import NewsletterSection from '@/components/sections/newsletter-section'
import { Metadata } from 'next'

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

// Single Responsibility: Home page orchestrates the layout of sections
export default function Home (): React.ReactNode {
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
