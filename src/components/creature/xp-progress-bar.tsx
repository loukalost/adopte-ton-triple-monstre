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
 * Barre de progression d'XP ludique avec animations - Version Jeu Vidéo Fun
 *
 * Responsabilité unique : afficher visuellement la progression d'XP
 * du monstre avec des animations spectaculaires de gain et des effets visuels.
 *
 * Nouveau design :
 * - Barre ÉNORME et colorée
 * - Animations explosives de particules
 * - Effets de brillance

 *
 * @param {XpProgressBarProps} props - Props du composant
 * @returns {React.ReactNode} Barre de progression d'XP
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
        <div className='flex items-center gap-2'>
          <span className='text-xl'>⚡</span>
          <span className='text-sm font-bold text-[color:var(--color-electric-600)]'>Expérience</span>
        </div>
        <div className='bg-[color:var(--color-electric-500)] text-white font-bold text-xs px-3 py-1 rounded-lg shadow-lg'>
          {displayXp} / {maxXp} XP
        </div>
      </div>

      {/* Barre de progression */}
      <div className='relative w-full h-8 bg-[color:var(--color-neutral-200)] rounded-lg overflow-hidden border border-[color:var(--color-neutral-300)] shadow-lg'>
        {/* Barre de remplissage */}
        <div
          className='absolute top-0 left-0 h-full bg-[color:var(--color-electric-500)] transition-all duration-500 ease-out flex items-center justify-end pr-2'
          style={{ width: `${percentage}%` }}
        >
          {/* Étoiles de progression */}
          {percentage > 15 && (
            <span className='text-white text-lg'>⭐</span>
          )}
        </div>

        {/* Niveau à l'intérieur de la barre */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-white/90 px-3 py-1 rounded-lg shadow-lg border border-[color:var(--color-electric-300)]'>
            <span className='text-xs font-bold text-[color:var(--color-electric-600)]'>
              Niveau {level}
            </span>
          </div>
        </div>
      </div>

      {/* Animation de gain d'XP */}
      {showGainAnimation && xpGained > 0 && (
        <>
          <div className='absolute -top-8 right-0 animate-explode-up'>
            <div className='bg-[color:var(--color-electric-500)] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2'>
              <span className='text-lg'>🎉</span>
              <span>+{xpGained} XP</span>
            </div>
          </div>

          {/* Particules explosives d'XP */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='absolute top-1/2 left-1/2 text-3xl animate-explode-particle'
              style={{
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${i * 45}deg)`
              }}
            >
              {i % 2 === 0 ? '⭐' : '✨'}
            </div>
          ))}
        </>
      )}

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes explode-up {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(1) translateY(-60px);
          }
        }

        @keyframes explode-particle {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-100px) scale(1.5);
          }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .animate-explode-up { animation: explode-up 2s ease-out forwards; }
        .animate-explode-particle { animation: explode-particle 1.5s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}
      </style>
    </div>
  )
}
