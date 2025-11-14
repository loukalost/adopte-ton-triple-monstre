# Mise à jour - Système de Récompenses Manuelles

**Date** : 14 novembre 2025  
**Changements** : Récompenses manuelles pour les quêtes + Debug level_up

---

## 🔧 Problèmes résolus

### 1. Quêtes level_up non fonctionnelles

**Symptôme** : Les quêtes "Fais évoluer un monstre de 2 niveaux" et "Fais évoluer un monstre d'un niveau" ne se complétaient pas.

**Solution** : Ajout de logs de débogage dans `doActionOnMonster()`

**Fichier** : `src/actions/monsters.actions.ts` (lignes 337-349)

```typescript
const levelsGained = newLevel - previousLevel
console.log('[QUEST DEBUG] Level up check:', {
  monsterId: monster._id,
  previousLevel,
  newLevel,
  levelsGained,
  willUpdate: levelsGained > 0
})
if (levelsGained > 0) {
  void updateQuestProgress('level_up', levelsGained)
}
```

**Tests à effectuer** :
1. Ouvrir la console serveur (`npm run dev`)
2. Nourrir un monstre 4 fois (100 XP = 1 niveau)
3. Vérifier les logs `[QUEST DEBUG]`
4. Confirmer que `levelsGained` est correctement calculé

---

### 2. Récompenses manuelles pour les quêtes

**Changement majeur** : Les Koins ne sont plus ajoutés automatiquement lors de la complétion d'une quête. L'utilisateur doit cliquer sur un bouton "Réclamer" pour recevoir sa récompense.

---

## 📦 Modifications de la base de données

### Nouveau schéma `QuestProgress`

**Fichier** : `src/db/models/daily-quests.model.ts`

```typescript
const QuestProgressSchema = new Schema({
  questId: { type: String, required: true },
  current: { type: Number, required: true, default: 0 },
  target: { type: Number, required: true },
  completed: { type: Boolean, required: true, default: false },
  completedAt: { type: Date, required: false },
  claimed: { type: Boolean, required: true, default: false },      // ✅ Nouveau
  claimedAt: { type: Date, required: false }                        // ✅ Nouveau
})
```

### Type TypeScript mis à jour

**Fichier** : `src/types/quest.ts`

```typescript
export interface QuestProgress {
  questId: string
  current: number
  target: number
  completed: boolean
  completedAt?: Date
  claimed: boolean        // ✅ Nouveau
  claimedAt?: Date        // ✅ Nouveau
}
```

---

## 🔄 Nouvelle logique de complétion

### Avant (automatique)

```typescript
// Dans updateQuestProgress()
if (quest.current >= quest.target && !quest.completed) {
  quest.completed = true
  quest.completedAt = new Date()
  
  // ❌ Ajout automatique des Koins
  const wallet = await WalletModel.findOne({ userId })
  wallet.balance = currentBalance + template.reward
  await wallet.save()
}
```

### Après (manuel)

```typescript
// Dans updateQuestProgress()
if (quest.current >= quest.target && !quest.completed) {
  quest.completed = true
  quest.completedAt = new Date()
  
  // ✅ Pas d'ajout automatique
  await dailyQuests.save()
  revalidatePath('/app')
  
  return { success: true, completed: true }
}
```

---

## 🆕 Nouvelle action : `claimQuestReward()`

**Fichier** : `src/actions/quests.actions.ts` (lignes 155-230)

### Signature

```typescript
export async function claimQuestReward (
  questId: string
): Promise<{ success: boolean, reward?: number, error?: string }>
```

### Responsabilité

Ajouter les Koins au wallet quand l'utilisateur réclame manuellement sa récompense.

### Validations

```typescript
// 1. Utilisateur authentifié
if (session?.user?.id === undefined) {
  return { success: false, error: 'Not authenticated' }
}

// 2. Quête existe
const quest = dailyQuests.quests.find(q => q.questId === questId)
if (quest === undefined) {
  return { success: false, error: 'Quest not found' }
}

// 3. Quête complétée
if (!quest.completed) {
  return { success: false, error: 'Quest not completed yet' }
}

// 4. Pas déjà réclamée
if (quest.claimed) {
  return { success: false, error: 'Reward already claimed' }
}
```

### Flux de réclamation

```typescript
// 1. Récupérer le template pour la récompense
const template = getQuestTemplateById(quest.questId)

// 2. Ajouter les Koins au wallet
const wallet = await WalletModel.findOne({ userId })
wallet.balance = currentBalance + template.reward
await wallet.save()

// 3. Marquer comme réclamée
quest.claimed = true
quest.claimedAt = new Date()
await dailyQuests.save()

// 4. Revalider les caches
revalidatePath('/app')
revalidatePath('/app/wallet')

return { success: true, reward: template.reward }
```

---

## 🎨 UI - Composant `QuestCard`

