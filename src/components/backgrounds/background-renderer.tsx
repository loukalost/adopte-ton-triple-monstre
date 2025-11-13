/**
 * Composant de rendu d'arrière-plans
 * Respecte OCP: Extensible pour de nouveaux types sans modification
 * Respecte SRP: Uniquement responsable du rendu visuel
 */

'use client'

import { useEffect, useRef } from 'react'
import type { BackgroundData } from '@/types/backgrounds'

interface BackgroundRendererProps {
  backgroundData: BackgroundData
  className?: string
}

/**
 * Rendu d'un arrière-plan de type gradient
 */
function GradientBackground ({ backgroundData, className }: { backgroundData: BackgroundData, className?: string }): React.ReactNode {
  if (backgroundData.type !== 'gradient') return null

  const directions: Record<string, string> = {
    'to-bottom': 'to bottom',
    'to-top': 'to top',
    'to-right': 'to right',
    'to-left': 'to left',
    'to-bottom-right': 'to bottom right',
    'to-bottom-left': 'to bottom left',
    'to-top-right': 'to top right',
    'to-top-left': 'to top left'
  }

  const direction = directions[backgroundData.direction] ?? 'to bottom'
  const gradient = `linear-gradient(${direction}, ${backgroundData.colors.join(', ')})`

  return (
    <div
      className={className ?? ''}
      style={{
        background: gradient,
        width: '100%',
        height: '100%'
      }}
    />
  )
}

/**
 * Rendu d'un arrière-plan de type pattern
 */
function PatternBackground ({ backgroundData, className }: { backgroundData: BackgroundData, className?: string }): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null || backgroundData.type !== 'pattern') return

    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    const { backgroundColor, patternColor, patternType, size, spacing } = backgroundData

    // Définir la taille du canvas
    canvas.width = 200
    canvas.height = 200

    // Remplir le fond
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dessiner le pattern
    ctx.fillStyle = patternColor

    switch (patternType) {
      case 'dots':
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            ctx.beginPath()
            ctx.arc(x, y, size / 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        break

      case 'stripes':
        for (let x = 0; x < canvas.width; x += spacing) {
          ctx.fillRect(x, 0, size, canvas.height)
        }
        break

      case 'stars':
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            drawStar(ctx, x, y, 5, size / 2, size / 4)
          }
        }
        break

      case 'hearts':
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            drawHeart(ctx, x, y, size)
          }
        }
        break

      case 'waves':
        for (let y = 0; y < canvas.height; y += spacing) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          for (let x = 0; x < canvas.width; x += 5) {
            const waveY = y + Math.sin(x / 10) * (size / 2)
            ctx.lineTo(x, waveY)
          }
          ctx.strokeStyle = patternColor
          ctx.lineWidth = 2
          ctx.stroke()
        }
        break

      case 'bubbles':
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            ctx.beginPath()
            ctx.arc(x, y, size / 2, 0, Math.PI * 2)
            ctx.strokeStyle = patternColor
            ctx.lineWidth = 2
            ctx.stroke()
          }
        }
        break
    }
  }, [backgroundData])

  return (
    <div className={className ?? ''} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated'
        }}
      />
    </div>
  )
}

/**
 * Rendu d'un arrière-plan animé
 */
function AnimatedBackground ({ backgroundData, className }: { backgroundData: BackgroundData, className?: string }): React.ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null || backgroundData.type !== 'animated') return

    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    const { colors, speed, density, animationType } = backgroundData

    canvas.width = 400
    canvas.height = 400

    let animationFrameId: number

    // Particules pour les animations
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
    }

    const particles: Particle[] = []

    // Initialiser les particules
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.5
      })
    }

    function animate (): void {
      if (ctx === null || canvas === null) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Mise à jour position
        particle.x += particle.vx
        particle.y += particle.vy

        // Rebond sur les bords
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Animation spécifique selon le type
        switch (animationType) {
          case 'floating-particles':
            particle.y -= 0.5
            if (particle.y < 0) particle.y = canvas.height
            break

          case 'starfield':
            particle.x += particle.vx * 2
            if (particle.x > canvas.width) {
              particle.x = 0
              particle.y = Math.random() * canvas.height
            }
            break

          case 'fireflies':
            particle.alpha = Math.sin(Date.now() / 500 + particle.x) * 0.5 + 0.5
            break
        }

        // Dessin
        ctx.save()
        ctx.globalAlpha = particle.alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [backgroundData])

  return (
    <div className={className ?? ''} style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}

/**
 * Fonctions utilitaires pour dessiner des formes
 */
function drawStar (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void {
  let rot = Math.PI / 2 * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }

  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
  ctx.fill()
}

function drawHeart (ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(size / 10, size / 10)

  ctx.beginPath()
  ctx.moveTo(0, 3)
  ctx.bezierCurveTo(-3, 0, -6, 3, -6, 6)
  ctx.bezierCurveTo(-6, 9, -3, 12, 0, 15)
  ctx.bezierCurveTo(3, 12, 6, 9, 6, 6)
  ctx.bezierCurveTo(6, 3, 3, 0, 0, 3)
  ctx.fill()

  ctx.restore()
}

/**
 * Composant principal qui route vers le bon renderer
 */
export default function BackgroundRenderer ({ backgroundData, className }: BackgroundRendererProps): React.ReactNode {
  switch (backgroundData.type) {
    case 'gradient':
      return <GradientBackground backgroundData={backgroundData} className={className} />
    case 'pattern':
      return <PatternBackground backgroundData={backgroundData} className={className} />
    case 'animated':
      return <AnimatedBackground backgroundData={backgroundData} className={className} />
    default:
      return null
  }
}
