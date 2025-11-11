import type { Quest } from '@/hooks/dashboard'

/**
 * Props pour le composant QuestsSection
 */
interface QuestsSectionProps {
  /** Liste des quêtes avec leur état de complétion */
  quests: Quest[]
}

/**
 * Section affichant les quêtes quotidiennes du dashboard
 *
 * Responsabilité unique : afficher la liste des quêtes
 * avec leur état de complétion visuel.
 *
 * @param {QuestsSectionProps} props - Props du composant
 * @returns {React.ReactNode} Section des quêtes
 *
 * @example
 * <QuestsSection quests={quests} />
 */
export function QuestsSection ({ quests }: QuestsSectionProps): React.ReactNode {
  return (
    <div className='rounded-3xl bg-white/80 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur'>
      <div className='flex items-center gap-3'>
        <span className='flex h-10 w-10 items-center justify-center rounded-full bg-electric-100 text-2xl'>
          🪄
        </span>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.2em] text-electric-500'>
            Quêtes du jour
          </p>
          <p className='text-base text-slate-600'>À toi de jouer !</p>
        </div>
      </div>

      <ul className='mt-5 space-y-4'>
        {quests.map((quest) => (
          <li key={quest.id} className='flex items-start gap-3'>
            <span
              className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-lg ${
                quest.complete
                  ? 'bg-neon-purple-100 text-neon-purple-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {quest.complete ? '✨' : '•'}
            </span>
            <div>
              <p className='text-sm font-medium text-slate-800'>{quest.label}</p>
              <p className='text-xs text-slate-500'>
                {quest.complete ? 'Mission accomplie !' : 'Clique et amuse-toi pour valider.'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
