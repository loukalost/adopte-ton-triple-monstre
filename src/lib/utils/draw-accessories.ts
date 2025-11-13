/**
 * Fonctions de dessin pour les accessoires pixelisés
 * Chaque fonction dessine un type d'accessoire spécifique
 */

import type { HatType, GlassesType, ShoesType } from '@/types/accessories'

/**
 * Dessine un chapeau sur le monstre
 */
export function drawHat (
  ctx: CanvasRenderingContext2D,
  type: HatType,
  primaryColor: string,
  secondaryColor: string | undefined,
  x: number,
  y: number,
  pixelSize: number,
  frame: number
): void {
  const bobble = Math.sin(frame * 0.05) * 2

  // Sauvegarder l'état du contexte pour appliquer la rotation
  ctx.save()

  // Retourner les chapeaux de 180 degrés (axe vertical)
  ctx.translate(x, y)
  ctx.scale(1, -1)
  ctx.translate(-x, -y)

  ctx.fillStyle = primaryColor

  switch (type) {
    case 'crown':
      // Couronne dorée
      ctx.fillStyle = secondaryColor ?? '#FFD700'
      // Base de la couronne
      for (let i = 0; i < 9; i++) {
        ctx.fillRect(x + (i - 4) * pixelSize, y - 6 + bobble, pixelSize, pixelSize * 2)
      }
      // Pointes de la couronne
      ctx.fillRect(x - 3 * pixelSize, y - 12 + bobble, pixelSize, pixelSize)
      ctx.fillRect(x - pixelSize, y - 12 + bobble, pixelSize, pixelSize)
      ctx.fillRect(x + pixelSize, y - 12 + bobble, pixelSize, pixelSize)
      ctx.fillRect(x + 3 * pixelSize, y - 12 + bobble, pixelSize, pixelSize)
      // Joyaux
      ctx.fillStyle = primaryColor
      ctx.fillRect(x - 2 * pixelSize, y - 4 + bobble, pixelSize, pixelSize)
      ctx.fillRect(x, y - 4 + bobble, pixelSize, pixelSize)
      ctx.fillRect(x + 2 * pixelSize, y - 4 + bobble, pixelSize, pixelSize)
      break

    case 'cap':
      // Casquette
      // Visière
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(x - 6 * pixelSize + i * pixelSize, y + 6 + bobble, pixelSize, pixelSize)
      }
      // Partie principale
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
          if (row === 0 && (col === 0 || col === 6)) continue
          ctx.fillRect(x + (col - 3) * pixelSize, y - 6 + row * pixelSize + bobble, pixelSize, pixelSize)
        }
      }
      // Logo
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        ctx.fillRect(x, y + bobble, pixelSize, pixelSize)
      }
      break

    case 'tophat':
      // Haut-de-forme
      // Bord
      for (let i = 0; i < 11; i++) {
        ctx.fillRect(x + (i - 5) * pixelSize, y + 3 + bobble, pixelSize, pixelSize)
      }
      // Cylindre
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 7; col++) {
          ctx.fillRect(x + (col - 3) * pixelSize, y - 15 + row * pixelSize + bobble, pixelSize, pixelSize)
        }
      }
      // Ruban
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        for (let i = 0; i < 7; i++) {
          ctx.fillRect(x + (i - 3) * pixelSize, y - 3 + bobble, pixelSize, pixelSize)
        }
      }
      break

    case 'beanie':
      // Bonnet
      // Pompon
      ctx.fillRect(x, y - 15 + bobble, pixelSize * 2, pixelSize * 2)
      // Corps du bonnet
      for (let row = 0; row < 5; row++) {
        const width = 7 - row * 0.5
        for (let col = 0; col < width; col++) {
          ctx.fillRect(x + (col - width / 2) * pixelSize, y - 9 + row * pixelSize + bobble, pixelSize, pixelSize)
        }
      }
      // Rayures
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        for (let i = 0; i < 7; i++) {
          ctx.fillRect(x + (i - 3) * pixelSize, y - 6 + bobble, pixelSize, pixelSize)
        }
      }
      break

    case 'chef':
      // Toque de chef
      ctx.fillStyle = '#FFFFFF'
      // Partie haute gonflée
      for (let row = 0; row < 6; row++) {
        const width = row < 3 ? 7 + row : 10 - row
        for (let col = 0; col < width; col++) {
          ctx.fillRect(x + (col - width / 2) * pixelSize, y - 15 + row * pixelSize + bobble, pixelSize, pixelSize)
        }
      }
      // Bande
      for (let i = 0; i < 9; i++) {
        ctx.fillRect(x + (i - 4) * pixelSize, y - 3 + bobble, pixelSize, pixelSize * 2)
      }
      break

    case 'wizard':
      // Chapeau de sorcier
      // Pointe
      for (let row = 0; row < 12; row++) {
        const width = Math.max(1, 7 - Math.floor(row / 2))
        for (let col = 0; col < width; col++) {
          ctx.fillRect(x + (col - width / 2) * pixelSize, y - 21 + row * pixelSize + bobble, pixelSize, pixelSize)
        }
      }
      // Bord
      for (let i = 0; i < 11; i++) {
        ctx.fillRect(x + (i - 5) * pixelSize, y - 3 + bobble, pixelSize, pixelSize)
      }
      // Étoiles
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        ctx.fillRect(x + pixelSize, y - 12 + bobble, pixelSize, pixelSize)
        ctx.fillRect(x - 2 * pixelSize, y - 15 + bobble, pixelSize, pixelSize)
      }
      break

    case 'headband':
      // Bandeau
      for (let i = 0; i < 9; i++) {
        ctx.fillRect(x + (i - 4) * pixelSize, y + bobble, pixelSize, pixelSize * 2)
      }
      // Nœud ou bijou
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        ctx.fillRect(x - 3 * pixelSize, y - pixelSize + bobble, pixelSize * 2, pixelSize * 2)
      }
      break

    case 'bow':
      // Nœud/ruban
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
      }
      // Partie gauche du nœud
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - 5 * pixelSize + i * pixelSize, y - 3 + bobble, pixelSize, pixelSize * 3)
      }
      // Partie droite du nœud
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 3 * pixelSize + i * pixelSize, y - 3 + bobble, pixelSize, pixelSize * 3)
      }
      // Centre
      ctx.fillStyle = primaryColor
      ctx.fillRect(x - pixelSize, y - 3 + bobble, pixelSize * 2, pixelSize * 3)
      break
  }

  // Restaurer l'état du contexte après la rotation
  ctx.restore()
}

