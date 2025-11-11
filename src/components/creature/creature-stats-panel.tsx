import { getStateLabel } from '@/lib/utils'
import { XpProgressBar } from './xp-progress-bar'

/**
 * Props pour le composant StatItem
 */
interface StatItemProps {
  /** Label de la statistique */
  label: string
  /** Valeur de la statistique */
  value: string
  /** Emoji associé */
  emoji: string
  /** Couleur du gradient */
  color: string
}

/**
 * Élément de statistique (ligne label/valeur) - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : afficher une paire label/valeur
 * dans un format de ligne de statistique coloré et fun.
 *
 * @param {StatItemProps} props - Props du composant
 * @returns {React.ReactNode} Ligne de statistique
 */
export function StatItem ({ label, value, emoji }: Omit<StatItemProps, 'color'>): React.ReactNode {
  return (
    <div className='flex justify-between items-center py-3 px-4 rounded-lg bg-white border border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-electric-500)] transition-all duration-300'>
      <div className='flex items-center gap-2'>
        <span className='text-xl'>{emoji}</span>
        <span className='text-[color:var(--color-neutral-700)] font-medium text-sm'>{label}</span>
      </div>
      <span className='text-[color:var(--color-electric-600)] font-bold text-sm'>{value}</span>
    </div>
  )
}

/**
 * Props pour le composant CreatureStatsPanel
 */
interface CreatureStatsPanelProps {
  /** Niveau du monstre */
  level: number
  /** XP actuel du monstre */
  xp: number
  /** XP maximum pour le niveau actuel */
  maxXp: number
  /** État du monstre */
  state: string
  /** Date de création (timestamp ou string) */
  createdAt: string | Date
  /** Date de dernière mise à jour (timestamp ou string) */
  updatedAt: string | Date
  /** Si true, affiche l'animation de gain d'XP */
  showXpGain?: boolean
  /** Montant d'XP gagné (pour l'animation) */
  xpGained?: number
}

/**
 * Panneau d'affichage des statistiques du monstre - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : afficher toutes les statistiques
 * du monstre dans un panneau formaté super coloré.
 *
 * Nouveau design :
 * - Cartes colorées individuelles
 * - Émojis partout
 * - Animations hover
 *
 * @param {CreatureStatsPanelProps} props - Props du composant
 * @returns {React.ReactNode} Panneau de statistiques
 */
export function CreatureStatsPanel ({
  level,
  xp,
  maxXp,
  state,
  createdAt,
  updatedAt,
  showXpGain = false,
  xpGained = 0
}: CreatureStatsPanelProps): React.ReactNode {
  return (
    <div className='rounded-lg bg-white p-4 shadow-lg border border-[color:var(--color-neutral-200)]'>
      <div className='relative'>
        {/* Titre du panneau */}
        <div className='text-center mb-4'>
          <h2 className='text-lg font-bold text-[color:var(--color-electric-600)] flex items-center justify-center gap-2'>
            <span className='text-xl'>📊</span>
            Statistiques
          </h2>
        </div>

        {/* Barre d'XP avec animations */}
        <div className='mb-4'>
          <XpProgressBar
            currentXp={xp}
            maxXp={maxXp}
            level={level}
            showXpGain={showXpGain}
            xpGained={xpGained}
          />
        </div>

        {/* Statistiques en cartes colorées */}
        <div className='space-y-3'>
          <StatItem
            label='Niveau'
            value={level.toString()}
            emoji='⭐'
          />
          <StatItem
            label='État'
            value={getStateLabel(state)}
            emoji='💖'
          />
          <StatItem
            label='Adopté le'
            value={new Date(createdAt).toLocaleDateString('fr-FR')}
            emoji='📅'
          />
          <StatItem
            label='Dernière activité'
            value={new Date(updatedAt).toLocaleDateString('fr-FR')}
            emoji='🔄'
          />
        </div>
      </div>
    </div>
  )
}
