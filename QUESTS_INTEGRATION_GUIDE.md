# Intégration des Quêtes Journalières - Guide des Déclencheurs

## Vue d'ensemble

Ce document explique comment les quêtes sont automatiquement mises à jour lorsque l'utilisateur effectue des actions dans l'application.

## Déclencheurs implémentés

### ✅ 1. Acheter un accessoire (`buy_accessory`)

**Fichier** : `src/actions/accessories.actions.ts`  
**Fonction** : `purchaseAccessory()`

```typescript
// Après l'achat réussi
void updateQuestProgress('buy_accessory', 1)
```

**Quêtes concernées** :
- "Shopping Time" (1 accessoire) → +40 Koins
- "Fashionista" (3 accessoires) → +100 Koins

---

### ✅ 2. Équiper un accessoire (`equip_accessory`)

**Fichier** : `src/actions/accessories.actions.ts`  
**Fonction** : `equipAccessory()`

```typescript
// Après l'équipement réussi
void updateQuestProgress('equip_accessory', 1)
```

**Quêtes concernées** :
- "Styliste" (1 accessoire équipé) → +25 Koins
- "Fashion Expert" (3 accessoires équipés) → +60 Koins

---

### ✅ 3. Rendre un monstre public (`make_public`)

**Fichier** : `src/actions/monsters.actions.ts`  
**Fonction** : `toggleMonsterPublicStatus()`

```typescript
// Seulement si le monstre devient public (pas si on le rend privé)
if (newPublicStatus) {
  void updateQuestProgress('make_public', 1)
}
```

**Quêtes concernées** :
- "Partage" (1 monstre public) → +15 Koins

---

### ✅ 4. Nourrir un monstre (`feed_monster`)

**Fichier** : `src/actions/monsters.actions.ts`  
**Fonction** : `doActionOnMonster()`

```typescript
// Seulement pour l'action "feed" réussie
if (action === 'feed') {
  void updateQuestProgress('feed_monster', 1)
}
```

**Quêtes concernées** :
- "Petit Festin" (3 fois) → +15 Koins
- "Grand Festin" (5 fois) → +20 Koins
- "Banquet Royal" (10 fois) → +35 Koins

---

### ✅ 5. Interagir avec des monstres (`interact`)

**Fichier** : `src/actions/monsters.actions.ts`  
**Fonction** : `doActionOnMonster()`

```typescript
// Pour toute interaction réussie (feed, comfort, hug, wake)
void updateQuestProgress('interact', 1)
```

**Quêtes concernées** :
- "Sociable" (3 monstres) → +30 Koins
- "Très Sociable" (5 monstres) → +45 Koins

**Note** : Compte chaque interaction, pas les monstres uniques. Pour suivre les monstres uniques, il faudrait modifier la logique.

---

### ✅ 6. Faire évoluer un monstre (`level_up`)

**Fichier** : `src/actions/monsters.actions.ts`  
**Fonction** : `doActionOnMonster()`

```typescript
// Compte le nombre de niveaux gagnés
const previousLevel = Number(monster.level)
// ... calcul du niveau après XP ...
const newLevel = Number(monster.level)
if (newLevel > previousLevel) {
  void updateQuestProgress('level_up', newLevel - previousLevel)
}
```

**Quêtes concernées** :
- "Évolution" (1 niveau) → +50 Koins
- "Double Évolution" (2 niveaux) → +100 Koins

---

### ✅ 7. Visiter la galerie (`visit_gallery`)

**Fichier** : `src/hooks/use-gallery-visit.ts` + `src/components/gallery/public-gallery.tsx`  
**Hook** : `useGalleryVisit()`

```typescript
// Appelé automatiquement au montage du composant PublicGallery
useEffect(() => {
  void updateQuestProgress('visit_gallery', 1)
}, [])
```

**Quêtes concernées** :
- "Explorateur" (1 visite) → +10 Koins

**Note** : Se déclenche à chaque visite de `/app/gallery`, même multiple fois.

---

## Récompenses et Notifications

### Système de récompense

Quand une quête est complétée :

1. **Validation** : `updateQuestProgress()` détecte que `current >= target`
2. **Complétion** : La quête est marquée `completed: true` avec `completedAt: Date`
3. **Récompense** : Les Koins sont ajoutés automatiquement au wallet
4. **Revalidation** : Les caches Next.js sont invalidés pour `/app` et `/app/wallet`

### Code de récompense

