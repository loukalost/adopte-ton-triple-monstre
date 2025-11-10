import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

/**
 * Hook personnalisé pour gérer les animations de confettis
 * Principe SRP: Responsabilité unique de gestion des confettis
 *
 * @param {boolean} isActive - Déclenche les confettis quand true
 * @returns {React.RefObject<HTMLCanvasElement>} Référence au canvas pour les confettis
 */
export function useConfetti (isActive: boolean): React.RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive || canvasRef.current === null) return

    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true
    })

    /**
     * Lance une explosion de confettis
     */
    const fireConfetti = (): void => {
      // Explosion centrale
      void myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Rafales latérales
      void myConfetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      })

      void myConfetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      })
    }

    // Première vague
    fireConfetti()

    // Deuxième vague après 200ms
    const timeout1 = setTimeout(() => { fireConfetti() }, 200)

    // Confettis continus pour 2 secondes
    const interval = setInterval(() => {
      void myConfetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1']
      })
      void myConfetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1']
      })
    }, 100)

    // Explosion finale
    const timeout2 = setTimeout(() => {
      void myConfetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#95E1D3', '#F38181']
      })
    }, 2000)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearInterval(interval)
    }
  }, [isActive])

  return canvasRef
}
