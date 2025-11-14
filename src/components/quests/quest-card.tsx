'use client'

import { useMemo, useState, useTransition } from 'react'
import type { EnrichedQuest } from '@/types/quest'
import { claimQuestReward } from '@/actions/quests.actions'

/**
 * Props pour le composant QuestCard
 */
interface QuestCardProps {
  /** Quête enrichie à afficher */
  quest: EnrichedQuest
}

/**
 * Composant carte pour afficher une quête journalière
 *
 * Responsabilité unique : afficher une seule quête avec sa progression
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement l'affichage d'une quête
 * - OCP : Extensible pour ajouter des variantes visuelles
 * - LSP : Peut être substitué par d'autres cartes de quête
 *
 * @param {QuestCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de quête
 */
export function QuestCard ({ quest }: QuestCardProps): React.ReactNode {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  // Initialiser avec la valeur serveur pour persister l'état entre les navigations
  const [hasClaimed, setHasClaimed] = useState(quest.claimed)

  // Calculer le pourcentage de progression
  const progressPercentage = useMemo(() => {
    return Math.min((quest.current / quest.target) * 100, 100)
  }, [quest.current, quest.target])

  // Détermine si la récompense a été réclamée (depuis les props ou l'état local)
  const isClaimed = quest.claimed || hasClaimed

  const handleClaimReward = (): void => {
    startTransition(async () => {
      setError(null)
      const result = await claimQuestReward(quest.questId)
      if (!result.success) {
        setError(result.error ?? 'Erreur lors de la réclamation')
      } else {
        // Marquer comme réclamée localement pour désactiver immédiatement le bouton
        setHasClaimed(true)
      }
    })
  }

  return (
    <article
      className={`relative overflow-hidden rounded-lg border-2 p-4 transition-all duration-300 ${
        quest.completed
          ? 'bg-green-50 border-green-400 shadow-md'
          : 'bg-white border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-electric-400)] hover:shadow-lg'
      }`}
    >
      {/* Badge complété */}
      {quest.completed && (
        <div className='absolute top-2 right-2 z-10'>
          <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm'>
            <span aria-hidden='true'>✅</span>
            <span>Complété</span>
          </span>
        </div>
      )}

      <div className='flex flex-col gap-3'>
        {/* Header avec icône et titre */}
        <div className='flex items-start gap-3'>
          <div className='text-3xl flex-shrink-0' aria-hidden='true'>
            {quest.icon}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-base font-bold text-[color:var(--color-electric-600)] truncate'>
              {quest.title}
            </h3>
            <p className='text-sm text-[color:var(--color-neutral-600)] mt-1'>
              {quest.description}
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <span className='text-[color:var(--color-neutral-700)] font-medium'>
              Progression
            </span>
            <span className='text-[color:var(--color-electric-600)] font-bold'>
              {quest.current} / {quest.target}
            </span>
          </div>

          {/* Barre de progression visuelle */}
          <div className='relative w-full h-3 bg-[color:var(--color-neutral-200)] rounded-full overflow-hidden'>
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full ${
                quest.completed
                  ? 'bg-green-500'
                  : 'bg-gradient-to-r from-[color:var(--color-electric-400)] to-[color:var(--color-electric-600)]'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Récompense */}
        <div className='flex items-center justify-between pt-2 border-t border-[color:var(--color-neutral-200)]'>
          <span className='text-sm text-[color:var(--color-neutral-600)] font-medium'>
            Récompense
          </span>
          {quest.completed && !isClaimed
            ? (
              <button
                onClick={handleClaimReward}
                disabled={isPending || hasClaimed}
                className='flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-[color:var(--color-electric-500)] to-[color:var(--color-electric-600)] hover:from-[color:var(--color-electric-600)] hover:to-[color:var(--color-electric-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg'
              >
                <span className='text-lg' aria-hidden='true'>🪙</span>
                <span className='text-sm'>Réclamer +{quest.reward} Koins</span>
              </button>
              )
            : isClaimed
              ? (
                <div className='flex items-center gap-1 text-green-600'>
                  <span className='text-lg' aria-hidden='true'>✅</span>
                  <span className='text-sm font-bold'>Réclamé</span>
                </div>
                )
              : (
                <div className='flex items-center gap-1'>
                  <span className='text-lg' aria-hidden='true'>🪙</span>
                  <span className='text-base font-bold text-[color:var(--color-electric-600)]'>
                    +{quest.reward} Koins
                  </span>
                </div>
                )}
        </div>

        {/* Message d'erreur */}
        {error !== null && (
          <div className='mt-2 p-2 rounded bg-red-50 border border-red-200'>
            <p className='text-xs text-red-600'>{error}</p>
          </div>
        )}
      </div>
    </article>
  )
}
