import Link from 'next/link'
import { PixelMonster } from '@/components/monsters'
import { MonsterStateBadge, isMonsterState } from './monster-state-badge'
import type { MonsterState } from '@/types/monster'
import { parseMonsterTraits, formatAdoptionDate } from '@/lib/utils'

/**
 * Props pour le composant MonsterCard
 */
interface MonsterCardProps {
  /** Identifiant unique du monstre */
  id: string
  /** Nom du monstre */
  name: string
  /** Traits visuels du monstre (JSON stringifié) */
  traits: string
  /** État/humeur actuel du monstre */
  state: MonsterState | string | null | undefined
  /** Niveau du monstre */
  level: number | null | undefined
  /** Date de création du monstre */
  createdAt: string | undefined
  /** Date de dernière mise à jour du monstre */
  updatedAt: string | undefined
}

/**
 * Carte d'affichage d'un monstre individuel - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : afficher les informations visuelles
 * et textuelles d'un monstre dans un format carte cliquable super mignon.
 *
 * Nouveau design :
 * - Plus grande et plus visible
 * - Animations fun et engageantes
 * - Effets de hover spectaculaires
 * - Style jeu vidéo coloré
 *
 * @param {MonsterCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de monstre interactive
 */
export function MonsterCard ({
  id,
  name,
  traits: rawTraits,
  state,
  level,
  createdAt,
  updatedAt
}: MonsterCardProps): React.ReactNode {
  // Parsing des traits et normalisation des données
  const traits = parseMonsterTraits(rawTraits)
  const adoptionDate = formatAdoptionDate(String(createdAt) ?? String(updatedAt))
  const levelLabel = level ?? 1

  return (
    <Link href={`/creatures/${id}`}>
      <article
        className='group relative flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow-md border-2 border-[color:var(--color-neutral-200)] transition-all duration-300 hover:shadow-lg hover:border-[color:var(--color-electric-400)] cursor-pointer'
      >
        <div className='relative flex flex-col gap-4'>
          {/* Zone de rendu du monstre */}
          <div className='relative flex items-center justify-center overflow-hidden rounded-lg bg-[color:var(--color-neutral-50)] p-6 shadow-sm border border-[color:var(--color-neutral-200)] transition-all duration-300 min-h-[200px]'>
            {traits !== null && (
              <div className='relative transform transition-transform duration-300 group-hover:scale-110'>
                <PixelMonster
                  traits={traits}
                  state={isMonsterState(state) ? state : 'happy'}
                  level={levelLabel}
                />
              </div>
            )}

            {/* Badge d'état */}
            <div className='absolute top-2 left-2'>
              <MonsterStateBadge state={state} />
            </div>
          </div>

          {/* Informations textuelles */}
          <div className='flex flex-1 flex-col gap-3 relative'>
            <div className='flex items-start justify-between gap-3'>
              <div className='space-y-1 flex-1'>
                <h3 className='text-lg font-bold text-[color:var(--color-electric-600)] group-hover:text-[color:var(--color-electric-700)] transition-colors'>
                  {name}
                </h3>
                {adoptionDate !== null && (
                  <p className='text-xs text-neutral-600 flex items-center gap-1'>
                    <span className='text-sm'>🗓️</span>
                    Arrivé le {adoptionDate}
                  </p>
                )}
              </div>

              {/* Badge de niveau */}
              <div className='relative'>
                <span className='inline-flex items-center gap-1 rounded-md bg-[color:var(--color-electric-500)] px-3 py-2 text-xs font-bold uppercase text-white shadow-sm'>
                  <span className='text-base' aria-hidden='true'>⭐</span>
                  <span>Niv. {levelLabel}</span>
                </span>
              </div>
            </div>

            {/* Barre de progression */}
            <div className='flex items-center gap-2 bg-neutral-100 rounded-full p-2 border border-neutral-200'>
              <span className='text-base'>💪</span>
              <div className='flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-[color:var(--color-electric-500)] rounded-full transition-all duration-500'
                  style={{ width: `${Math.min(levelLabel * 10, 100)}%` }}
                />
              </div>
              <span className='text-xs font-bold text-neutral-700'>{Math.min(levelLabel * 10, 100)}%</span>
            </div>

            {/* Bouton d'action */}
            <div className='mt-1 text-center'>
              <div className='inline-flex items-center gap-1 text-[color:var(--color-electric-600)] text-sm font-bold group-hover:text-[color:var(--color-electric-700)] transition-colors'>
                <span>Voir plus</span>
                <span className='text-base group-hover:translate-x-1 transition-transform duration-300'>→</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Styles pour les animations simplifiées */}
      <style jsx>{`
        /* Animations minimales gardées uniquement pour les interactions */
      `}
      </style>
    </Link>
  )
}
