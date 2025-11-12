'use client'

import { useEffect, useRef } from 'react'
import type { AccessoryDrawData } from '@/types/accessories'
import { drawHat, drawGlasses, drawShoes } from '@/lib/utils/draw-accessories'

interface AccessoryPreviewProps {
  drawData: AccessoryDrawData
  category: 'hat' | 'glasses' | 'shoes'
  size?: number
}

/**
 * Affiche une prévisualisation Canvas d'un accessoire
 * @param drawData - Données de dessin (couleurs, type)
 * @param category - Catégorie d'accessoire
 * @param size - Taille du canvas (par défaut 60px)
 */
export function AccessoryPreview ({
  drawData,
  category,
  size = 60
}: AccessoryPreviewProps): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) return

    const ctx = canvas.getContext('2d')
    if (ctx == null) return

    canvas.width = size
    canvas.height = size

    let animationId: number

    const animate = (): void => {
      frameRef.current += 1

      // Clear canvas
      ctx.clearRect(0, 0, size, size)

      // Calculer les paramètres
      const centerX = size / 2
      const centerY = size / 2
      const pixelSize = Math.max(1, Math.floor(size / 30)) // Adapter la taille des pixels

      const primaryColor = drawData.primaryColor
      const secondaryColor = drawData.secondaryColor ?? primaryColor

      try {
        switch (category) {
          case 'hat':
            drawHat(
              ctx,
              drawData.type as any,
              primaryColor,
              secondaryColor,
              centerX,
              centerY - 5,
              pixelSize,
              frameRef.current
            )
            break
          case 'glasses':
            drawGlasses(
              ctx,
              drawData.type as any,
              primaryColor,
              secondaryColor,
              centerX,
              centerY,
              pixelSize
            )
            break
          case 'shoes':
            // Pour les chaussures, on affiche sans animation
            drawShoes(
              ctx,
              drawData.type as any,
              primaryColor,
              secondaryColor,
              centerX,
              centerY,
              pixelSize,
              0 // armWave = 0 pour preview statique
            )
            break
        }
      } catch (error) {
        console.error('Error drawing accessory preview:', error)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId !== undefined) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [drawData, category, size])

  return (
    <canvas
      ref={canvasRef}
      className='pixelated'
      style={{
        imageRendering: 'pixelated',
        width: `${size}px`,
        height: `${size}px`
      }}
    />
  )
}
