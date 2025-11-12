/**
 * Hook pour gérer les accessoires de l'utilisateur
 * Respecte SRP: Gestion d'état pour les accessoires uniquement
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMyAccessories } from '@/actions/accessories.actions'
import type { OwnedAccessory } from '@/types/accessories'

interface UseAccessoriesReturn {
  accessories: OwnedAccessory[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useAccessories (): UseAccessoriesReturn {
  const [accessories, setAccessories] = useState<OwnedAccessory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAccessories = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getMyAccessories()
      setAccessories(data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAccessories()
  }, [loadAccessories])

  const refresh = useCallback(async () => {
    await loadAccessories()
  }, [loadAccessories])

  return {
    accessories,
    loading,
    error,
    refresh
  }
}
