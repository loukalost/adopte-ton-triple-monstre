/**
 * Hook pour appliquer/retirer des arrière-plans
 * Respecte SRP: Gestion des mutations uniquement
 */

'use client'

import { useState, useCallback } from 'react'
import {
  applyBackgroundToMonster,
  removeBackgroundFromMonster
} from '@/actions/backgrounds.actions'

interface UseApplyBackgroundReturn {
  applyBackground: (backgroundId: string, monsterId: string) => Promise<{ success: boolean, error?: string }>
  removeBackground: (monsterId: string) => Promise<{ success: boolean, error?: string }>
  isApplying: boolean
}

export function useApplyBackground (): UseApplyBackgroundReturn {
  const [isApplying, setIsApplying] = useState(false)

  const applyBackground = useCallback(async (backgroundId: string, monsterId: string) => {
    setIsApplying(true)
    try {
      const result = await applyBackgroundToMonster(monsterId, backgroundId)
      if (result.success) {
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error applying background:', error)
      return { success: false, error: 'Erreur inattendue' }
    } finally {
      setIsApplying(false)
    }
  }, [])

  const removeBackground = useCallback(async (monsterId: string) => {
    setIsApplying(true)
    try {
      const result = await removeBackgroundFromMonster(monsterId)
      if (result.success) {
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error removing background:', error)
      return { success: false, error: 'Erreur inattendue' }
    } finally {
      setIsApplying(false)
    }
  }, [])

  return {
    applyBackground,
    removeBackground,
    isApplying
  }
}