/**
 * Dessine des lunettes sur le monstre
 */
export function drawGlasses (
  ctx: CanvasRenderingContext2D,
  type: GlassesType,
  primaryColor: string,
  secondaryColor: string | undefined,
  x: number,
  y: number,
  pixelSize: number
): void {
  ctx.fillStyle = primaryColor

  switch (type) {
    case 'round':
      // Lunettes rondes
      // Verre gauche
      ctx.fillRect(x - 15, y + 21, pixelSize * 3, pixelSize)
      ctx.fillRect(x - 15, y + 27, pixelSize * 3, pixelSize)
      ctx.fillRect(x - 18, y + 24, pixelSize, pixelSize * 3)
      ctx.fillRect(x - 12, y + 24, pixelSize, pixelSize * 3)
      // Verre droit
      ctx.fillRect(x + 9, y + 21, pixelSize * 3, pixelSize)
      ctx.fillRect(x + 9, y + 27, pixelSize * 3, pixelSize)
      ctx.fillRect(x + 6, y + 24, pixelSize, pixelSize * 3)
      ctx.fillRect(x + 12, y + 24, pixelSize, pixelSize * 3)
      // Pont
      ctx.fillRect(x - 3, y + 24, pixelSize * 2, pixelSize)
      break

    case 'square':
      // Lunettes carrées
      // Verre gauche
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - 18 + i * pixelSize, y + 21, pixelSize, pixelSize)
        ctx.fillRect(x - 18 + i * pixelSize, y + 27, pixelSize, pixelSize)
      }
      for (let i = 0; i < 2; i++) {
        ctx.fillRect(x - 18, y + 21 + i * pixelSize, pixelSize, pixelSize * 2)
        ctx.fillRect(x - 12, y + 21 + i * pixelSize, pixelSize, pixelSize * 2)
      }
      // Verre droit
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 6 + i * pixelSize, y + 21, pixelSize, pixelSize)
        ctx.fillRect(x + 6 + i * pixelSize, y + 27, pixelSize, pixelSize)
      }
      for (let i = 0; i < 2; i++) {
        ctx.fillRect(x + 6, y + 21 + i * pixelSize, pixelSize, pixelSize * 2)
        ctx.fillRect(x + 12, y + 21 + i * pixelSize, pixelSize, pixelSize * 2)
      }
      // Pont
      ctx.fillRect(x - 3, y + 24, pixelSize * 2, pixelSize)
      break

    case 'cool':
      // Lunettes de soleil
      ctx.fillStyle = '#000000'
      // Verre gauche (plein)
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          ctx.fillRect(x - 18 + col * pixelSize, y + 21 + row * pixelSize * 2, pixelSize, pixelSize * 2)
        }
      }
      // Verre droit (plein)
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          ctx.fillRect(x + 6 + col * pixelSize, y + 21 + row * pixelSize * 2, pixelSize, pixelSize * 2)
        }
      }
      // Monture
      ctx.fillStyle = primaryColor
      ctx.fillRect(x - 18, y + 21, pixelSize * 3, pixelSize)
      ctx.fillRect(x - 18, y + 27, pixelSize * 3, pixelSize)
      ctx.fillRect(x + 6, y + 21, pixelSize * 3, pixelSize)
      ctx.fillRect(x + 6, y + 27, pixelSize * 3, pixelSize)
      // Pont
      ctx.fillRect(x - 3, y + 24, pixelSize * 2, pixelSize)
      break

    case 'star':
      // Lunettes étoiles
      // Étoile gauche
      ctx.fillRect(x - 15, y + 21, pixelSize, pixelSize * 2)
      ctx.fillRect(x - 18, y + 24, pixelSize * 3, pixelSize)
      ctx.fillRect(x - 17, y + 21, pixelSize, pixelSize)
      ctx.fillRect(x - 17, y + 27, pixelSize, pixelSize)
      ctx.fillRect(x - 13, y + 21, pixelSize, pixelSize)
      ctx.fillRect(x - 13, y + 27, pixelSize, pixelSize)
      // Étoile droite
      ctx.fillRect(x + 9, y + 21, pixelSize, pixelSize * 2)
      ctx.fillRect(x + 6, y + 24, pixelSize * 3, pixelSize)
      ctx.fillRect(x + 7, y + 21, pixelSize, pixelSize)
      ctx.fillRect(x + 7, y + 27, pixelSize, pixelSize)
      ctx.fillRect(x + 11, y + 21, pixelSize, pixelSize)
      ctx.fillRect(x + 11, y + 27, pixelSize, pixelSize)
      // Pont
      ctx.fillRect(x - 3, y + 24, pixelSize * 2, pixelSize)
      break

    case 'heart':
      // Lunettes cœurs
      // Cœur gauche
      ctx.fillRect(x - 17, y + 22, pixelSize, pixelSize)
      ctx.fillRect(x - 13, y + 22, pixelSize, pixelSize)
      ctx.fillRect(x - 18, y + 23, pixelSize * 4, pixelSize)
      ctx.fillRect(x - 17, y + 24, pixelSize * 3, pixelSize * 2)
      ctx.fillRect(x - 16, y + 26, pixelSize * 2, pixelSize)
      ctx.fillRect(x - 15, y + 27, pixelSize, pixelSize)
      // Cœur droit
      ctx.fillRect(x + 7, y + 22, pixelSize, pixelSize)
      ctx.fillRect(x + 11, y + 22, pixelSize, pixelSize)
      ctx.fillRect(x + 6, y + 23, pixelSize * 4, pixelSize)
      ctx.fillRect(x + 7, y + 24, pixelSize * 3, pixelSize * 2)
      ctx.fillRect(x + 8, y + 26, pixelSize * 2, pixelSize)
      ctx.fillRect(x + 9, y + 27, pixelSize, pixelSize)
      // Pont
      ctx.fillRect(x - 3, y + 24, pixelSize * 2, pixelSize)
      break

    case 'retro':
      // Lunettes rétro/papillon
      // Verre gauche large
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x - 21 + i * pixelSize, y + 21, pixelSize, pixelSize)
        ctx.fillRect(x - 21 + i * pixelSize, y + 27, pixelSize, pixelSize)
      }
      ctx.fillRect(x - 21, y + 24, pixelSize, pixelSize)
      ctx.fillRect(x - 15, y + 24, pixelSize, pixelSize)
      // Verre droit large
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x + 9 + i * pixelSize, y + 21, pixelSize, pixelSize)
        ctx.fillRect(x + 9 + i * pixelSize, y + 27, pixelSize, pixelSize)
      }
      ctx.fillRect(x + 9, y + 24, pixelSize, pixelSize)
      ctx.fillRect(x + 15, y + 24, pixelSize, pixelSize)
      // Pont
      ctx.fillRect(x - 3, y + 24, pixelSize * 2, pixelSize)
      break

    case 'aviator':
      // Lunettes aviateur
      // Verre gauche (forme goutte)
      for (let row = 0; row < 3; row++) {
        ctx.fillRect(x - 18 + row, y + 21 + row * 2, pixelSize * 3, pixelSize)
      }
      ctx.fillRect(x - 15, y + 27, pixelSize, pixelSize)
      // Verre droit (forme goutte)
      for (let row = 0; row < 3; row++) {
        ctx.fillRect(x + 6 + row, y + 21 + row * 2, pixelSize * 3, pixelSize)
      }
      ctx.fillRect(x + 9, y + 27, pixelSize, pixelSize)
      // Pont
      ctx.fillRect(x - 3, y + 24, pixelSize * 2, pixelSize)
      break

    case 'monocle':
      // Monocle unique
      // Un seul verre (gauche)
      ctx.fillRect(x - 15, y + 21, pixelSize * 3, pixelSize)
      ctx.fillRect(x - 15, y + 27, pixelSize * 3, pixelSize)
      ctx.fillRect(x - 18, y + 24, pixelSize, pixelSize * 3)
      ctx.fillRect(x - 12, y + 24, pixelSize, pixelSize * 3)
      // Chaînette
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        ctx.fillRect(x - 18, y + 27, pixelSize, pixelSize)
        ctx.fillRect(x - 21, y + 30, pixelSize, pixelSize)
      }
      break
  }
}

