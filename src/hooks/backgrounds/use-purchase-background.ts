/**
 * Hook pour gérer l'achat d'arrière-plans
 * Respecte SRP: Gestion de la logique d'achat uniquement
 */

'use client'

import { useState, useCallback } from 'react'
import { purchaseBackground as purchaseBackgroundAction } from '@/actions/backgrounds.actions'
import { useBackgrounds } from './use-backgrounds'

interface UsePurchaseBackgroundReturn {
  purchaseBackground: (backgroundId: string) => Promise<{ success: boolean, error?: string }>
  isPurchasing: boolean
}

export function usePurchaseBackground (): UsePurchaseBackgroundReturn {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { refresh } = useBackgrounds()

  const purchaseBackground = useCallback(async (backgroundId: string) => {
    setIsPurchasing(true)
    try {
      const result = await purchaseBackgroundAction(backgroundId)
      if (result.success) {
        await refresh()
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error purchasing background:', error)
      return { success: false, error: 'Erreur inattendue' }
    } finally {
      setIsPurchasing(false)
    }
  }, [refresh])

  return {
    purchaseBackground,
    isPurchasing
  }
}
