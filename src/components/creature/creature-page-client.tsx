'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import type { MonsterTraits, DBMonster } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import type { OwnedAccessory, MonsterEquipment } from '@/types/accessories'
import { getCreatureAccessories } from '@/actions/accessories.actions'
import { parseMonsterTraits } from '@/lib/utils'
import { CreatureMonsterDisplay } from './creature-monster-display'
import { CreatureStatsPanel } from './creature-stats-panel'
import { LevelUpAnimation } from './level-up-animation'
import { useRouter } from 'next/navigation'
import { ShopModal } from './shop-modal'
import { CreatureTraitsPanel } from './creature-traits-panel'
import { CreatureColorsPanel } from './creature-colors-panel'
import { AccessorySlot } from '@/components/accessories/accessory-slot'
import { BackgroundSelector } from '@/components/backgrounds/background-selector'
import { getBackgroundById } from '@/config/backgrounds.config'

/**
 * Props pour le composant CreaturePageClient
 */
interface CreaturePageClientProps {
  /** Données du monstre à afficher */
  monster: DBMonster
  /** Accessoires équipés sur le monstre */
  accessories: OwnedAccessory[]
}

/**
 * Composant client de la page de détail d'une créature - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : orchestrer l'affichage de toutes les sections
 * de la page de détail (header, monstre animé, stats, traits, couleurs, personnalisation).
 *
 * Nouveau design :
 * - Fond ultra coloré avec animations
 * - Mise en avant du monstre
 * - Panels fun et engageants
 * - Section de personnalisation avec accessoires
 *
 * @param {CreaturePageClientProps} props - Props du composant
 * @returns {React.ReactNode} Page complète de détail de la créature
 */
