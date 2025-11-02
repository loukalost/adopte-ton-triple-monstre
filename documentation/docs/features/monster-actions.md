---
sidebar_position: 2
---

# Actions des Monstres

Les actions permettent aux utilisateurs d'interagir avec leurs monstres et d'influencer leur état émotionnel.

## Types d'Actions

### Feed (Nourrir) 🍎

Donne de la nourriture au monstre pour restaurer son énergie.

```typescript
executeAction('feed')
```

**Effets** :
- Restaure 20-40% d'énergie
- Change l'état vers `happy`
- Animation : Sauts joyeux avec particules de nourriture (🍎, ✨, 🍏)
- Durée de l'animation : 2.5 secondes

**Conditions** :
- Le monstre ne doit pas être en état `happy` (déjà repu)
- Cooldown : 5 minutes entre chaque nourrissage

### Comfort (Réconforter) 💙

Apaise le monstre et réduit son stress.

```typescript
executeAction('comfort')
```

**Effets** :
- Réduit le stress de 30%
- Change l'état de `sad` ou `angry` vers `happy`
- Animation : Balancement doux avec cœurs bleus (💙, 💜, 💚)
- Durée de l'animation : 2.5 secondes

**Conditions** :
- Efficace uniquement si le monstre est `sad` ou `angry`

### Hug (Câliner) 💖

Montre de l'affection au monstre.

```typescript
executeAction('hug')
```

**Effets** :
- Augmente l'amour de 10-20%
- Améliore l'humeur générale
- Animation : Rotation excitée avec cœurs roses (💖, 💕, 💗, 💓)
- Durée de l'animation : 2.5 secondes

**Conditions** :
- Disponible à tout moment
- Cooldown : 2 minutes

### Wake (Réveiller) ⭐

Réveille le monstre quand il dort.

```typescript
executeAction('wake')
```

**Effets** :
- Change l'état de `sleepy` vers `happy`
- Restaure partiellement l'énergie
- Animation : Secousses énergiques avec étoiles (⭐, ✨, 💫, 🌟)
- Durée de l'animation : 2.5 secondes

**Conditions** :
- Utilisable uniquement si l'état est `sleepy`
- Ne pas réveiller trop souvent (baisse du bonheur)

## Système d'Animations

### Particules d'Effets

Chaque action génère des particules animées qui se dispersent autour du monstre.

```typescript
interface Particle {
  x: number          // Position X
  y: number          // Position Y
  vx: number         // Vélocité X (0.6 - 1.0)
  vy: number         // Vélocité Y (0.6 - 1.0)
  life: number       // Durée de vie actuelle
  maxLife: number    // Durée de vie max (100-150 frames)
  emoji: string      // Emoji à afficher
  size: number       // Taille (12-20px)
  rotation: number   // Rotation actuelle
  rotationSpeed: number  // Vitesse de rotation (0.075 rad/frame)
}
```

### Cycles d'Animation

Les animations suivent un cycle de 150 frames (~2.5 secondes à 60 FPS) :

1. **Phase d'entrée** (0-30 frames) : Apparition des particules
2. **Phase principale** (30-120 frames) : Animation du monstre
3. **Phase de sortie** (120-150 frames) : Disparition progressive

### Transformations Canvas

```typescript
// Exemple pour l'action "feed"
const jumpCycle = (actionFrame % 30) / 30
if (jumpCycle < 0.5) {
  offsetY = -Math.sin(jumpCycle * Math.PI * 2) * 25
  scale = 1 + Math.sin(jumpCycle * Math.PI * 2) * 0.1
}
```

## Gestion des Actions

### Hook `use-monster-action`

```typescript
import { useMonsterAction } from '@/hooks/monsters'

function MonsterCard({ monsterId }) {
  const { executeAction, isExecuting } = useMonsterAction(monsterId)

  const handleFeed = async () => {
    try {
      await executeAction('feed')
      toast.success('Monstre nourri ! 🍎')
    } catch (error) {
      toast.error('Échec de l\'action')
    }
  }

  return (
    <button 
      onClick={handleFeed}
      disabled={isExecuting}
    >
      Nourrir
    </button>
  )
}
```

### Server Action

```typescript
// src/actions/monsters.actions.ts
'use server'

export async function performMonsterAction(
  monsterId: string,
  action: MonsterAction
): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Not authenticated')

  const monster = await Monster.findById(monsterId)
  if (!monster) throw new Error('Monster not found')

  // Vérifier que le monstre appartient à l'utilisateur
  if (monster.ownerId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  // Appliquer l'action
  switch (action) {
    case 'feed':
      monster.state = 'happy'
      monster.energy = Math.min(monster.energy + 30, 100)
      break
    case 'comfort':
      if (['sad', 'angry'].includes(monster.state)) {
        monster.state = 'happy'
      }
      break
    // ...
  }

  await monster.save()
}
```

## Règles Métier

### Cooldowns

Pour éviter l'abus, certaines actions ont des cooldowns :

| Action | Cooldown | Raison |
|--------|----------|--------|
| feed | 5 min | Éviter la suralimentation |
| hug | 2 min | Maintenir l'excitation |
| comfort | 3 min | Laisser le temps d'effet |
| wake | 10 min | Respecter le cycle de sommeil |

### Contraintes

1. **Limites d'énergie** : Ne peut pas dépasser 100%
2. **Limites d'amour** : Ne peut pas dépasser 100%
3. **États incompatibles** : Certaines actions ne fonctionnent que sur certains états
4. **Ownership** : Un utilisateur ne peut agir que sur ses propres monstres

## Notifications

### Toast Success

```typescript
toast.success('🍎 Ton monstre est repu !', {
  position: 'bottom-right',
  autoClose: 3000
})
```

### Toast Error

```typescript
toast.error('⚠️ Action impossible pour le moment', {
  position: 'bottom-right',
  autoClose: 5000
})
```

## Performance

### Optimisations Canvas

- Utilisation de `requestAnimationFrame` pour des animations fluides
- Nettoyage des particules après leur durée de vie
- Limitation du nombre de particules simultanées (max 6 par action)

### Vitesse des Particules

Configuration actuelle (réduite pour fluidité) :
```typescript
const speed = 0.6 + Math.random() * 0.4  // Entre 0.6 et 1.0
const rotationSpeed = (Math.random() - 0.5) * 0.15  // Entre -0.075 et 0.075
```

## Événements

### Déclencheurs

- **Click manuel** : Bouton d'action dans l'UI
- **Cron automatique** : Actions programmées (future feature)
- **Webhook** : Notifications push (future feature)

### Logs

Toutes les actions sont enregistrées pour analytics :

```typescript
console.log(`Action ${action} performed on monster ${monsterId}`)
```

## Tests

### Tests Unitaires

```typescript
describe('Monster Actions', () => {
  it('should feed monster successfully', async () => {
    const result = await performMonsterAction(monsterId, 'feed')
    expect(result.state).toBe('happy')
    expect(result.energy).toBeGreaterThan(70)
  })

  it('should reject unauthorized action', async () => {
    await expect(
      performMonsterAction(otherUserMonsterId, 'feed')
    ).rejects.toThrow('Unauthorized')
  })
})
```

## Futures Améliorations

- [ ] Système de combos (actions en chaîne)
- [ ] Récompenses pour actions régulières
- [ ] Effets sonores pour chaque action
- [ ] Animations 3D avancées
- [ ] Actions multijoueur (échanger des objets)