**Fichier** : `src/components/quests/quest-card.tsx`

### Nouveaux hooks

```typescript
const [isPending, startTransition] = useTransition()
const [error, setError] = useState<string | null>(null)
```

### Handler de réclamation

```typescript
const handleClaimReward = (): void => {
  startTransition(async () => {
    setError(null)
    const result = await claimQuestReward(quest.questId)
    if (!result.success) {
      setError(result.error ?? 'Erreur lors de la réclamation')
    }
  })
}
```

### 3 états visuels

#### État 1 : Quête en cours

```tsx
{!quest.completed && (
  <div className='flex items-center gap-1'>
    <span className='text-lg'>🪙</span>
    <span className='text-base font-bold text-electric-600'>
      +{quest.reward} Koins
    </span>
  </div>
)}
```

#### État 2 : Complétée mais pas réclamée

```tsx
{quest.completed && !quest.claimed && (
  <button
    onClick={handleClaimReward}
    disabled={isPending}
    className='flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white 
               bg-gradient-to-r from-electric-500 to-electric-600 
               hover:from-electric-600 hover:to-electric-700 
               disabled:opacity-50 transition-all active:scale-95 shadow-md'
  >
    <span className='text-lg'>🪙</span>
    <span className='text-sm'>Réclamer +{quest.reward} Koins</span>
  </button>
)}
```

#### État 3 : Réclamée

```tsx
{quest.claimed && (
  <div className='flex items-center gap-1 text-green-600'>
    <span className='text-lg'>✅</span>
    <span className='text-sm font-bold'>Réclamé</span>
  </div>
)}
```

### Gestion des erreurs

```tsx
{error !== null && (
  <div className='mt-2 p-2 rounded bg-red-50 border border-red-200'>
    <p className='text-xs text-red-600'>{error}</p>
  </div>
)}
```

---

## 🔄 Flux complet utilisateur

### 1. Progression d'une quête

```
Utilisateur achète un accessoire
  ↓
purchaseAccessory() → updateQuestProgress('buy_accessory', 1)
  ↓
quest.current = 0 + 1 = 1
  ↓
Si quest.current (1) >= quest.target (1) :
  quest.completed = true ✅
  quest.claimed = false ⏳
  quest.completedAt = Date.now()
  ↓
revalidatePath('/app')
  ↓
UI refresh
  ↓
Badge "✅ Complété" + Bouton "Réclamer +40 Koins"
```

### 2. Réclamation de la récompense

```
Utilisateur clique sur "Réclamer +40 Koins"
  ↓
handleClaimReward() → claimQuestReward(questId)
  ↓
Validations :
  - Utilisateur authentifié ? ✅
  - Quête existe ? ✅
  - Quête complétée ? ✅
  - Pas déjà réclamée ? ✅
  ↓
wallet.balance += 40
quest.claimed = true ✅
quest.claimedAt = Date.now()
  ↓
revalidatePath('/app')
revalidatePath('/app/wallet')
  ↓
UI refresh
  ↓
Badge "✅ Réclamé" (vert)
Wallet affiche +40 Koins
```

---

## 🧪 Tests manuels

### Test 1 : Complétion

1. Démarrer avec une quête "Achète un accessoire" (0/1)
2. Aller sur `/app/wallet`
3. Acheter un accessoire
4. Revenir sur `/app` (dashboard)
5. **Vérifier** : Badge "✅ Complété" affiché
6. **Vérifier** : Bouton "Réclamer +40 Koins" présent
7. **Vérifier** : Wallet n'a PAS encore reçu les Koins

### Test 2 : Réclamation

1. Quête complétée (état du Test 1)
2. Cliquer sur "Réclamer +40 Koins"
3. **Vérifier** : Bouton disparaît
4. **Vérifier** : Badge "✅ Réclamé" affiché en vert
5. **Vérifier** : Wallet affiche +40 Koins

### Test 3 : Sécurité double-réclamation

1. Quête déjà réclamée
2. Ouvrir la console du navigateur
3. Essayer manuellement :
   ```javascript
   await fetch('/api/quests/claim', {
     method: 'POST',
     body: JSON.stringify({ questId: 'buy_accessory_1' })
   })
   ```
4. **Vérifier** : Erreur "Reward already claimed"
5. **Vérifier** : Wallet n'a PAS reçu de Koins supplémentaires

### Test 4 : Debug level_up

1. Ouvrir 2 terminaux :
   - Terminal 1 : `npm run dev`
   - Terminal 2 : console navigateur
2. Aller sur un monstre niveau 1
3. Le nourrir 4 fois (25 XP × 4 = 100 XP → niveau 2)
4. **Vérifier dans Terminal 1** :
   ```
   [QUEST DEBUG] Level up check: {
     monsterId: '...',
     previousLevel: 1,
     newLevel: 2,
     levelsGained: 1,
     willUpdate: true
   }
   ```
