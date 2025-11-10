
/**
 * Types et interfaces pour le système de wallet
 */

export interface WalletPackage {
  amount: number
  price: number
  emoji: string
  color: string
  badge: string
  popular: boolean
}

export interface InfoCardData {
  icon: string
  title: string
  text: string
}

export type PaymentStatus = 'success' | 'error' | null
