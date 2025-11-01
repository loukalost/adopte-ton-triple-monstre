// Clean Architecture: Presentation layer imports application components
import ActionsSection from '@/components/sections/actions-section'
import BenefitsSection from '@/components/sections/benefits-section'
import Footer from '@/components/sections/footer'
import Header from '@/components/sections/header'
import HeroSection from '@/components/sections/hero-section'
import MonstersSection from '@/components/sections/monsters-section'
import NewsletterSection from '@/components/sections/newsletter-section'
import { Metadata } from 'next'

export const metadata: Readonly<Metadata> = {
  title: 'Tamagotcho - Adopte et prends soin de ton compagnon virtuel',
  description: 'Tamagotcho est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !',
  keywords: 'Tamagotcho, monstre virtuel, adoption, jeu, aventure',
  openGraph: {
    title: 'Tamagotcho - Adopte et prends soin de ton compagnon virtuel',
    description: 'Tamagotcho est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !'
  },
  twitter: {
    title: 'Tamagotcho - Adopte et prends soin de ton compagnon virtuel',
    description: 'Tamagotcho est une application web où tu peux adopter, nourrir, jouer et faire évoluer ton propre monstre virtuel. Rejoins-nous pour une aventure amusante et interactive !'
  }
}

// Single Responsibility: Home page orchestrates the layout of sections
export default function Home (): React.ReactNode {
  return (
    <div className='font-sans'>
      <Header />
      <HeroSection />
      <BenefitsSection />
      <MonstersSection />
      <ActionsSection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
