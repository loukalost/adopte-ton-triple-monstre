# 💰 Système de Récompenses en Koins - ATTM

## Vue d'ensemble

Le système de récompenses permet aux utilisateurs de gagner des **Koins** en effectuant des actions sur leurs monstres. Chaque interaction rapporte un montant fixe de Koins et affiche une notification de succès.

## Architecture

### Layers (Clean Architecture)

```
┌─────────────────────────────────────────────────────┐
│  Presentation Layer (UI)                            │
│  - MonsterActions component (affichage + toasts)   │
└────────────────┬────────────────────────────────────┘
                 │ depends on
┌────────────────▼────────────────────────────────────┐
│  Application Layer (Server Actions)                 │
│  - rewardActionKoins() (orchestration)              │
│  - doActionOnMonster() (action monstre)             │
└────────────────┬────────────────────────────────────┘
                 │ depends on
┌────────────────▼────────────────────────────────────┐
│  Domain Layer (Business Logic)                      │
│  - rewards.service.ts (calcul récompenses)          │
│  - wallet.actions.ts (gestion Koins)                │
└─────────────────────────────────────────────────────┘
```

### Principes SOLID Appliqués

#### 1. **Single Responsibility Principle (SRP)**
- `rewards.service.ts` : **Calcule** les récompenses (logique métier pure)
- `rewardActionKoins()` : **Orchestre** l'attribution (coordination)
- `addKoins()` : **Persiste** les Koins (base de données)
- `MonsterActions` : **Affiche** l'UI et notifie l'utilisateur

#### 2. **Open/Closed Principle (OCP)**
- Ajouter une nouvelle action : modifier uniquement `REWARDS_CONFIG`
- Pas besoin de toucher au reste du code
- Extensible pour nouveaux types de récompenses (combos, multiplicateurs)

#### 3. **Dependency Inversion Principle (DIP)**
- Le composant UI dépend de l'**abstraction** `RewardResult`
- Les server actions dépendent du **service** rewards, pas de l'implémentation
- Les services ne dépendent pas de Next.js ou React

## Configuration des Récompenses

### Montants par Action

| Action | Koins | Message | Emoji |
|--------|-------|---------|-------|
| **Nourrir** (`feed`) | 10 | "Ton monstre est rassasié !" | 🍎 |
| **Consoler** (`comfort`) | 15 | "Ton monstre se sent mieux !" | 💙 |
| **Câliner** (`hug`) | 12 | "Ton monstre est tout content !" | 🤗 |
| **Réveiller** (`wake`) | 8 | "Ton monstre est bien réveillé !" | ⏰ |

### Modifier les Récompenses

Pour changer les montants ou ajouter une action :

```typescript
// src/services/rewards.service.ts
const REWARDS_CONFIG: Record<NonNullable<MonsterAction>, RewardConfig> = {
  feed: {
    koins: 10,      // ← Modifier ici
    message: 'Ton monstre est rassasié !',
    emoji: '🍎'
  },
  // Ajouter une nouvelle action
  play: {
    koins: 20,
    message: 'Ton monstre s\'est bien amusé !',
    emoji: '🎮'
  }
}
```

## API du Service de Récompenses

### `calculateReward(action: MonsterAction): RewardResult | null`

Calcule la récompense pour une action donnée (fonction pure).

```typescript
const reward = calculateReward('feed')
// {
//   action: 'feed',
//   koinsEarned: 10,
//   message: 'Ton monstre est rassasié !',
//   emoji: '🍎',
//   timestamp: Date
// }
```

### `formatRewardMessage(reward: RewardResult): string`

Formate un message utilisateur complet.

```typescript
const message = formatRewardMessage(reward)
// "🍎 +10 Koins ! Ton monstre est rassasié !"
```

### `isRewardableAction(action: MonsterAction): boolean`

Vérifie si une action peut recevoir une récompense.

```typescript
isRewardableAction('feed')  // true
isRewardableAction(null)    // false
```

### `calculateTotalReward(actions: MonsterAction[]): number`

Calcule le total de Koins pour plusieurs actions.

```typescript
const total = calculateTotalReward(['feed', 'hug', 'comfort'])
// 37 (10 + 12 + 15)
```

## Flux d'Exécution

### 1. Utilisateur clique sur une action

```tsx
// MonsterActions component
<ActionButton onClick={() => handleAction('feed')} />
```

### 2. Orchestration de l'action et de la récompense

```typescript
const handleAction = async (action: MonsterAction) => {
  // Déclenchement animation UI
  triggerAction(action, onAction)

  // Exécution parallèle
  const [, rewardResult] = await Promise.all([
    doActionOnMonster(monsterId, action),  // Met à jour le monstre
    rewardActionKoins(action)              // Attribue les Koins
  ])

  // Affichage notification
  if (rewardResult !== null) {
    toast.success(formatRewardMessage(rewardResult.reward))
  }
}
```

### 3. Attribution des Koins (Server Action)

```typescript
// src/actions/wallet.actions.ts
export async function rewardActionKoins(action: MonsterAction) {
  // 1. Calcul de la récompense (Domain Layer)
  const reward = calculateReward(action)
  
  // 2. Attribution des Koins
  const wallet = await addKoins(reward.koinsEarned)
  
  // 3. Revalidation du cache
  revalidatePath('/app')
  
  return { reward, wallet }
}
```

### 4. Mise à jour du wallet

```typescript
// Mise à jour atomique avec $inc (MongoDB)
await Wallet.updateOne(
  { ownerId: userId },
  { $inc: { balance: reward.koinsEarned } }
)
```

## Notifications Toast

### Design

