import type { UserDisplay } from '@/hooks/dashboard'

/**
 * Props pour le composant WelcomeHero
 */
interface WelcomeHeroProps {
  /** Informations d'affichage de l'utilisateur */
  userDisplay: UserDisplay
  /** Callback pour créer un nouveau monstre */
  onCreateMonster: () => void
}

/**
 * Section héro de bienvenue du dashboard - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : afficher le message de bienvenue personnalisé
 * et l'action principale (créer un monstre).
 *
 * Nouveau design :
 * - Plus coloré et engageant
 * - Animation et effets visuels
 * - Style jeu vidéo kawaii
 *
 * @param {WelcomeHeroProps} props - Props du composant
 * @returns {React.ReactNode} Section de bienvenue
 */
export function WelcomeHero ({
  userDisplay,
  onCreateMonster

}: WelcomeHeroProps): React.ReactNode {
  return (
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
      {/* Contenu textuel */}
      <div className='space-y-3 flex-1'>
        {/* Badge de bienvenue */}
        <div className='inline-flex items-center gap-2 rounded-full bg-[color:var(--color-neon-purple-500)] px-4 py-2 shadow-md'>
          <span className='text-lg animate-wave' aria-hidden='true'>👋</span>
          <span className='text-white font-bold text-sm tracking-wide'>
            Salut {userDisplay.displayName} !
          </span>
        </div>

        {/* Titre principal */}
        <h1 className='text-2xl font-bold text-[color:var(--color-electric-600)] leading-tight sm:text-3xl'>
          Bienvenue dans ton Univers ATTM ! 🎮
        </h1>
        {/* Description */}
        <p className='text-base text-neutral-700 leading-relaxed'>
          <span className='text-lg mr-1'>✨</span>
          Prends soin de tes créatures adorables et vis des aventures inoubliables
          <span className='inline-block mx-1 text-lg'>💖</span>
        </p>
      </div>

      {/* Bouton d'action principal - À droite sur desktop */}
      <div className='flex-shrink-0'>
        <button
          onClick={onCreateMonster}
          className='group rounded-md bg-[color:var(--color-electric-500)] px-6 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-[color:var(--color-electric-600)] active:scale-95 w-full lg:w-auto'
        >
          <span className='flex items-center justify-center gap-2'>
            <span className='text-xl'>🌟</span>
            <span>Créer une Créature</span>
            <span className='text-xl'>🎨</span>
          </span>
        </button>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-20deg);
          }
        }

        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}
      </style>
    </div>
  )
}
