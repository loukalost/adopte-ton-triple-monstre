'use client'

import { useEffect } from 'react'
import { updateQuestProgress } from '@/actions/quests.actions'

/**
 * Hook pour marquer la visite de la galerie
 *
 * Responsabilité unique : mettre à jour la quête "visit_gallery" quand le composant est monté
 *
 * @returns {void}
 */
export function useGalleryVisit (): void {
  useEffect(() => {
    // Marquer la visite de la galerie pour la quête
    void updateQuestProgress('visit_gallery', 1)
  }, []) // Ne s'exécute qu'une fois au montage
}
