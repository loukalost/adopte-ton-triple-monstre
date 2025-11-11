import type React from 'react'
import { Card } from './ui/card'

interface Feature {
  icon: string
  title: string
  text: string
}

const features: Feature[] = [
  { icon: '🔒', title: 'Paiement Sécurisé', text: 'Crypté SSL via Stripe' },
  { icon: '⚡', title: 'Instantané', text: 'Koins ajoutés immédiatement' },
  { icon: '💳', title: 'Tous moyens', text: 'CB, PayPal, Apple Pay...' }
]

/**
 * Composant d'affichage des fonctionnalités de paiement
 * Principe SRP: Responsabilité unique d'affichage des features
 */
export function PaymentFeatures (): React.ReactElement {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
      {features.map((feature, index) => (
        <Card key={index} hover>
          <div className='text-center'>
            <div className='text-2xl mb-2'>{feature.icon}</div>
            <h3 className='text-sm font-bold text-[color:var(--color-electric-600)] mb-1'>{feature.title}</h3>
            <p className='text-xs text-[color:var(--color-neutral-600)]'>{feature.text}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
