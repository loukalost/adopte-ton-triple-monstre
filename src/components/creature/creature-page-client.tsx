'use client'

import { useEffect, useState, useRef } from 'react'
import type { MonsterTraits, DBMonster } from '@/types/monster'
import type { MonsterAction } from '@/hooks/monsters'
import { parseMonsterTraits } from '@/lib/utils'
import { CreatureHeader } from './creature-header'
import { CreatureMonsterDisplay } from './creature-monster-display'
import { CreatureStatsPanel } from './creature-stats-panel'
import { CreatureTraitsPanel } from './creature-traits-panel'
import { CreatureColorsPanel } from './creature-colors-panel'
import { LevelUpAnimation } from './level-up-animation'
import Button from '../button'
import { useRouter } from 'next/navigation'

/**
 * Props pour le composant CreaturePageClient
 */
interface CreaturePageClientProps {
  /** Données du monstre à afficher */
  monster: DBMonster
}

/**
 * Composant client de la page de détail d'une créature
 *
 * Responsabilité unique : orchestrer l'affichage de toutes les sections
 * de la page de détail (header, monstre animé, stats, traits, couleurs).
 *
 * Applique les principes SOLID :
 * - SRP : Délègue chaque section à un composant spécialisé
 * - OCP : Extensible via l'ajout de nouveaux panneaux
 * - DIP : Dépend des abstractions (types, interfaces)
 *
 * @param {CreaturePageClientProps} props - Props du composant
 * @returns {React.ReactNode} Page complète de détail de la créature
 *
 * @example
 * <CreaturePageClient monster={monsterData} />
 */
export function CreaturePageClient ({ monster }: CreaturePageClientProps): React.ReactNode {
  const [currentAction, setCurrentAction] = useState<MonsterAction>(null)
  const [currentMonster, setCurrentMonster] = useState<DBMonster>(monster)
  const [showXpGain, setShowXpGain] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
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
    <div className='min-h-screen bg-gradient-to-b from-lochinvar-50 to-fuchsia-blue-50 py-12'>
      <div className='container mx-auto px-4 max-w-4xl'>
        {/* En-tête avec nom et niveau */}
        <Button onClick={() => { void router.push('/dashboard') }}>
          {'< '}Retour au dashboard
        </Button>
        <CreatureHeader name={currentMonster.name} level={currentMonster.level} />

        {/* Grille principale : monstre + informations */}
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Colonne gauche : Monstre animé et actions */}
          <CreatureMonsterDisplay
            traits={traits}
            state={currentMonster.state}
            level={currentMonster.level}
            currentAction={currentAction}
            onAction={handleAction}
            monsterId={currentMonster._id}
          />

          {/* Colonne droite : Panneaux d'informations */}
          <div className='space-y-6'>
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
    </div>
  )
}