5. **Vérifier** : Quête "Évolution" (1 niveau) progresse de +1

---

## 📊 Avantages du système manuel

### 1. Engagement utilisateur

- ✅ Interaction active avec le système de quêtes
- ✅ Sensation de "récompense" plus tangible
- ✅ Gamification renforcée

### 2. Contrôle et feedback

- ✅ L'utilisateur voit explicitement quand il gagne des Koins
- ✅ Évite les bugs silencieux (Koins ajoutés sans notification)
- ✅ Meilleure compréhension du système de récompenses

### 3. Traçabilité

- ✅ `claimedAt` : timestamp exact de la réclamation
- ✅ Détection d'abus (réclamer trop vite après complétion)
- ✅ Analytics : taux de réclamation des quêtes

### 4. Flexibilité future

- ✅ Bonus temporels : +10% si réclamé dans l'heure
- ✅ Événements : Double récompense le weekend
- ✅ Système de "combo" : +50% si 3 quêtes réclamées d'affilée

---

## ⚠️ Migration des données

**Problème** : Les quêtes créées AVANT cette mise à jour n'ont pas les champs `claimed` et `claimedAt`.

### Option A : Migration MongoDB

```javascript
// Script à exécuter dans MongoDB Compass ou CLI
db.daily_quests.updateMany(
  { "quests.completed": true },
  { 
    $set: { 
      "quests.$[elem].claimed": false,
      "quests.$[elem].claimedAt": null
    } 
  },
  { 
    arrayFilters: [
      { 
        "elem.completed": true, 
        "elem.claimed": { $exists: false } 
      }
    ] 
  }
)
```

### Option B : Gestion dans le code (recommandé)

Modifier `getDailyQuests()` pour ajouter des valeurs par défaut :

```typescript
const enrichedQuests: EnrichedQuest[] = dailyQuests.quests.map(quest => {
  return {
    questId: quest.questId,
    current: quest.current,
    target: quest.target,
    completed: quest.completed,
    completedAt: quest.completedAt,
    claimed: quest.claimed ?? false,  // ✅ Défaut si absent
    claimedAt: quest.claimedAt,
    title: template.title,
    description: template.description,
    reward: template.reward,
    icon: template.icon
  }
})
```

---

## 🚀 Améliorations futures

### 1. Notification toast

**Problème** : Pas de feedback visuel quand la récompense est réclamée.

**Solution** : Intégrer `QuestCompletionToast`

```tsx
const handleClaimReward = (): void => {
  startTransition(async () => {
    const result = await claimQuestReward(quest.questId)
    if (result.success) {
      showToast({
        message: `🎉 +${result.reward} Koins réclamés !`,
        type: 'success'
      })
    }
  })
}
```

### 2. Expiration des récompenses

**Question** : Que se passe-t-il si l'utilisateur ne réclame pas avant minuit ?

**Options** :
- ❌ Option A : Récompenses perdues (frustrant)
- ✅ Option B : Récompenses restent réclamables (recommandé)
- ⚠️ Option C : Auto-réclamation à 23h59 (complexe)

**Implémentation Option B** :

Créer une section "Récompenses en attente" dans le dashboard :

```tsx
<section className='pending-rewards'>
  <h3>🎁 Récompenses en attente</h3>
  {pastQuests
    .filter(q => q.completed && !q.claimed)
    .map(q => (
      <PendingRewardCard key={q.questId} quest={q} />
    ))
  }
</section>
```

### 3. Système de bonus

**Idée** : Récompenser les réclamations rapides

```typescript
// Dans claimQuestReward()
const completedAt = quest.completedAt.getTime()
const claimedAt = Date.now()
const timeDiff = claimedAt - completedAt

let bonus = 0
if (timeDiff < 60000) { // Moins d'1 minute
  bonus = Math.floor(template.reward * 0.5) // +50%
} else if (timeDiff < 3600000) { // Moins d'1 heure
  bonus = Math.floor(template.reward * 0.1) // +10%
}

wallet.balance += template.reward + bonus

return { 
  success: true, 
  reward: template.reward,
  bonus 
}
```

---

## 📝 Résumé des fichiers modifiés

| Fichier | Modifications |
|---------|---------------|
| `src/types/quest.ts` | Ajout `claimed: boolean` et `claimedAt?: Date` |
| `src/db/models/daily-quests.model.ts` | Ajout champs `claimed` et `claimedAt` dans le schéma |
| `src/actions/quests.actions.ts` | Suppression auto-reward + nouvelle fonction `claimQuestReward()` + enrichissement avec champs `claimed` |
| `src/actions/monsters.actions.ts` | Logs de debug pour `level_up` |
| `src/components/quests/quest-card.tsx` | Bouton "Réclamer" + 3 états visuels + gestion erreurs |