```typescript
// Dans src/actions/quests.actions.ts : updateQuestProgress()
if (quest.current >= quest.target && !quest.completed) {
  quest.completed = true
  quest.completedAt = new Date()

  const template = getQuestTemplateById(quest.questId)
  if (template !== undefined) {
    const wallet = await WalletModel.findOne({ userId })
    if (wallet !== null) {
      const currentBalance = wallet.balance as number
      wallet.balance = currentBalance + template.reward
      await wallet.save()
    }
  }

  return { success: true, completed: true, reward: template.reward }
}
```

### Affichage visuel

Les quêtes complétées ont :
- Badge vert "✅ Complété"
- Fond vert clair (`bg-green-50`)
- Bordure verte (`border-green-400`)
- Barre de progression verte

---

## Tests manuels

### Test rapide de chaque quête

1. **buy_accessory** :
   ```
   1. Aller sur /app/wallet
   2. Acheter un accessoire
   3. Vérifier que la quête progresse
   ```

2. **equip_accessory** :
   ```
   1. Aller sur la fiche d'un monstre
   2. Équiper un accessoire possédé
   3. Vérifier la progression
   ```

3. **make_public** :
   ```
   1. Sur une carte de monstre, cliquer sur le badge "Privé"
   2. Le rendre public
   3. Vérifier la quête
   ```

4. **feed_monster** :
   ```
   1. Sur une carte de monstre avec état "hungry"
   2. Cliquer sur le bouton "Nourrir"
   3. Vérifier la progression
   ```

5. **interact** :
   ```
   1. Interagir avec n'importe quel monstre (feed, hug, etc.)
   2. Vérifier la progression
   ```

6. **level_up** :
   ```
   1. Faire gagner assez d'XP à un monstre pour qu'il monte de niveau
   2. Vérifier la quête
   ```

7. **visit_gallery** :
   ```
   1. Aller sur /app/gallery
   2. La quête se complète automatiquement
   ```

---

## Limitations actuelles

### Quête "interact" 
- ❌ Compte les interactions, pas les monstres uniques
- 💡 Solution : Stocker un Set de monsterIds dans la progression

### Quête "visit_gallery"
- ❌ Se déclenche à chaque visite, même multiple
- 💡 Solution : Vérifier si déjà marquée avant d'incrémenter

### Notifications
- ❌ Pas de notification visuelle lors de la complétion
- 💡 Solution : Composant `QuestCompletionToast` créé mais non intégré

---

## Améliorations futures

### 1. Système de notification temps réel

Créer un contexte global pour gérer les notifications :

```typescript
// src/contexts/quest-notifications.tsx
export function QuestNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  
  // Écouter les événements de complétion
  // Afficher les toasts
  
  return <QuestNotificationContext.Provider value={{...}}>
    {children}
    {notifications.map(notif => <QuestCompletionToast ... />)}
  </QuestNotificationContext.Provider>
}
```

### 2. Tracking des monstres uniques

Modifier le schéma de progression pour `interact` :

```typescript
interface QuestProgress {
  questId: string
  current: number
  target: number
  completed: boolean
  completedAt?: Date
  metadata?: {
    uniqueMonsterIds?: string[] // Pour "interact"
  }
}
```

### 3. Cooldown pour "visit_gallery"

Empêcher le spam en vérifiant la dernière mise à jour :

```typescript
// Ne mettre à jour que si > 1 heure depuis la dernière fois
const lastUpdate = quest.metadata?.lastVisitAt
if (!lastUpdate || Date.now() - lastUpdate > 3600000) {
  void updateQuestProgress('visit_gallery', 1)
}
```

### 4. Animation de progression

Animer la barre de progression en temps réel :

```typescript
// Dans QuestCard
const [animatedProgress, setAnimatedProgress] = useState(quest.current)

useEffect(() => {
  const timer = setTimeout(() => {
    setAnimatedProgress(quest.current)
  }, 100)
  return () => clearTimeout(timer)
}, [quest.current])
```

---

## Support et Maintenance

### Ajouter un nouveau déclencheur

1. Identifier l'action utilisateur
2. Trouver la server action correspondante
3. Ajouter `updateQuestProgress(type, increment)` après l'action réussie
4. Tester manuellement
5. Documenter ici

### Debug

Pour débugger les quêtes :

```typescript
// Dans la console du navigateur
console.log('Quêtes:', await fetch('/api/debug/quests').then(r => r.json()))

// Ou dans les server actions
console.log('Quest progress updated:', { questType, increment, result })
```
