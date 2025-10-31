// Clean Architecture: Presentation layer imports application components
import BenefitsSection from '@/components/sections/benefits-section'
import ActionsSection from '@/components/sections/actions-section'
import Header from '@/components/sections/Header'
import Footer from '@/components/sections/Footer'
import HeroSection from '@/components/sections/hero-section'
import MonstersSection from '@/components/sections/monsters-section'
import NewsletterSection from '@/components/sections/newsletter-section'

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
