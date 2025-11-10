'use client'

import { useEffect, useState, useRef } from 'react'
import type { MonsterTraits, DBMonster } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import { parseMonsterTraits } from '@/lib/utils'
import { CreatureMonsterDisplay } from './creature-monster-display'
import { CreatureStatsPanel } from './creature-stats-panel'
import { LevelUpAnimation } from './level-up-animation'
import { useRouter } from 'next/navigation'
import { ShopModal } from './shop-modal'

/**
 * Props pour le composant CreaturePageClient
 */
interface CreaturePageClientProps {
  /** Données du monstre à afficher */
  monster: DBMonster
}

/**
 * Composant client de la page de détail d'une créature - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : orchestrer l'affichage de toutes les sections
 * de la page de détail (header, monstre animé, stats, traits, couleurs).
 *
 * Nouveau design :
 * - Fond ultra coloré avec animations
 * - Mise en avant du monstre
 * - Panels fun et engageants
 *
 * @param {CreaturePageClientProps} props - Props du composant
 * @returns {React.ReactNode} Page complète de détail de la créature
 */
export function CreaturePageClient ({ monster }: CreaturePageClientProps): React.ReactNode {
  const [currentAction, setCurrentAction] = useState<MonsterAction>(null)
  const [currentMonster, setCurrentMonster] = useState<DBMonster>(monster)
  const [showXpGain, setShowXpGain] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const actionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Parse des traits depuis le JSON stocké en base
  const traits: MonsterTraits = parseMonsterTraits(monster.traits) ?? {
    bodyColor: '#FFB5E8',
    accentColor: '#FF9CEE',
    eyeColor: '#2C2C2C',
    antennaColor: '#FFE66D',
    bobbleColor: '#FFE66D',
    cheekColor: '#FFB5D5',
    bodyStyle: 'round',
    eyeStyle: 'big',
    antennaStyle: 'single',
    accessory: 'none'
  }

  useEffect(() => {
    const fetchMonster = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/monster?id=${monster._id}`)
        if (response.ok) {
          const updatedMonster: DBMonster = await response.json()

          // Détection du gain d'XP
          if (updatedMonster.xp !== currentMonster.xp ||
              updatedMonster.level !== currentMonster.level) {
            // Calcul du gain d'XP
            const xpDiff = updatedMonster.level > currentMonster.level
              ? updatedMonster.xp + (updatedMonster.level - currentMonster.level - 1) * currentMonster.maxXp + (currentMonster.maxXp - currentMonster.xp)
              : updatedMonster.xp - currentMonster.xp

            if (xpDiff > 0) {
              setXpGained(xpDiff)
              setShowXpGain(true)

              // Masquer l'animation après 2 secondes
              setTimeout(() => {
                setShowXpGain(false)
              }, 2000)
            }

            // Détection du level-up
            if (updatedMonster.level > currentMonster.level) {
              setShowLevelUp(true)
            }
          }

          setCurrentMonster(updatedMonster)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du monstre :', error)
      }
    }

    const interval = setInterval(() => {
      void fetchMonster()
    }, 1000)

    return () => clearInterval(interval)
  }, [monster, currentMonster])

  // Nettoyage du timer d'action au démontage du composant
  useEffect(() => {
    return () => {
      if (actionTimerRef.current !== null) {
        clearTimeout(actionTimerRef.current)
      }
    }
  }, [])

  /**
   * Gère le déclenchement d'une action sur le monstre
   * @param {MonsterAction} action - Action déclenchée
   */
  const handleAction = (action: MonsterAction): void => {
    // Nettoyer le timer précédent si existant
    if (actionTimerRef.current !== null) {
      clearTimeout(actionTimerRef.current)
    }

    setCurrentAction(action)

    // Réinitialiser l'action après l'animation (doit correspondre au délai de useMonsterAction)
    const timer = setTimeout(() => {
      setCurrentAction(null)
      actionTimerRef.current = null
    }, 2500)

    actionTimerRef.current = timer
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 py-6 relative overflow-hidden'>
      {/* Bulles décoratives animées */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-400/30 blur-3xl animate-float' />
        <div className='absolute -left-32 bottom-20 h-96 w-96 rounded-full bg-gradient-to-br from-pink-300/30 to-purple-400/30 blur-3xl animate-float-delayed' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-400/20 blur-3xl animate-pulse-slow' />
      </div>

      {/* Étoiles décoratives */}
      <div className='pointer-events-none absolute top-20 right-40 text-6xl animate-twinkle'>⭐</div>
      <div className='pointer-events-none absolute top-40 left-20 text-5xl animate-twinkle-delayed'>✨</div>
      <div className='pointer-events-none absolute bottom-40 right-60 text-4xl animate-twinkle'>💫</div>

      <div className='container relative z-10 mx-auto px-4 max-w-7xl'>
        {/* Barre de navigation - Plus compacte */}
        <div className='flex justify-between items-center mb-6 gap-4'>
          {/* Bouton retour + nom */}
          <div className='flex items-center gap-4'>
            <button
              onClick={() => { void router.push('/app') }}
              className='group relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-black px-4 py-2 rounded-xl shadow-lg ring-2 ring-purple-200/50 transition-all duration-300 hover:scale-105 active:scale-95'
            >
              <span className='text-xl'>←</span>
              <span className='hidden sm:inline'>Retour</span>
            </button>

            {/* Nom du monstre inline */}
            <div className='flex items-center gap-2'>
              <span className='text-3xl'>👋</span>
              <h1 className='text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text'>
                {currentMonster.name}
              </h1>
            </div>
          </div>

          {/* Bouton boutique */}
          <button
            onClick={() => { setShowShop(true) }}
            className='group relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black px-4 py-2 rounded-xl shadow-lg ring-2 ring-green-200/50 transition-all duration-300 hover:scale-105 active:scale-95'
          >
            <span className='text-xl'>🛍️</span>
            <span className='hidden sm:inline'>Boutique</span>

          </button>
        </div>

        {/* Grille principale - Alignée */}
        <div className='grid lg:grid-cols-2 gap-6 items-start'>
          {/* Colonne gauche : Monstre animé + Actions */}
          <div className='space-y-6'>
            <CreatureMonsterDisplay
              traits={traits}
              state={currentMonster.state}
              level={currentMonster.level}
              currentAction={currentAction}
              onAction={handleAction}
              monsterId={currentMonster._id}
            />
          </div>

          {/* Colonne droite : Statistiques */}
          <div>
            <CreatureStatsPanel
              level={currentMonster.level}
              xp={currentMonster.xp ?? 0}
              maxXp={currentMonster.maxXp ?? currentMonster.level * 100}
              state={currentMonster.state}
              createdAt={currentMonster.createdAt}
              updatedAt={currentMonster.updatedAt}
              showXpGain={showXpGain}
              xpGained={xpGained}
            />
            <CreatureTraitsPanel traits={traits} />
            <CreatureColorsPanel traits={traits} />
          </div>
        </div>
      </div>

      {/* Animation de level-up */}
      <LevelUpAnimation
        newLevel={currentMonster.level}
        show={showLevelUp}
        onComplete={() => setShowLevelUp(false)}
      />

      {/* Modal de la boutique */}
      {showShop && (
        <ShopModal
          onClose={() => { setShowShop(false) }}
          creatureName={currentMonster.name}
          creatureId={currentMonster._id}
        />
      )}

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }

        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.4; transform: scale(0.9) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(-180deg); }
        }

        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-twinkle-delayed { animation: twinkle-delayed 4s ease-in-out infinite; }
        .animate-shine { animation: shine 1.5s ease-in-out; }
      `}
      </style>
    </div>
  )
}
