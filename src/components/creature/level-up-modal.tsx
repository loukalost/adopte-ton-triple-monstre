'use client'

import { useEffect } from 'react'

interface LevelUpModalProps {
  open: boolean
  newLevel: number
  xpGained?: number
  onClose: () => void
}

export function LevelUpModal ({ open, newLevel, xpGained = 0, onClose }: LevelUpModalProps): React.ReactNode {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => onClose(), 2600)
    return () => clearTimeout(timer)
  }, [open, onClose])

  if (!open) return null

  // Simple confetti using absolute divs animated with keyframes defined inline
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center pointer-events-none'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto' onClick={onClose} />

      <div className='relative pointer-events-auto bg-white rounded-2xl p-6 shadow-2xl w-[320px] text-center'>
        <h3 className='text-2xl font-bold text-moccaccino-600 mb-2'>Nouveau niveau !</h3>
        <p className='text-gray-700 mb-4'>Votre monstre a atteint le niveau <span className='font-semibold'>{newLevel}</span></p>
        <p className='text-sm text-gray-500 mb-4'>+{xpGained} XP</p>
        <button type='button' onClick={onClose} className='mt-2 px-4 py-2 rounded-md bg-moccaccino-500 text-white font-semibold'>Fermer</button>
      </div>

      {/* Confettis */}
      <div className='pointer-events-none absolute inset-0'>
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className='absolute w-2 h-3 rounded-sm animate-confetti'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              background: ['#F7533C', '#469086', '#8F72E0', '#FFD166'][i % 4],
              transform: `translateY(-10px) rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 0.6}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1 }
          100% { transform: translateY(140vh) rotate(360deg); opacity: 0 }
        }
        .animate-confetti {
          animation: confetti 2.2s cubic-bezier(.2,.7,.2,1) forwards;
        }
      `}
      </style>
    </div>
  )
}
