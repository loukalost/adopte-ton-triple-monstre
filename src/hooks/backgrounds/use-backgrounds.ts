/**
 * Hook pour gérer les arrière-plans de l'utilisateur
 * Respecte SRP: Gestion d'état pour les arrière-plans uniquement
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getUserOwnedBackgrounds } from '@/actions/backgrounds.actions'
import type { OwnedBackground } from '@/types/backgrounds'

interface UseBackgroundsReturn {
  backgrounds: OwnedBackground[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useBackgrounds (): UseBackgroundsReturn {
  const [backgrounds, setBackgrounds] = useState<OwnedBackground[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBackgrounds = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getUserOwnedBackgrounds()

      if (result.success && result.data !== undefined) {
        setBackgrounds(result.data)
        setError(null)
      } else {
        setError(result.error ?? 'Erreur inconnue')
      }
    } catch (err) {
      setError('Erreur lors du chargement')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadBackgrounds()
  }, [loadBackgrounds])

  const refresh = useCallback(async () => {
    await loadBackgrounds()
  }, [loadBackgrounds])

  return {
    backgrounds,
    loading,
    error,
    refresh
  }
}