export function CreaturePageClient ({ monster, accessories }: CreaturePageClientProps): React.ReactNode {
  const [currentAction, setCurrentAction] = useState<MonsterAction>(null)
  const [currentMonster, setCurrentMonster] = useState<DBMonster>(monster)
  const [currentAccessories, setCurrentAccessories] = useState<OwnedAccessory[]>(accessories)
  const [showXpGain, setShowXpGain] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false)
  const actionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Organiser les accessoires par catégorie
  const equipment: MonsterEquipment = {
    monsterId: currentMonster._id,
    hat: currentAccessories.find(a => a.accessoryId.startsWith('hat-')) ?? null,
    glasses: currentAccessories.find(a => a.accessoryId.startsWith('glasses-')) ?? null,
    shoes: currentAccessories.find(a => a.accessoryId.startsWith('shoes-')) ?? null
  }

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

  // Rafraîchir les accessoires quand ils changent
  const refreshAccessories = useCallback(async () => {
    try {
      const updatedAccessories = await getCreatureAccessories(currentMonster._id)
      setCurrentAccessories(updatedAccessories)
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des accessoires :', error)
    }
  }, [currentMonster._id])

  // Rafraîchir le monstre pour obtenir le backgroundId mis à jour
  const refreshMonster = useCallback(async () => {
    try {
      const response = await fetch(`/api/monster?id=${currentMonster._id}`)
      if (response.ok) {
        const updatedMonster = await response.json()
        setCurrentMonster(updatedMonster)
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du monstre :', error)
    }
  }, [currentMonster._id])

  // Rafraîchir les accessoires périodiquement pour synchroniser avec les équipements
  useEffect(() => {
    const interval = setInterval(() => {
      void refreshAccessories()
    }, 2000)

    return () => clearInterval(interval)
  }, [refreshAccessories])

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
    <div className='min-h-screen bg-[color:var(--color-neutral-50)] py-4 relative'>
      <div className='container relative z-10 mx-auto px-4 max-w-7xl'>
        {/* Barre de navigation */}
        <div className='flex justify-between items-center mb-4 gap-4'>
          {/* Bouton retour + nom */}
          <div className='flex items-center gap-4'>
            <button
              onClick={() => { void router.push('/app') }}
              className='inline-flex items-center gap-2 bg-[color:var(--color-neon-purple-500)] hover:bg-[color:var(--color-neon-purple-600)] text-white font-bold px-3 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95'
            >
              <span className='text-lg'>←</span>
              <span className='hidden sm:inline'>Retour</span>
            </button>

            {/* Nom du monstre inline */}
            <div className='flex items-center gap-2'>
              <span className='text-2xl'>👋</span>
              <h1 className='text-xl sm:text-2xl font-bold text-[color:var(--color-electric-600)]'>
                {currentMonster.name}
              </h1>
            </div>
          </div>

          {/* Bouton boutique */}
          <button
            onClick={() => { setShowShop(true) }}
            className='inline-flex items-center gap-2 bg-[color:var(--color-electric-500)] hover:bg-[color:var(--color-electric-600)] text-white font-bold px-3 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95'
          >
            <span className='text-lg'>🛍️</span>
            <span className='hidden sm:inline'>Boutique</span>

          </button>
        </div>

        {/* Grille principale - Alignée */}
        <div className='grid lg:grid-cols-2 gap-6 items-start'>
          {/* Colonne gauche : Monstre animé + Actions + Personnalisation */}
          <div className='space-y-6'>
            <CreatureMonsterDisplay
              traits={traits}
              state={currentMonster.state}
              level={currentMonster.level}
              currentAction={currentAction}
              onAction={handleAction}
              monsterId={currentMonster._id}
              equippedAccessories={currentAccessories}
              backgroundId={currentMonster.backgroundId}
            />

            {/* Section personnalisation avec accessoires */}
            <div className='rounded-lg bg-white p-6 shadow-lg border border-[color:var(--color-neutral-200)]'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='text-2xl'>🎨</span>
                <h2 className='text-xl font-bold text-[color:var(--color-electric-600)]'>
                  Personnalisation
                </h2>
              </div>

              {/* Grille des slots d'accessoires */}
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-bold text-[color:var(--color-neutral-600)] mb-2 uppercase tracking-wide'>
                    Accessoires
                  </h3>
                  <div className='grid grid-cols-3 gap-4'>
                    <AccessorySlot
                      monsterId={currentMonster._id}
                      category='hat'
                      equipped={equipment.hat}
                    />
                    <AccessorySlot
                      monsterId={currentMonster._id}
                      category='glasses'
                      equipped={equipment.glasses}
                    />
                    <AccessorySlot
                      monsterId={currentMonster._id}
                      category='shoes'
                      equipped={equipment.shoes}
                    />
                  </div>
                </div>

                {/* Slot d'arrière-plan */}
                <div>
                  <h3 className='text-sm font-bold text-[color:var(--color-neutral-600)] mb-2 uppercase tracking-wide'>
                    Arrière-plan
                  </h3>
                  <button
                    onClick={() => { setShowBackgroundSelector(true) }}
                    className='w-full p-4 rounded-xl bg-gradient-to-br from-[color:var(--color-electric-100)] to-[color:var(--color-electric-200)] border-2 border-[color:var(--color-electric-300)] hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-3xl'>🖼️</span>
                      <div className='text-left'>
                        <div className='font-bold text-[color:var(--color-neutral-800)]'>
                          {currentMonster.backgroundId !== null && currentMonster.backgroundId !== undefined
                            ? getBackgroundById(currentMonster.backgroundId)?.name ?? 'Arrière-plan'
                            : 'Aucun arrière-plan'}
                        </div>
                        <div className='text-xs text-[color:var(--color-neutral-600)]'>
                          {currentMonster.backgroundId !== null && currentMonster.backgroundId !== undefined
                            ? 'Cliquer pour changer'
                            : 'Cliquer pour choisir'}
                        </div>
                      </div>
                    </div>
                    <span className='text-2xl'>✨</span>
                  </button>
                </div>
              </div>
            </div>
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

      {/* Modal du sélecteur d'arrière-plan */}
      {showBackgroundSelector && (
        <BackgroundSelector
          monsterId={currentMonster._id}
          currentBackgroundId={currentMonster.backgroundId ?? null}
          onClose={() => { setShowBackgroundSelector(false) }}
          onSuccess={() => { void refreshMonster() }}
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
