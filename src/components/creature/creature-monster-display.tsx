import { AnimatedMonster, MonsterActions } from '@/components/monsters'
import type { MonsterTraits, MonsterState } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import type { OwnedAccessory } from '@/types/accessories'
import { getStateLabel } from '@/lib/utils'
import { getBackgroundById } from '@/config/backgrounds.config'
import BackgroundRenderer from '@/components/backgrounds/background-renderer'

/**
 * Props pour le composant CreatureMonsterDisplay
 */
interface CreatureMonsterDisplayProps {
  /** Traits visuels du monstre */
  traits: MonsterTraits
  /** État actuel du monstre */
  state: MonsterState
  /** Niveau du monstre */
  level: number
  /** Action actuellement en cours */
  currentAction: MonsterAction
  /** Callback appelé lors d'une action */
  onAction: (action: MonsterAction) => void
  /** ID du monstre */
  monsterId: string
  /** Accessoires équipés (optionnel) */
  equippedAccessories?: OwnedAccessory[]
  /** ID de l'arrière-plan appliqué (optionnel) */
  backgroundId?: string | null
}

/**
 * Panneau d'affichage du monstre animé avec actions - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : orchestrer l'affichage du monstre animé,
 * de son état actuel et des actions disponibles.
 *
 * Nouveau design :
 * - Zone du monstre plus grande et colorée
 * - Badge d'état fun
 * - Animations et effets visuels
 *
 * @param {CreatureMonsterDisplayProps} props - Props du composant
 * @returns {React.ReactNode} Panneau avec monstre et actions
 */
export function CreatureMonsterDisplay ({
  traits,
  state,
  level,
  currentAction,
  onAction,
  monsterId,
  equippedAccessories = [],
  backgroundId = null
}: CreatureMonsterDisplayProps): React.ReactNode {
  // Couleurs selon l'état - Version simplifiée
  const stateEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    hungry: '😋',
    sleepy: '😴'
  }

  const currentEmoji = stateEmojis[state] ?? stateEmojis.happy

  // Récupérer l'arrière-plan si défini
  const background = backgroundId !== null && backgroundId !== undefined ? getBackgroundById(backgroundId) : null

  return (
    <div className='rounded-lg bg-white p-6 shadow-lg border border-[color:var(--color-neutral-200)]'>
      {/* Zone d'affichage du monstre animé */}
      <div className='relative aspect-square max-w-md mx-auto mb-4'>
        <div className='relative p-4 rounded-2xl overflow-hidden'>
          {/* Arrière-plan (si défini) */}
          {background !== null && (
            <div className='absolute inset-0 z-0'>
              <BackgroundRenderer
                backgroundData={background.data}
                className='w-full h-full'
              />
            </div>
          )}

          {/* Monstre au-dessus de l'arrière-plan */}
          <div className='relative z-10'>
            <AnimatedMonster
              state={state}
              traits={traits}
              level={level}
              currentAction={currentAction}
              equippedAccessories={equippedAccessories}
            />
          </div>
        </div>
      </div>

      {/* Badge d'état du monstre */}
      <div className='mb-4 text-center'>
        <div className='inline-block bg-[color:var(--color-electric-500)] px-6 py-3 rounded-lg shadow-lg'>
          <div className='flex items-center gap-3'>
            <span className='text-3xl'>{currentEmoji}</span>
            <div className='text-left'>
              <p className='text-xs font-medium text-white/90 uppercase tracking-wider'>État actuel</p>
              <p className='text-base font-bold text-white'>{getStateLabel(state)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className='relative'>
        <MonsterActions onAction={onAction} monsterId={monsterId} />
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.4; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(-180deg); }
        }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-twinkle-delayed { animation: twinkle-delayed 3s ease-in-out infinite; }
      `}
      </style>
    </div>
  )
}
