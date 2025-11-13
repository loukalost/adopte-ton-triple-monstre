'use client'

import { doActionOnMonster } from '@/actions/monsters.actions'
import { rewardActionKoins } from '@/actions/wallet.actions'
import { useMonsterAction, type MonsterAction } from '@/hooks/monsters'
import { formatRewardMessage } from '@/services/rewards.service'
import { toast } from 'react-toastify'

/**
 * Props pour le composant MonsterActions
 */
interface MonsterActionsProps {
  /** Callback appelé lorsqu'une action est déclenchée */
  onAction: (action: MonsterAction) => void
  /** ID du monstre */
  monsterId: string
}

/**
 * Définition d'une action disponible sur un monstre
 */
interface ActionDefinition {
  /** Clé de l'action */
  action: MonsterAction
  /** Emoji représentant l'action */
  emoji: string
  /** Label textuel de l'action */
  label: string
}

/**
 * Liste des actions disponibles pour interagir avec un monstre
 */
const AVAILABLE_ACTIONS: ActionDefinition[] = [
  { action: 'feed', emoji: '🍎', label: 'Nourrir' },
  { action: 'comfort', emoji: '💙', label: 'Consoler' },
  { action: 'hug', emoji: '🤗', label: 'Câliner' },
  { action: 'wake', emoji: '⏰', label: 'Réveiller' }
]

/**
 * Props pour le composant ActionButton
 */
interface ActionButtonProps {
  /** Action associée au bouton */
  action: MonsterAction
  /** Emoji à afficher */
  emoji: string
  /** Label du bouton */
  label: string
  /** Si true, le bouton est dans son état actif */
  isActive: boolean
  /** Si true, le bouton est désactivé */
  isDisabled: boolean
  /** Callback au clic */
  onClick: () => void
}

/**
 * Bouton d'action individuel pour interagir avec un monstre
 *
 * Responsabilité unique : afficher un bouton d'action avec
 * ses états visuels (normal, actif, désactivé).
 *
 * @param {ActionButtonProps} props - Props du composant
 * @returns {React.ReactNode} Bouton stylisé
 *
 * @example
 * <ActionButton
 *   action="feed"
 *   emoji="🍎"
 *   label="Nourrir"
 *   isActive={false}
 *   isDisabled={false}
 *   onClick={handleFeed}
 * />
 */
function ActionButton ({
  action,
  emoji,
  label,
  isActive,
  isDisabled,
  onClick
}: ActionButtonProps): React.ReactNode {
// Couleurs spécifiques par action
  const actionColors: Record<string, string> = {
    feed: 'bg-orange-500 hover:bg-orange-600',
    comfort: 'bg-blue-500 hover:bg-blue-600',
    hug: 'bg-pink-500 hover:bg-pink-600',
    wake: 'bg-yellow-500 hover:bg-yellow-600'
  }

  const colorClass = (action !== null && action !== undefined) ? actionColors[action] : 'bg-gray-500'

  const baseClass = 'group relative overflow-hidden flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-lg font-bold text-white shadow-md transition-all duration-300'
  const activeClass = isActive
    ? 'scale-95 opacity-75'
    : isDisabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:scale-105 active:scale-95 cursor-pointer hover:shadow-lg'

  return (
    <button
      className={`${baseClass} ${colorClass} ${activeClass}`}
      onClick={onClick}
      disabled={isDisabled}
      type='button'
    >

      <span className='relative text-5xl group-hover:scale-110 transition-transform duration-300'>{emoji}</span>
      <span className='relative text-sm uppercase tracking-wider'>{label}</span>
    </button>
  )
}

/**
 * Composant de gestion des actions sur un monstre
 *
 * Responsabilité unique : orchestrer l'affichage des boutons d'action
 * et gérer l'état de l'action en cours.
 *
 * Applique SRP en déléguant :
 * - La gestion de l'état d'action au hook useMonsterAction
 * - L'affichage de chaque bouton à ActionButton
 *
 * @param {MonsterActionsProps} props - Props du composant
 * @returns {React.ReactNode} Section d'actions
 *
 * @example
 * <MonsterActions onAction={(action) => console.log(action)} />
 */
export function MonsterActions ({ onAction, monsterId }: MonsterActionsProps): React.ReactNode {
  const { activeAction, triggerAction } = useMonsterAction()

  /**
   * Gère le déclenchement d'une action avec attribution de récompense
   *
   * Responsabilité unique : orchestrer l'action et sa récompense
   * - Déclenche l'animation (UI)
   * - Exécute l'action sur le monstre (business logic)
   * - Attribue les Koins (reward system)
   * - Affiche la notification (UX)
   *
   * @param {MonsterAction} action - Action à déclencher
   */
  const handleAction = async (action: MonsterAction): Promise<void> => {
    // Déclenchement de l'animation UI
    triggerAction(action, onAction)

    try {
      // Exécution parallèle de l'action et de la récompense
      const [, rewardResult] = await Promise.all([
        doActionOnMonster(monsterId, action),
        rewardActionKoins(action)
      ])

      // Affichage de la notification de récompense
      if (rewardResult !== null) {
        const message = formatRewardMessage(rewardResult.reward)

        toast.success(message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 'bold'
          }
        })
      }
    } catch (error) {
      console.error('Error executing action:', error)
      toast.error('Erreur lors de l\'action 😢', {
        position: 'top-center',
        autoClose: 3000
      })
    }
  }

  return (
    <div className='space-y-4'>
      {/* Titre des actions */}
      <div className='text-center'>
        <h3 className='text-xl font-bold text-[color:var(--color-electric-600)] mb-1'>
          Actions
        </h3>
        <p className='text-xs text-gray-600 font-medium'>
          Interagis avec ta créature ! ✨
        </p>
      </div>

      {/* Grille de boutons d'action */}
      <div className='grid grid-cols-2 gap-3'>
        {AVAILABLE_ACTIONS.map(({ action, emoji, label }) => (
          <ActionButton
            key={action}
            action={action}
            emoji={emoji}
            label={label}
            isActive={activeAction === action}
            isDisabled={activeAction !== null}
            onClick={() => { void handleAction(action) }}
          />
        ))}
      </div>

      {/* Indicateur d'action en cours */}
      {activeAction !== null && (
        <div className='text-center'>
          <div className='inline-flex items-center gap-2 bg-[color:var(--color-neon-purple-100)] px-3 py-2 rounded-full'>
            <div className='w-2 h-2 bg-[color:var(--color-neon-purple-500)] rounded-full animate-ping' />
            <span className='text-xs font-medium text-[color:var(--color-neon-purple-700)]'>
              Action en cours...
            </span>
          </div>
        </div>
      )}
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

        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
      `}
      </style>
    </div>
  )
}
