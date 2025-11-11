/**
 * Props pour le composant StatsCard
 */
interface StatsCardProps {
  /** Titre de la statistique */
  title: string
  /** Valeur numérique ou textuelle de la statistique */
  value: number | string
  /** Description complémentaire */
  description: string
  /** Couleur thématique pour la bordure (electric, neon-purple, neutral) */
  color: 'electric' | 'neon-purple' | 'neutral'
  /** Si true, la carte prend toute la largeur disponible */
  fullWidth?: boolean
}

/**
 * Carte d'affichage d'une statistique
 *
 * Responsabilité unique : afficher une statistique avec son titre,
 * sa valeur et sa description dans un style cohérent.
 *
 * @param {StatsCardProps} props - Props du composant
 * @returns {React.ReactNode} Carte de statistique stylisée
 *
 * @example
 * <StatsCard
 *   title="Compagnons"
 *   value={5}
 *   description="Monstres prêts pour l'aventure"
 *   color="electric"
 * />
 */
export function StatsCard ({
  title,
  value,
  description,
  color,
  fullWidth = false
}: StatsCardProps): React.ReactNode {
  // Mapping des couleurs aux classes Tailwind
  const ringColorClass = {
    electric: 'ring-electric-200/60',
    'neon-purple': 'ring-neon-purple-200/60',
    neutral: 'ring-neutral-200/60'
  }[color]

  const textColorClass = {
    electric: 'text-electric-500',
    'neon-purple': 'text-neon-purple-500',
    neutral: 'text-neutral-500'
  }[color]

  const widthClass = fullWidth ? 'sm:col-span-2' : ''

  return (
    <div
      className={`rounded-2xl bg-white/80 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ${ringColorClass} ${widthClass}`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wide ${textColorClass}`}>
        {title}
      </p>
      <p className='mt-2 text-3xl font-black text-slate-900'>
        {value}
      </p>
      <p className='text-xs text-slate-500'>
        {description}
      </p>
    </div>
  )
}
