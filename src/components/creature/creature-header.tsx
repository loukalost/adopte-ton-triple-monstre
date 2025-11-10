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
    <div className='text-center mb-12 relative'>
      {/* Badge de niveau floating */}
      <div className='absolute -top-8 right-1/2 transform translate-x-1/2 lg:right-0 lg:translate-x-0'>
        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl blur-lg opacity-50' />
          <div className='relative bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white font-black text-xl px-8 py-4 rounded-3xl shadow-2xl ring-4 ring-white/50 flex items-center gap-3'>
            <span className='text-4xl animate-bounce-slow'>⭐</span>
            <div>
              <div className='text-sm uppercase tracking-wider opacity-90'>Niveau</div>
              <div className='text-3xl'>{level}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Nom du monstre - ÉNORME */}
      <div className='pt-12'>
        <div className='inline-flex items-center gap-4 mb-4'>
          <span className='text-7xl animate-wave'>👋</span>
          <h1 className='text-7xl font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text drop-shadow-2xl'>
            {name}
          </h1>
          <span className='text-7xl animate-wave' style={{ animationDelay: '0.5s' }}>💖</span>
        </div>

        <p className='text-2xl font-bold text-purple-600 flex items-center justify-center gap-2'>
          <span className='text-3xl'>✨</span>
          Ta créature adorable
          <span className='text-3xl'>✨</span>
        </p>
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