/**
 * Dessine des chaussures sur le monstre
 */
export function drawShoes (
  ctx: CanvasRenderingContext2D,
  type: ShoesType,
  primaryColor: string,
  secondaryColor: string | undefined,
  x: number,
  y: number,
  pixelSize: number,
  armWave: number
): void {
  ctx.fillStyle = primaryColor

  const leftShoeY = y
  const rightShoeY = y

  switch (type) {
    case 'sneakers':
      // Baskets
      // Chaussure gauche
      ctx.fillRect(x - 27, leftShoeY, pixelSize * 3, pixelSize * 2)
      ctx.fillRect(x - 30, leftShoeY + pixelSize, pixelSize, pixelSize)
      // Lacets
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        ctx.fillRect(x - 27, leftShoeY, pixelSize, pixelSize)
        ctx.fillRect(x - 24, leftShoeY + pixelSize, pixelSize, pixelSize)
      }
      ctx.fillStyle = primaryColor
      // Chaussure droite
      ctx.fillRect(x + 21, rightShoeY, pixelSize * 3, pixelSize * 2)
      ctx.fillRect(x + 27, rightShoeY + pixelSize, pixelSize, pixelSize)
      // Lacets
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        ctx.fillRect(x + 21, rightShoeY, pixelSize, pixelSize)
        ctx.fillRect(x + 24, rightShoeY + pixelSize, pixelSize, pixelSize)
      }
      break

    case 'boots':
      // Bottes
      // Botte gauche
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x - 27, leftShoeY - i * pixelSize * 2, pixelSize * 3, pixelSize * 2)
      }
      // Semelle
      ctx.fillRect(x - 30, leftShoeY + pixelSize, pixelSize * 4, pixelSize)
      // Botte droite
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 21, rightShoeY - i * pixelSize * 2, pixelSize * 3, pixelSize * 2)
      }
      // Semelle
      ctx.fillRect(x + 20, rightShoeY + pixelSize, pixelSize * 4, pixelSize)
      break

    case 'sandals':
      // Sandales
      ctx.fillStyle = secondaryColor ?? primaryColor
      // Sandale gauche (semelle)
      ctx.fillRect(x - 27, leftShoeY + pixelSize, pixelSize * 3, pixelSize)
      // Lanières
      ctx.fillStyle = primaryColor
      ctx.fillRect(x - 27, leftShoeY, pixelSize, pixelSize)
      ctx.fillRect(x - 24, leftShoeY, pixelSize, pixelSize)
      // Sandale droite (semelle)
      ctx.fillStyle = secondaryColor ?? primaryColor
      ctx.fillRect(x + 21, rightShoeY + pixelSize, pixelSize * 3, pixelSize)
      // Lanières
      ctx.fillStyle = primaryColor
      ctx.fillRect(x + 21, rightShoeY, pixelSize, pixelSize)
      ctx.fillRect(x + 24, rightShoeY, pixelSize, pixelSize)
      break

    case 'heels':
      // Talons hauts
      // Chaussure gauche
      ctx.fillRect(x - 27, leftShoeY, pixelSize * 3, pixelSize)
      ctx.fillRect(x - 30, leftShoeY + pixelSize, pixelSize, pixelSize)
      ctx.fillRect(x - 27, leftShoeY + pixelSize, pixelSize, pixelSize)
      // Talon
      ctx.fillRect(x - 30, leftShoeY + pixelSize * 2, pixelSize, pixelSize * 2)
      // Chaussure droite
      ctx.fillRect(x + 21, rightShoeY, pixelSize * 3, pixelSize)
      ctx.fillRect(x + 27, rightShoeY + pixelSize, pixelSize, pixelSize)
      ctx.fillRect(x + 24, rightShoeY + pixelSize, pixelSize, pixelSize)
      // Talon
      ctx.fillRect(x + 27, rightShoeY + pixelSize * 2, pixelSize, pixelSize * 2)
      break

    case 'rollers':
      // Rollers
      // Patin gauche
      ctx.fillRect(x - 27, leftShoeY - pixelSize, pixelSize * 3, pixelSize * 2)
      // Roues
      ctx.fillStyle = secondaryColor ?? '#333333'
      ctx.fillRect(x - 30, leftShoeY + pixelSize, pixelSize, pixelSize)
      ctx.fillRect(x - 27, leftShoeY + pixelSize, pixelSize, pixelSize)
      ctx.fillRect(x - 24, leftShoeY + pixelSize, pixelSize, pixelSize)
      // Patin droit
      ctx.fillStyle = primaryColor
      ctx.fillRect(x + 21, rightShoeY - pixelSize, pixelSize * 3, pixelSize * 2)
      // Roues
      ctx.fillStyle = secondaryColor ?? '#333333'
      ctx.fillRect(x + 21, rightShoeY + pixelSize, pixelSize, pixelSize)
      ctx.fillRect(x + 24, rightShoeY + pixelSize, pixelSize, pixelSize)
      ctx.fillRect(x + 27, rightShoeY + pixelSize, pixelSize, pixelSize)
      break

    case 'flippers':
      // Palmes
      // Palme gauche (large)
      ctx.fillRect(x - 33, leftShoeY, pixelSize * 5, pixelSize * 2)
      ctx.fillRect(x - 36, leftShoeY + pixelSize, pixelSize * 2, pixelSize)
      // Palme droite (large)
      ctx.fillRect(x + 24, rightShoeY, pixelSize * 5, pixelSize * 2)
      ctx.fillRect(x + 30, rightShoeY + pixelSize, pixelSize * 2, pixelSize)
      break

    case 'slippers':
      // Pantoufles
      // Pantoufle gauche
      ctx.fillRect(x - 27, leftShoeY, pixelSize * 3, pixelSize * 2)
      // Pompon
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        ctx.fillRect(x - 27, leftShoeY - pixelSize, pixelSize, pixelSize)
      }
      ctx.fillStyle = primaryColor
      // Pantoufle droite
      ctx.fillRect(x + 21, rightShoeY, pixelSize * 3, pixelSize * 2)
      // Pompon
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
        ctx.fillRect(x + 24, rightShoeY - pixelSize, pixelSize, pixelSize)
      }
      break

    case 'wing': {
      // Chaussures ailées
      const wingBounce = Math.sin(armWave * 0.3) * 3
      // Chaussure gauche
      ctx.fillRect(x - 27, leftShoeY, pixelSize * 3, pixelSize * 2)
      // Aile
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
      }
      ctx.fillRect(x - 30, leftShoeY - wingBounce, pixelSize, pixelSize * 2)
      ctx.fillRect(x - 33, leftShoeY + pixelSize - wingBounce, pixelSize, pixelSize)
      ctx.fillStyle = primaryColor
      // Chaussure droite
      ctx.fillRect(x + 21, rightShoeY, pixelSize * 3, pixelSize * 2)
      // Aile
      if (secondaryColor !== null && secondaryColor !== undefined) {
        ctx.fillStyle = secondaryColor
      }
      ctx.fillRect(x + 27, rightShoeY - wingBounce, pixelSize, pixelSize * 2)
      ctx.fillRect(x + 30, rightShoeY + pixelSize - wingBounce, pixelSize, pixelSize)
      break
    }
  }
}
