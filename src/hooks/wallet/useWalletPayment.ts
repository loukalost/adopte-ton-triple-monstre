
import { useState } from 'react'

interface UseWalletPaymentReturn {
  isPurchasing: boolean
  error: string | null
  handlePurchase: (amount: number) => Promise<void>
  clearError: () => void
}

/**
 * Hook personnalisé pour gérer la logique de paiement du wallet
 * Principe SRP: Responsabilité unique de gestion des paiements
 *
 * @returns {UseWalletPaymentReturn} État et fonctions de paiement
 */
export function useWalletPayment (): UseWalletPaymentReturn {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Gère l'achat de Koins via Stripe
   * @param amount - Montant de Koins à acheter
   */
  const handlePurchase = async (amount: number): Promise<void> => {
    setError(null)
    setIsPurchasing(true)

    try {
      const response = await fetch('/api/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement')
      }

      const { url } = await response.json()

      if (url !== null && url !== undefined && url !== '') {
        window.location.href = url
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'achat de Koins')
      setIsPurchasing(false)
    }
  }

  /**
   * Efface le message d'erreur
   */
  const clearError = (): void => {
    setError(null)
  }

  return {
    isPurchasing,
    error,
    handlePurchase,
    clearError
  }
}
