'use client'

import { useEffect, useState } from 'react'
import { QuestCard } from './quest-card'
import type { EnrichedQuest } from '@/types/quest'

/**
 * Props pour le composant DailyQuests
 */
interface DailyQuestsProps {
  /** Quêtes initiales chargées côté serveur */
  initialQuests: EnrichedQuest[]
}

/**
 * Composant de section pour afficher les quêtes journalières
 *
 * Responsabilité unique : orchestrer l'affichage et l'état des quêtes du jour
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement l'affichage de la section quêtes
 * - OCP : Extensible pour ajouter des fonctionnalités (filtres, etc.)
 * - DIP : Dépend de l'abstraction EnrichedQuest
 *
 * @param {DailyQuestsProps} props - Props du composant
 * @returns {React.ReactNode} Section des quêtes journalières
 */
export function DailyQuests ({ initialQuests }: DailyQuestsProps): React.ReactNode {
  const [quests] = useState<EnrichedQuest[]>(initialQuests)
  const [completedCount, setCompletedCount] = useState(0)

  // Mettre à jour le compteur de quêtes complétées
  useEffect(() => {
    const count = quests.filter(q => q.completed).length
    setCompletedCount(count)
  }, [quests])

  return (
    <section className='w-full space-y-4'>
      {/* Header de la section */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <span className='text-3xl' aria-hidden='true'>🎯</span>
          <div>
            <h2 className='text-2xl font-bold text-[color:var(--color-electric-600)]'>
              Quêtes du Jour
            </h2>
            <p className='text-sm text-[color:var(--color-neutral-600)]'>
              Complète les quêtes pour gagner des Koins
            </p>
          </div>
        </div>

        {/* Compteur de progression */}
        <div className='hidden sm:flex items-center gap-2 px-4 py-2 bg-[color:var(--color-electric-100)] rounded-lg border-2 border-[color:var(--color-electric-400)]'>
          <span className='text-2xl' aria-hidden='true'>
            {completedCount === quests.length ? '🏆' : '📊'}
          </span>
          <div className='text-right'>
            <div className='text-xs text-[color:var(--color-electric-600)] font-medium'>
              Progression
            </div>
            <div className='text-lg font-bold text-[color:var(--color-electric-700)]'>
              {completedCount}/{quests.length}
            </div>
          </div>
        </div>
      </div>

      {/* Message de progression mobile */}
      <div className='sm:hidden flex items-center justify-between px-4 py-3 bg-[color:var(--color-electric-100)] rounded-lg border-2 border-[color:var(--color-electric-400)]'>
        <span className='text-sm text-[color:var(--color-electric-600)] font-medium'>
          Progression du jour
        </span>
        <div className='flex items-center gap-2'>
          <span className='text-xl' aria-hidden='true'>
            {completedCount === quests.length ? '🏆' : '📊'}
          </span>
          <span className='text-base font-bold text-[color:var(--color-electric-700)]'>
            {completedCount}/{quests.length}
          </span>
        </div>
      </div>

      {/* Message de félicitations si toutes les quêtes sont complétées */}
      {completedCount === quests.length && quests.length > 0 && (
        <div className='bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-4 shadow-md'>
          <div className='flex items-center gap-3'>
            <span className='text-4xl' aria-hidden='true'>🎉</span>
            <div>
              <h3 className='text-lg font-bold text-green-700'>
                Toutes les quêtes complétées !
              </h3>
              <p className='text-sm text-green-600 mt-1'>
                Félicitations ! Reviens demain pour de nouvelles quêtes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {quests.length === 0 && (
        <div className='bg-white rounded-lg p-8 border-2 border-dashed border-[color:var(--color-neutral-300)] text-center'>
          <div className='space-y-3'>
            <div className='text-5xl' aria-hidden='true'>📝</div>
            <h3 className='text-lg font-bold text-[color:var(--color-neutral-700)]'>
              Aucune quête disponible
            </h3>
            <p className='text-sm text-[color:var(--color-neutral-600)]'>
              Les quêtes seront renouvelées à minuit.
            </p>
          </div>
        </div>
      )}

      {/* Grille de quêtes */}
      {quests.length > 0 && (
        <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {quests.map((quest) => (
            <QuestCard key={quest.questId} quest={quest} />
          ))}
        </div>
      )}

      {/* Info de renouvellement */}
      {quests.length > 0 && (
        <div className='text-center py-2'>
          <p className='text-xs text-[color:var(--color-neutral-500)] flex items-center justify-center gap-1'>
            <span aria-hidden='true'>🕐</span>
            <span>Les quêtes se renouvellent chaque jour à minuit</span>
          </p>
        </div>
      )}
    </section>
  )
}