- **Position** : Top-center
- **Durée** : 3 secondes
- **Style** : Dégradé violet (#667eea → #764ba2)
- **Couleur texte** : Blanc, gras
- **Contenu** : Emoji + montant + message

### Exemple

```
🍎 +10 Koins ! Ton monstre est rassasié !
```

### États d'erreur

En cas d'erreur lors de l'action :

```typescript
toast.error('Erreur lors de l\'action 😢', {
  position: 'top-center',
  autoClose: 3000
})
```

## Types TypeScript

### `MonsterAction`

```typescript
// src/types/monster-action.ts
export type MonsterAction = 'feed' | 'comfort' | 'hug' | 'wake' | null
```

### `RewardConfig`

```typescript
export interface RewardConfig {
  koins: number        // Montant gagné
  message: string      // Message de succès
  emoji: string        // Emoji associé
}
```

### `RewardResult`

```typescript
export interface RewardResult {
  action: MonsterAction
  koinsEarned: number
  message: string
  emoji: string
  timestamp: Date
}
```

## Fonctionnalités Futures

### 1. Système de Combos

Multiplicateur pour actions consécutives :

```typescript
const multiplier = calculateComboMultiplier(5)
// 1.5 (base 1.0 + 5 actions × 0.1)

const bonusKoins = baseKoins * multiplier
```

### 2. Récompenses Variables

Ajouter de la variabilité :

```typescript
const koins = Math.floor(baseKoins * (0.8 + Math.random() * 0.4))
// Entre 80% et 120% de la valeur de base
```

### 3. Achievements / Succès

Récompenses pour objectifs :

```typescript
{
  id: 'first-feed',
  title: 'Première nourriture',
  description: 'Nourrir un monstre pour la première fois',
  reward: 50,
  unlocked: false
}
```

### 4. Daily Bonus

Multiplicateur quotidien :

```typescript
const dailyBonus = getDailyBonusMultiplier(lastLoginDate)
// 1.0 (normal) → 2.0 (7 jours consécutifs)
```

## Testing

### Unit Tests (Service)

```typescript
describe('rewards.service', () => {
  it('should calculate correct reward for feed action', () => {
    const reward = calculateReward('feed')
    expect(reward?.koinsEarned).toBe(10)
    expect(reward?.emoji).toBe('🍎')
  })

  it('should return null for invalid action', () => {
    const reward = calculateReward(null)
    expect(reward).toBeNull()
  })

  it('should calculate total for multiple actions', () => {
    const total = calculateTotalReward(['feed', 'hug'])
    expect(total).toBe(22) // 10 + 12
  })
})
```

### Integration Tests (Server Actions)

```typescript
describe('rewardActionKoins', () => {
  it('should add koins to wallet and return reward', async () => {
    const result = await rewardActionKoins('feed')
    
    expect(result).not.toBeNull()
    expect(result?.reward.koinsEarned).toBe(10)
    expect(result?.wallet.balance).toBeGreaterThan(0)
  })
})
```

### E2E Tests (UI)

```typescript
test('user earns koins when feeding monster', async ({ page }) => {
  await page.goto('/app/creatures/123')
  
  const initialBalance = await page.locator('[data-testid="koins-balance"]').textContent()
  
  await page.click('[data-action="feed"]')
  await page.waitForSelector('.Toastify__toast--success')
  
  const newBalance = await page.locator('[data-testid="koins-balance"]').textContent()
  expect(Number(newBalance)).toBe(Number(initialBalance) + 10)
})
```

## Sécurité

### Validation Côté Serveur

- ✅ Authentification vérifiée dans `rewardActionKoins()`
- ✅ Validation de l'action (enum `MonsterAction`)
- ✅ Mise à jour atomique avec `$inc` (pas de race conditions)

### Rate Limiting (À implémenter)

Pour éviter l'abus :

```typescript
// Limiter à 10 actions par minute par utilisateur
const rateLimiter = new RateLimiter({
  windowMs: 60000,
  max: 10
})
```

## Monitoring

### Métriques à Tracker

- **Koins gagnés par action** : Moyenne, médiane, total
- **Actions par utilisateur** : Fréquence, favoris
- **Taux de succès** : Erreurs vs succès
- **Distribution des récompenses** : Histogramme

### Logging

```typescript
console.log('[REWARD]', {
  userId,
  action,
  koinsEarned,
  newBalance,
  timestamp
})
```

## Fichiers Modifiés/Créés

### Créés ✨

1. **`src/services/rewards.service.ts`** (212 lignes)
   - Service de calcul de récompenses
   - Configuration centralisée
   - Fonctions utilitaires (combos, totaux)

2. **`src/types/monster-action.ts`** (19 lignes)
   - Type centralisé `MonsterAction`
   - Partagé entre client et serveur

### Modifiés 🔧

1. **`src/actions/wallet.actions.ts`**
   - ✅ Ajout de `rewardActionKoins()`
   - ✅ Import du service rewards

2. **`src/components/monsters/monster-actions.tsx`**
   - ✅ Intégration des récompenses
   - ✅ Notifications toast
   - ✅ Gestion async des actions

3. **`src/hooks/monsters/use-monster-action.ts`**
   - ✅ Import du type centralisé

4. **`src/hooks/monsters/index.ts`**
   - ✅ Export du type centralisé

5. **`src/actions/monsters.actions.ts`**
   - ✅ Import du type centralisé

## Démo Visuelle

### Avant

```
[Action Feed] → Monstre mis à jour
(Aucun feedback de récompense)
```

### Après

```
[Action Feed] → Monstre mis à jour
                ↓
            +10 Koins
                ↓
    Toast: "🍎 +10 Koins ! Ton monstre est rassasié !"
                ↓
    Solde affiché mis à jour immédiatement
```

---

**Dernière mise à jour** : 13 novembre 2025  
**Auteur** : GitHub Copilot  
**Version** : 1.0.0
