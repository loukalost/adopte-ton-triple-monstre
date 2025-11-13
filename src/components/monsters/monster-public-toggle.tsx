'use client'

import { useState, useTransition } from 'react'
import { toggleMonsterPublicStatus } from '@/actions/monsters.actions'

/**
 * Props pour le composant MonsterPublicToggle
 */
interface MonsterPublicToggleProps {
  /** Identifiant du monstre */
  monsterId: string
  /** Statut public actuel du monstre */
  isPublic: boolean
  /** Variante d'affichage : 'badge' pour petit badge, 'button' pour bouton complet */
  variant?: 'badge' | 'button'
  /** Afficher uniquement l'icône sans texte (pour la version compacte) */
  iconOnly?: boolean
}

/**
 * Composant Toggle pour activer/désactiver le mode public d'un monstre
 *
 * Responsabilité unique : fournir une interface utilisateur pour
 * basculer le statut public/privé d'un monstre avec feedback visuel.
 *
 * Principes SOLID appliqués :
 * - SRP : Gère uniquement l'interaction de toggle du statut public
 * - OCP : Extensible via les props variant et iconOnly
 * - LSP : Peut être utilisé dans différents contextes (card, détail)
 * - ISP : Interface minimale et ciblée
 * - DIP : Dépend de l'abstraction (action Server), pas de l'implémentation
 *
 * @param {MonsterPublicToggleProps} props - Props du composant
 * @returns {React.ReactNode} Toggle avec état visuel et feedback
 */
export function MonsterPublicToggle ({
  monsterId,
  isPublic: initialIsPublic,
  variant = 'badge',
  iconOnly = false
}: MonsterPublicToggleProps): React.ReactNode {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (e: React.MouseEvent): void => {
    // Empêcher la propagation pour éviter de naviguer vers la page de détail
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      try {
        const newStatus = await toggleMonsterPublicStatus(monsterId)
        setIsPublic(newStatus)
      } catch (error) {
        console.error('Failed to toggle public status:', error)
        // En cas d'erreur, restaurer l'état précédent
        setIsPublic(isPublic)
      }
    })
  }

  // Variante badge : petit badge discret
  if (variant === 'badge') {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`
          inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
          transition-all duration-300 border-2
          ${isPending ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:scale-105'}
          ${
            isPublic
              ? 'bg-[color:var(--color-electric-100)] border-[color:var(--color-electric-400)] text-[color:var(--color-electric-700)]'
              : 'bg-neutral-100 border-neutral-300 text-neutral-600'
          }
        `}
        title={isPublic ? 'Monstre public (cliquer pour rendre privé)' : 'Monstre privé (cliquer pour rendre public)'}
        aria-label={isPublic ? 'Rendre le monstre privé' : 'Rendre le monstre public'}
      >
        <span className='text-sm' aria-hidden='true'>
          {isPublic ? '🌍' : '🔒'}
        </span>
        {!iconOnly && (
          <span className='font-bold'>
            {isPublic ? 'Public' : 'Privé'}
          </span>
        )}
      </button>
    )
  }

  // Variante button : bouton complet avec texte
  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium
        transition-all duration-300 border-2
        ${isPending ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:shadow-md active:scale-95'}
        ${
          isPublic
            ? 'bg-[color:var(--color-electric-500)] border-[color:var(--color-electric-600)] text-white hover:bg-[color:var(--color-electric-600)]'
            : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
        }
      `}
      title={isPublic ? 'Monstre public - visible dans la galerie' : 'Monstre privé - visible uniquement par vous'}
      aria-label={isPublic ? 'Rendre le monstre privé' : 'Rendre le monstre public'}
    >
      <span className='text-lg' aria-hidden='true'>
        {isPublic ? '🌍' : '🔒'}
      </span>
      <span>
        {isPending ? 'Mise à jour...' : isPublic ? 'Public' : 'Privé'}
      </span>
      {!isPending && (
        <span className='text-xs opacity-70'>
          (cliquer pour {isPublic ? 'rendre privé' : 'rendre public'})
        </span>
      )}
    </button>
  )
}
