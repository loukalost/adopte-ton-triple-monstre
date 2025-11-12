/**
 * Hook pour équiper/retirer des accessoires
 * Respecte SRP: Gestion des mutations uniquement
 */

'use client'

import { useState, useCallback } from 'react'
import {
  equipAccessory as equipAccessoryAction,
  unequipAccessory as unequipAccessoryAction
} from '@/actions/accessories.actions'
import { useAccessories } from './use-accessories'

interface UseEquipAccessoryReturn {
  equipAccessory: (accessoryDbId: string, monsterId: string) => Promise<{ success: boolean, error?: string }>
  unequipAccessory: (accessoryDbId: string) => Promise<{ success: boolean, error?: string }>
  isEquipping: boolean
}

export function useEquipAccessory (): UseEquipAccessoryReturn {
  const [isEquipping, setIsEquipping] = useState(false)
  const { refresh } = useAccessories()

  const equipAccessory = useCallback(async (accessoryDbId: string, monsterId: string) => {
    setIsEquipping(true)
    try {
      const result = await equipAccessoryAction(accessoryDbId, monsterId)
      if (result.success) {
        await refresh()
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error equipping accessory:', error)
      return { success: false, error: 'Erreur inattendue' }
    } finally {
      setIsEquipping(false)
    }
  }, [refresh])

  const unequipAccessory = useCallback(async (accessoryDbId: string) => {
    setIsEquipping(true)
    try {
      const result = await unequipAccessoryAction(accessoryDbId)
      if (result.success) {
        await refresh()
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error unequipping accessory:', error)
      return { success: false, error: 'Erreur inattendue' }
    } finally {
      setIsEquipping(false)
    }
  }, [refresh])

  return {
    equipAccessory,
    unequipAccessory,
    isEquipping
  }
}
