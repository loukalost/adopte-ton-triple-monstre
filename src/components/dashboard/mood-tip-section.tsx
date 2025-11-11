/**
 * Props pour le composant MoodTipSection
 */
interface MoodTipSectionProps {
  /** Message personnalisé basé sur l'humeur favorite */
  message: string
}

/**
 * Section affichant l'astuce d'humeur personnalisée
 *
 * Responsabilité unique : afficher un conseil basé sur
 * l'humeur dominante des monstres de l'utilisateur.
 *
 * @param {MoodTipSectionProps} props - Props du composant
 * @returns {React.ReactNode} Section d'astuce mood
 *
 * @example
 * <MoodTipSection message={favoriteMoodMessage} />
 */
export function MoodTipSection ({ message }: MoodTipSectionProps): React.ReactNode {
  return (
    <div className='rounded-lg bg-[color:var(--color-neon-purple-50)] p-4 shadow-md border border-[color:var(--color-neon-purple-100)]'>
      <p className='text-xs font-semibold uppercase tracking-wide text-[color:var(--color-neon-purple-500)]'>
        Astuce mood
      </p>
      <p className='mt-2 text-sm font-medium text-slate-800'>{message}</p>
      <p className='mt-1 text-xs text-slate-600'>
        Observe tes créatures pour débloquer toutes les humeurs et récolter des surprises.
      </p>
    </div>
  )
}
