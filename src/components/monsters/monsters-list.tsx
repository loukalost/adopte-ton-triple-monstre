'use client'

import { useEffect, useState } from 'react'
import type { DBMonster } from '@/types/monster'
import type { OwnedAccessory } from '@/types/accessories'
import { getCreatureAccessories } from '@/actions/accessories.actions'
import { EmptyMonstersState } from './empty-monsters-state'
import { MonsterCard } from './monster-card'

/**
 * Props pour le composant MonstersList
 */
interface MonstersListProps {
  /** Liste des monstres de l'utilisateur */
  monsters: DBMonster[]
  /** Classe CSS optionnelle */
  className?: string
}

/**
 * Liste d'affichage de tous les monstres de l'utilisateur - Version Jeu Vidéo
 *
 * Responsabilité unique : orchestrer l'affichage de la grille de monstres
 * ou de l'état vide selon le contenu.
 *
 * Nouveau design :
 * - Header plus fun et engageant
 * - Grille optimisée pour mettre les cartes en avant
 * - Espacement généreux pour une meilleure lisibilité
 *
 * @param {MonstersListProps} props - Props du composant
 * @returns {React.ReactNode} Grille de monstres ou état vide
 */
function MonstersList ({ monsters, className }: MonstersListProps): React.ReactNode {
  // État pour stocker les accessoires de chaque monstre
  const [monstersAccessories, setMonstersAccessories] = useState<Record<string, OwnedAccessory[]>>({})

  // Charger les accessoires pour tous les monstres
  useEffect(() => {
    const loadAccessories = async (): Promise<void> => {
      const accessoriesMap: Record<string, OwnedAccessory[]> = {}

      await Promise.all(
        monsters.map(async (monster) => {
          try {
            const accessories = await getCreatureAccessories(monster._id)
            accessoriesMap[monster._id] = accessories
          } catch (error) {
            console.error(`Error loading accessories for monster ${monster._id}:`, error)
            accessoriesMap[monster._id] = []
          }
        })
      )

      setMonstersAccessories(accessoriesMap)
    }

    if (monsters.length > 0) {
      void loadAccessories()
    }
  }, [monsters])

  // Affichage de l'état vide si aucun monstre
  if (monsters === null || monsters === undefined || monsters.length === 0) {
    return <EmptyMonstersState className={className} />
  }

  return (
    <section className={`mt-8 w-full space-y-6 ${className ?? ''}`}>
      {/* Header */}
      <header className='relative overflow-hidden rounded-lg bg-[color:var(--color-electric-500)] p-6 shadow-lg'>
        <div className='relative flex items-center justify-between flex-wrap gap-3'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>🎮</span>
              <h2 className='text-2xl font-bold text-white'>
                Ta Collection de Créatures
              </h2>
            </div>
            <p className='text-sm text-white/90 font-medium flex items-center gap-2'>
              <span className='text-lg'>✨</span>
              {monsters.length} {monsters.length === 1 ? 'compagnon adorable' : 'compagnons adorables'} prêts pour l&apos;aventure !
            </p>
          </div>

          {/* Badge du nombre de monstres */}
          <div className='flex items-center gap-2'>
            <div className='bg-white/95 rounded-lg px-6 py-3 shadow-md'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-[color:var(--color-electric-600)]'>
                  {monsters.length}
                </div>
                <div className='text-xs font-bold text-[color:var(--color-electric-600)] uppercase'>
                  Créatures
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Grille de monstres */}
      <div className='grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3'>
        {monsters.map((monster) => {
          const cardKey = monster._id

          return (
            <MonsterCard
              key={cardKey}
              id={cardKey}
              name={monster.name}
              traits={monster.traits}
              state={monster.state}
              level={monster.level}
              createdAt={String(monster.createdAt)}
              updatedAt={String(monster.updatedAt)}
              accessories={monstersAccessories[monster._id] ?? []}
              backgroundId={monster.backgroundId}
            />
          )
        })}
      </div>

      {/* Message d'encouragement en bas */}
      <div className='text-center py-6'>
        <p className='text-sm text-gray-600 font-medium'>
          Continue de prendre soin de tes créatures ! 💖
        </p>
      </div>
    </section>
  )
}

export default MonstersList
