'use client'

import { useState } from 'react'
import type { GalleryFilters as GalleryFiltersType } from '@/actions/gallery.actions'

/**
 * Props pour le composant GalleryFilters
 */
interface GalleryFiltersProps {
  /** Callback appelé quand les filtres changent */
  onFiltersChange: (filters: GalleryFiltersType) => void
  /** Nombre total de monstres publics */
  totalCount: number
}

/**
 * Composant de filtres pour la galerie publique
 *
 * Responsabilité unique : gérer l'interface utilisateur des filtres
 * de la galerie et notifier les changements.
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement l'UI des filtres
 * - OCP : Extensible pour ajouter de nouveaux filtres
 * - DIP : Utilise un callback pour notifier les changements
 *
 * @param {GalleryFiltersProps} props - Props du composant
 * @returns {React.ReactNode} Interface de filtrage
 */
export function GalleryFilters ({ onFiltersChange, totalCount }: GalleryFiltersProps): React.ReactNode {
  const [minLevel, setMinLevel] = useState<string>('')
  const [maxLevel, setMaxLevel] = useState<string>('')
  const [state, setState] = useState<string>('')

  const handleApplyFilters = (): void => {
    const filters: GalleryFiltersType = {}

    if (minLevel !== '') {
      filters.minLevel = parseInt(minLevel, 10)
    }
    if (maxLevel !== '') {
      filters.maxLevel = parseInt(maxLevel, 10)
    }
    if (state !== '') {
      filters.state = state
    }

    onFiltersChange(filters)
  }

  const handleResetFilters = (): void => {
    setMinLevel('')
    setMaxLevel('')
    setState('')
    onFiltersChange({})
  }

  return (
    <div className='bg-white rounded-lg p-4 shadow-md border border-[color:var(--color-neutral-200)] space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-xl'>🎯</span>
          <h3 className='text-lg font-bold text-[color:var(--color-electric-600)]'>
            Filtres
          </h3>
        </div>
        <span className='text-sm text-[color:var(--color-neutral-600)]'>
          {totalCount} {totalCount === 1 ? 'créature' : 'créatures'}
        </span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Filtre par niveau minimum */}
        <div>
          <label className='block text-sm font-medium text-[color:var(--color-neutral-700)] mb-1'>
            Niveau min
          </label>
          <input
            type='number'
            min='1'
            value={minLevel}
            onChange={(e) => { setMinLevel(e.target.value) }}
            placeholder='Ex: 1'
            className='w-full px-3 py-2 border border-[color:var(--color-neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-electric-500)]'
          />
        </div>

        {/* Filtre par niveau maximum */}
        <div>
          <label className='block text-sm font-medium text-[color:var(--color-neutral-700)] mb-1'>
            Niveau max
          </label>
          <input
            type='number'
            min='1'
            value={maxLevel}
            onChange={(e) => { setMaxLevel(e.target.value) }}
            placeholder='Ex: 10'
            className='w-full px-3 py-2 border border-[color:var(--color-neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-electric-500)]'
          />
        </div>

        {/* Filtre par état */}
        <div>
          <label className='block text-sm font-medium text-[color:var(--color-neutral-700)] mb-1'>
            Humeur
          </label>
          <select
            value={state}
            onChange={(e) => { setState(e.target.value) }}
            className='w-full px-3 py-2 border border-[color:var(--color-neutral-300)] rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--color-electric-500)]'
          >
            <option value=''>Toutes</option>
            <option value='happy'>😊 Joyeux</option>
            <option value='sad'>😢 Triste</option>
            <option value='angry'>😠 En colère</option>
            <option value='hungry'>🍔 Affamé</option>
            <option value='sleepy'>😴 Endormi</option>
          </select>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className='flex gap-2 justify-end'>
        <button
          onClick={handleResetFilters}
          className='px-4 py-2 bg-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-300)] text-[color:var(--color-neutral-700)] font-medium rounded-md transition-colors duration-200'
        >
          Réinitialiser
        </button>
        <button
          onClick={handleApplyFilters}
          className='px-4 py-2 bg-[color:var(--color-electric-500)] hover:bg-[color:var(--color-electric-600)] text-white font-bold rounded-md transition-colors duration-200 active:scale-95 transform'
        >
          Appliquer
        </button>
      </div>
    </div>
  )
}
