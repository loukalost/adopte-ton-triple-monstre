/**
 * Props pour le composant CreatureHeader
 */
interface CreatureHeaderProps {
  /** Nom du monstre */
  name: string
  /** Niveau du monstre */
  level: number
}

/**
 * En-tête de la page de détail d'une créature - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : afficher le nom et le niveau du monstre
 * dans un format visuellement ultra attrayant.
 *
 * Nouveau design :
 * - Titre énorme avec gradient
 * - Badge de niveau imposant
 * - Emojis et animations
 *
 * @param {CreatureHeaderProps} props - Props du composant
 * @returns {React.ReactNode} En-tête avec nom et niveau
 */
export function CreatureHeader ({ name, level }: CreatureHeaderProps): React.ReactNode {
  return (
    <div className='text-center mb-6 relative'>
      {/* Nom du monstre */}
      <div className='pt-4'>
        <div className='inline-flex items-center gap-3 mb-2'>
          <span className='text-3xl'>👋</span>
          <h1 className='text-3xl font-bold text-[color:var(--color-electric-600)]'>
            {name}
          </h1>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .animate-wave { animation: wave 2s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}
      </style>
    </div>
  )
}
