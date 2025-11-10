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
    <Link href={`/creature/${id}`}>
      <article
        className='group relative flex flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-4 ring-white/80 transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgb(0,0,0,0.2)] hover:ring-yellow-300 cursor-pointer'
      >
        {/* Effet brillant qui traverse la carte au hover */}
        <div className='pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 group-hover:animate-shine' />
        </div>

        {/* Bulles décoratives animées */}
        <div
          className='pointer-events-none absolute -right-12 top-10 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-80 animate-float'
          aria-hidden='true'
        />
        <div
          className='pointer-events-none absolute -left-16 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-pink-300/30 to-purple-300/30 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-80 animate-float-delayed'
          aria-hidden='true'
        />

        {/* Étoiles décoratives */}
        <div className='pointer-events-none absolute top-4 right-4 text-yellow-400 text-2xl animate-twinkle'>✨</div>
        <div className='pointer-events-none absolute bottom-4 left-4 text-pink-400 text-xl animate-twinkle-delayed'>💖</div>

        <div className='relative flex flex-col gap-6'>
          {/* Zone de rendu du monstre - PLUS GRANDE */}
          <div className='relative flex items-center justify-center overflow-hidden rounded-3xl bg-white/80 p-8 ring-4 ring-white/90 shadow-inner backdrop-blur-sm group-hover:bg-white/90 transition-all duration-300 min-h-[280px]'>
            {/* Effet de fond pulsant */}
            <div className='absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-pink-100/50 to-purple-100/50 animate-pulse-slow' />

            {traits !== null && (
              <div className='relative transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3'>
                <PixelMonster
                  traits={traits}
                  state={isMonsterState(state) ? state : 'happy'}
                  level={levelLabel}
                />
              </div>
            )}

            {/* Badge d'état - Plus visible */}
            <div className='absolute top-3 left-3 transform transition-transform duration-300 group-hover:scale-110'>
              <MonsterStateBadge state={state} />
            </div>

            {/* Effet de particules au hover */}
            <div className='absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
              <div className='absolute top-10 left-10 text-2xl animate-float-particle'>⭐</div>
              <div className='absolute top-20 right-12 text-2xl animate-float-particle-delayed'>✨</div>
              <div className='absolute bottom-12 left-16 text-2xl animate-float-particle'>💫</div>
            </div>
          </div>

          {/* Informations textuelles - PLUS GRANDES */}
          <div className='flex flex-1 flex-col gap-4 relative'>
            <div className='flex items-start justify-between gap-4'>
              <div className='space-y-2 flex-1'>
                <h3 className='text-2xl font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text group-hover:scale-105 transition-transform duration-300 origin-left'>
                  {name}
                </h3>
                {adoptionDate !== null && (
                  <p className='text-sm font-medium text-purple-600/80 flex items-center gap-2'>
                    <span className='text-lg'>🗓️</span>
                    Arrivé le {adoptionDate}
                  </p>
                )}
              </div>

              {/* Badge de niveau - Plus imposant */}
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity' />
                <span className='relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 px-5 py-3 text-base font-black uppercase tracking-wider text-white shadow-lg ring-2 ring-white/50 group-hover:scale-110 transition-transform duration-300'>
                  <span className='text-2xl animate-bounce-slow' aria-hidden='true'>⭐</span>
                  <span>Niveau {levelLabel}</span>
                </span>
              </div>
            </div>

            {/* Barre de progression fun */}
            <div className='flex items-center gap-3 bg-white/60 rounded-full p-3 ring-2 ring-white/80'>
              <span className='text-xl'>💪</span>
              <div className='flex-1 h-3 bg-gray-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full transition-all duration-500 animate-gradient'
                  style={{ width: `${Math.min(levelLabel * 10, 100)}%` }}
                />
              </div>
              <span className='text-sm font-bold text-purple-600'>{Math.min(levelLabel * 10, 100)}%</span>
            </div>

            {/* Bouton d'action visible */}
            <div className='mt-2 text-center'>
              <div className='inline-flex items-center gap-2 text-purple-600 font-bold group-hover:text-pink-600 transition-colors'>
                <span>Voir plus</span>
                <span className='text-xl group-hover:translate-x-2 transition-transform duration-300'>→</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) rotate(180deg);
            opacity: 0;
          }
        }

        @keyframes float-particle-delayed {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) rotate(-180deg);
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes twinkle-delayed {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.9) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotate(180deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-shine {
          animation: shine 2s ease-in-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 2s ease-out infinite;
        }

        .animate-float-particle-delayed {
          animation: float-particle-delayed 2.5s ease-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-twinkle-delayed {
          animation: twinkle-delayed 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}
      </style>
    </Link>
  )
}
