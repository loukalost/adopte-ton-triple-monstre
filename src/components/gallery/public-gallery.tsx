'use client'

import { useMemo } from 'react'
import { PixelMonster } from '@/components/monsters'
import { MonsterStateBadge, isMonsterState } from '@/components/monsters/monster-state-badge'
import type { DBMonster } from '@/types/monster'
import { parseMonsterTraits } from '@/lib/utils'
import BackgroundRenderer from '@/components/backgrounds/background-renderer'
import { getBackgroundById } from '@/config/backgrounds.config'

/**
 * Props pour le composant PublicMonsterCard
 */
interface PublicMonsterCardProps {
  /** Monstre à afficher */
  monster: DBMonster
}

/**
 * Carte d'affichage d'un monstre public dans la galerie
 *
 * Responsabilité unique : afficher un monstre public dans un format
 * carte optimisé pour la galerie (sans toggle public, affichage read-only).
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement l'affichage d'un monstre public
 * - OCP : Extensible (peut être personnalisé via props)
 * - LSP : Peut être substitué par d'autres cartes de monstre
 *
 * @param {PublicMonsterCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de monstre public
 */
function PublicMonsterCard ({ monster }: PublicMonsterCardProps): React.ReactNode {
  // Mémoriser le parsing des traits (opération coûteuse)
  const traits = useMemo(() => {
    return parseMonsterTraits(monster.traits)
  }, [monster.traits])

  // Mémoriser les données d'arrière-plan
  const backgroundData = useMemo(() => {
    return monster.backgroundId !== undefined ? getBackgroundById(monster.backgroundId) : null
  }, [monster.backgroundId])

  // Mémoriser le state normalisé
  const monsterState = useMemo(() => {
    return isMonsterState(monster.state) ? monster.state : 'happy'
  }, [monster.state])

  // Mémoriser le niveau
  const levelLabel = useMemo(() => monster.level ?? 1, [monster.level])

  return (
    <article
      className='group relative flex flex-col overflow-hidden rounded-lg bg-white p-6 shadow-md border-2 border-[color:var(--color-neutral-200)] transition-all duration-300 hover:shadow-lg hover:border-[color:var(--color-electric-400)]'
    >
      <div className='relative flex flex-col gap-4'>
        {/* Zone de rendu du monstre */}
        <div className='relative flex items-center justify-center overflow-hidden rounded-lg bg-[color:var(--color-neutral-50)] p-6 shadow-sm border border-[color:var(--color-neutral-200)] transition-all duration-300 min-h-[200px]'>
          {/* Arrière-plan (si présent) */}
          {backgroundData !== null && (
            <div className='absolute inset-0 z-0'>
              <BackgroundRenderer backgroundData={backgroundData.data} />
            </div>
          )}

          {/* Monstre */}
          {traits !== null && (
            <div className='relative z-10 transform transition-transform duration-300 group-hover:scale-110'>
              <PixelMonster
                traits={traits}
                state={monsterState}
                level={levelLabel}
                equippedAccessories={[]}
              />
            </div>
          )}

          {/* Badge d'état */}
          <div className='absolute top-2 left-2 z-20'>
            <MonsterStateBadge state={monster.state} />
          </div>

          {/* Badge Public */}
          <div className='absolute top-2 right-2 z-20'>
            <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[color:var(--color-electric-100)] border-2 border-[color:var(--color-electric-400)] text-[color:var(--color-electric-700)]'>
              <span className='text-sm' aria-hidden='true'>🌍</span>
              <span className='font-bold'>Public</span>
            </span>
          </div>
        </div>

        {/* Informations textuelles */}
        <div className='flex flex-1 flex-col gap-3 relative'>
          <div className='flex items-start justify-between gap-3'>
            <div className='space-y-1 flex-1'>
              <h3 className='text-lg font-bold text-[color:var(--color-electric-600)]'>
                {monster.name}
              </h3>
            </div>

            {/* Badge de niveau */}
            <div className='relative'>
              <span className='inline-flex items-center gap-1 rounded-md bg-[color:var(--color-electric-500)] px-3 py-2 text-xs font-bold uppercase text-white shadow-sm'>
                <span className='text-base' aria-hidden='true'>⭐</span>
                <span>Niv. {levelLabel}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * Props pour le composant PublicGallery
 */
interface PublicGalleryProps {
  /** Liste des monstres publics */
  monsters: DBMonster[]
}

/**
 * Composant de galerie publique affichant tous les monstres publics
 *
 * Responsabilité unique : orchestrer l'affichage de la grille de monstres publics
 * avec un header informatif et un état vide si nécessaire.
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement l'affichage de la galerie publique
 * - OCP : Extensible (peut ajouter filtres, tri, etc.)
 * - DIP : Dépend de l'abstraction DBMonster
 *
 * @param {PublicGalleryProps} props - Props du composant
 * @returns {React.ReactNode} Galerie de monstres publics
 */
export function PublicGallery ({ monsters }: PublicGalleryProps): React.ReactNode {
  return (
    <section className='w-full space-y-6'>
      {/* État vide */}
      {monsters.length === 0 && (
        <div className='rounded-lg bg-white p-12 shadow-md text-center border-2 border-dashed border-[color:var(--color-neutral-300)]'>
          <div className='space-y-4'>
            <div className='text-6xl'>🌍</div>
            <h2 className='text-2xl font-bold text-[color:var(--color-neutral-700)]'>
              Aucune créature publique pour le moment
            </h2>
            <p className='text-[color:var(--color-neutral-600)] max-w-md mx-auto'>
              Sois le premier à partager ta créature avec la communauté !
              Active le mode public sur l&apos;un de tes monstres pour qu&apos;il apparaisse ici.
            </p>
          </div>
        </div>
      )}

      {/* Grille de monstres */}
      {monsters.length > 0 && (
        <div className='grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3'>
          {monsters.map((monster) => (
            <PublicMonsterCard key={monster._id} monster={monster} />
          ))}
        </div>
      )}

      {/* Message d'encouragement en bas */}
      {monsters.length > 0 && (
        <div className='text-center py-6'>
          <p className='text-sm text-gray-600 font-medium'>
            Merci de partager avec la communauté ! 💖
          </p>
        </div>
      )}
    </section>
  )
}
