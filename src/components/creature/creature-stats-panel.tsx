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
export function StatItem ({ label, value, emoji, color }: StatItemProps): React.ReactNode {
  return (
    <div className={`flex justify-between items-center py-4 px-6 rounded-2xl bg-gradient-to-r ${color} shadow-lg ring-2 ring-white/50 transform hover:scale-105 transition-all duration-300`}>
      <div className='flex items-center gap-3'>
        <span className='text-3xl'>{emoji}</span>
        <span className='text-white font-bold text-lg'>{label}</span>
      </div>
      <span className='text-white font-black text-xl'>{value}</span>
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
    <div className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-yellow-50 to-orange-100 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)] ring-8 ring-white/80'>
      {/* Effet de fond */}
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-200/20 via-orange-200/20 to-red-200/20 animate-pulse-slow' />

      <div className='relative'>
        {/* Titre du panneau */}
        <div className='text-center mb-8'>
          <h2 className='text-4xl font-black text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text flex items-center justify-center gap-3'>
            <span className='text-5xl'>📊</span>
            Statistiques
            <span className='text-5xl'>📊</span>
          </h2>
        </div>

        {/* Barre d'XP avec animations */}
        <div className='mb-8'>
          <XpProgressBar
            currentXp={xp}
            maxXp={maxXp}
            level={level}
            showXpGain={showXpGain}
            xpGained={xpGained}
          />
        </div>

        {/* Statistiques en cartes colorées */}
        <div className='space-y-4'>
          <StatItem
            label='Niveau'
            value={level.toString()}
            emoji='⭐'
            color='from-yellow-400 to-orange-500'
          />
          <StatItem
            label='État'
            value={getStateLabel(state)}
            emoji='💖'
            color='from-pink-400 to-rose-500'
          />
          <StatItem
            label='Adopté le'
            value={new Date(createdAt).toLocaleDateString('fr-FR')}
            emoji='📅'
            color='from-blue-400 to-cyan-500'
          />
          <StatItem
            label='Dernière activité'
            value={new Date(updatedAt).toLocaleDateString('fr-FR')}
            emoji='🔄'
            color='from-purple-400 to-indigo-500'
          />
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}
      </style>
    </div>
  )
}
