'use client'

import { useEffect, useState } from 'react'

/**
 * Props pour le composant XpProgressBar
 */
interface XpProgressBarProps {
  /** XP actuel du monstre */
  currentXp: number
  /** XP maximum pour le niveau actuel */
  maxXp: number
  /** Niveau actuel du monstre */
  level: number
  /** Si true, joue une animation de gain d'XP */
  showXpGain?: boolean
  /** Montant d'XP gagné (pour l'animation) */
  xpGained?: number
}

/**
 * Barre de progression d'XP ludique avec animations
 *
 * Responsabilité unique : afficher visuellement la progression d'XP
 * du monstre avec des animations de gain et des effets visuels.
 *
 * Fonctionnalités :
 * - Barre de progression colorée avec dégradé
 * - Animation de remplissage fluide
 * - Affichage du gain d'XP en popup
 * - Effet de particules lors du gain d'XP
 *
 * @param {XpProgressBarProps} props - Props du composant
 * @returns {React.ReactNode} Barre de progression d'XP
 *
 * @example
 * <XpProgressBar
 *   currentXp={75}
 *   maxXp={100}
 *   level={5}
 *   showXpGain={true}
 *   xpGained={25}
 * />
 */
export function XpProgressBar ({
  currentXp,
  maxXp,
  level,
  showXpGain = false,
  xpGained = 0
}: XpProgressBarProps): React.ReactNode {
  const [displayXp, setDisplayXp] = useState(currentXp)
  const [showGainAnimation, setShowGainAnimation] = useState(false)

  // Animation du gain d'XP
  useEffect(() => {
    if (showXpGain && xpGained > 0) {
      setShowGainAnimation(true)

      // Animation progressive du remplissage
      const startXp = currentXp - xpGained
      const duration = 800 // ms
      const steps = 30
      const increment = xpGained / steps
      const interval = duration / steps

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        if (currentStep >= steps) {
          setDisplayXp(currentXp)
          clearInterval(timer)
        } else {
          setDisplayXp(Math.floor(startXp + (increment * currentStep)))
        }
      }, interval)

      // Masquer l'animation de gain après 2 secondes
      setTimeout(() => {
        setShowGainAnimation(false)
      }, 2000)

      return () => clearInterval(timer)
    } else {
      setDisplayXp(currentXp)
    }
  }, [currentXp, xpGained, showXpGain])

  // Calcul du pourcentage de progression
  const percentage = Math.min((displayXp / maxXp) * 100, 100)

  return (
    <div className='relative'>
      {/* Label XP */}
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm font-medium text-gray-600'>Expérience</span>
        <span className='text-sm font-bold text-moccaccino-600'>
          {displayXp} / {maxXp} XP
        </span>
      </div>

      {/* Barre de progression */}
      <div className='relative w-full h-8 bg-gray-200 rounded-full overflow-hidden border-3 border-moccaccino-200 shadow-inner'>
        {/* Barre de remplissage avec dégradé */}
        <div
          className='absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-blue-400 via-lochinvar-400 to-moccaccino-400 transition-all duration-500 ease-out flex items-center justify-end pr-2'
          style={{ width: `${percentage}%` }}
        >
          {/* Effet de brillance */}
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer' />

          {/* Étoile de progression */}
          {percentage > 10 && (
            <span className='text-white text-lg animate-bounce'>⭐</span>
          )}
        </div>

        {/* Niveau à l'intérieur de la barre */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-xs font-bold text-gray-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'>
            Niveau {level}
          </span>
        </div>
      </div>

      {/* Animation de gain d'XP */}
      {showGainAnimation && xpGained > 0 && (
        <div className='absolute -top-8 right-0 animate-float-up'>
          <div className='bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1'>
            <span>+{xpGained} XP</span>
            <span className='animate-pulse'>✨</span>
          </div>
        </div>
      )}

      {/* Particules d'XP (effet visuel) */}
      {showGainAnimation && (
        <>
          <div className='absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-particle-1' />
          <div className='absolute top-0 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-particle-2' />
          <div className='absolute top-0 left-3/4 w-2 h-2 bg-yellow-500 rounded-full animate-particle-3' />
        </>
      )}
    </div>
  )
}
