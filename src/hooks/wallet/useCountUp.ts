import { useEffect, useState } from 'react'

/**
 * Hook personnalisé pour animer un compteur de 0 à une valeur cible
 * Principe SRP: Responsabilité unique d'animation de compteur
 *
 * @param {number} end - La valeur finale à atteindre
 * @param {number} duration - Durée de l'animation en ms (défaut: 2000ms)
 * @param {number} start - Valeur de départ (défaut: 0)
 * @returns {number} La valeur actuelle du compteur
 */
export function useCountUp (
  end: number,
  duration: number = 2000,
  start: number = 0
): number {
  const [count, setCount] = useState(start)

  useEffect(() => {
    // Si la valeur de fin est 0, pas besoin d'animer
    if (end === 0) {
      setCount(0)
      return
    }

    let startTimestamp: number | null = null
    const step = (timestamp: number): void => {
      if (startTimestamp === null) {
        startTimestamp = timestamp
      }

      const progress = Math.min((timestamp - startTimestamp) / duration, 1)

      // Fonction d'easing pour un mouvement plus naturel (easeOutExpo)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      setCount(Math.floor(easeOutExpo * (end - start) + start))

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [end, duration, start])

  return count
}
