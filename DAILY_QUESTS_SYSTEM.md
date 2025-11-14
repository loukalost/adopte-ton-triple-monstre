# Système de Quêtes Journalières

## Vue d'ensemble

Le système de quêtes journalières permet aux utilisateurs de compléter des objectifs quotidiens pour gagner des Koins. Les quêtes se renouvellent automatiquement à minuit.

## Architecture

### Principes SOLID appliqués

- **SRP (Single Responsibility Principle)** : Chaque composant/module a une responsabilité unique
- **OCP (Open/Closed Principle)** : Le système est extensible sans modification du code existant
- **DIP (Dependency Inversion Principle)** : Les modules dépendent d'abstractions (interfaces/types)

### Structure des fichiers

```
src/
├── types/
│   └── quest.ts                    # Types TypeScript pour les quêtes
├── config/
│   └── quests.config.ts            # Configuration centralisée des quêtes
├── db/models/
│   └── daily-quests.model.ts       # Modèle MongoDB
├── actions/
│   └── quests.actions.ts           # Server actions
├── components/quests/
│   ├── quest-card.tsx              # Carte d'affichage d'une quête
│   └── daily-quests.tsx            # Section complète des quêtes
└── app/api/cron/
    └── renew-quests/route.ts       # Endpoint cron pour renouvellement
```

## Types de quêtes disponibles

| Type | Description | Exemple |
|------|-------------|---------|
| `feed_monster` | Nourrir un monstre X fois | "Nourris 5 fois ton monstre" |
| `level_up` | Faire évoluer un monstre | "Fais évoluer un monstre d'un niveau" |
| `interact` | Interagir avec X monstres | "Interagis avec 3 monstres différents" |
| `buy_accessory` | Acheter un accessoire | "Achète un accessoire" |
| `make_public` | Rendre un monstre public | "Rends un monstre public" |
| `visit_gallery` | Visiter la galerie | "Visite la galerie communautaire" |
| `equip_accessory` | Équiper un accessoire | "Équipe un accessoire" |

## Configuration des quêtes

Les quêtes sont configurées dans `src/config/quests.config.ts`. Pour ajouter une nouvelle quête :

```typescript
{
  id: 'unique_id',
  type: 'feed_monster',
  title: 'Titre de la quête',
  description: 'Description détaillée',
  target: 5, // Objectif à atteindre
  reward: 20, // Récompense en Koins
  icon: '🍖' // Emoji pour l'affichage
}
```

## Utilisation des Server Actions

### Récupérer les quêtes du jour

```typescript
import { getDailyQuests } from '@/actions/quests.actions'

const quests = await getDailyQuests()
```

### Mettre à jour la progression

```typescript
import { updateQuestProgress } from '@/actions/quests.actions'

const result = await updateQuestProgress('feed_monster', 1)

if (result.completed) {
  console.log(`Quest completed! Reward: ${result.reward} Koins`)
}
```

## Renouvellement automatique

### Configuration Vercel Cron

Le renouvellement est configuré dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/cron/renew-quests",
      "schedule": "0 0 * * *"
    }
  ]
}
```

- **Schedule** : `0 0 * * *` = Tous les jours à minuit (00:00 UTC)
- **Endpoint** : `/api/cron/renew-quests`

### Test manuel du renouvellement

```bash
# Avec token de sécurité
curl -X GET https://your-domain.com/api/cron/renew-quests \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"

# Sans token (si CRON_SECRET_TOKEN non configuré)
curl -X GET https://your-domain.com/api/cron/renew-quests
```

## Intégration dans les actions utilisateur

Pour incrémenter la progression d'une quête lors d'une action utilisateur :

```typescript
// Dans votre action (ex: actions/monsters.actions.ts)
import { updateQuestProgress } from './quests.actions'

export async function feedMonster(monsterId: string) {
  // ... logique de nourrissage ...
  
  // Mettre à jour la quête "feed_monster"
  await updateQuestProgress('feed_monster', 1)
  
  return { success: true }
}
```

## Base de données

### Collection `daily_quests`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Référence à l'utilisateur
  date: "2025-11-14",         // Format YYYY-MM-DD
  quests: [
    {
      questId: "feed_5",
      current: 3,             // Progression actuelle
      target: 5,              // Objectif
      completed: false,
      completedAt: null       // Date de complétion
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Index

- `{ userId: 1, date: 1 }` : Index unique pour garantir une seule entrée par utilisateur par jour

## Composants UI

### QuestCard

Affiche une quête individuelle avec :
- Icône et titre
- Description
- Barre de progression
- Récompense
- Badge "Complété" si terminée

```tsx
<QuestCard quest={enrichedQuest} />
```

### DailyQuests

Section complète avec :
- Header avec compteur de progression
- Grille de quêtes
- Message de félicitations si toutes complétées
- Info de renouvellement

```tsx
<DailyQuests initialQuests={quests} />
```

## Extensibilité

### Ajouter un nouveau type de quête

1. **Ajouter le type dans `src/types/quest.ts`** :
```typescript
export type QuestType =
  | 'feed_monster'
  | 'new_quest_type' // Nouveau type
```

2. **Créer les templates dans `src/config/quests.config.ts`** :
```typescript
{
  id: 'new_quest_1',
  type: 'new_quest_type',
  title: 'Nouvelle Quête',
  description: 'Description',
  target: 1,
  reward: 25,
  icon: '🎯'
}
```

3. **Implémenter la logique de progression** dans l'action concernée

## Sécurité

- Les quêtes sont créées et mises à jour côté serveur uniquement
- Le cron endpoint peut être sécurisé avec `CRON_SECRET_TOKEN`
- Les récompenses sont ajoutées directement au wallet MongoDB

## Performance

- **SSR initial** : Les quêtes sont chargées côté serveur lors du chargement de la page
- **Pas de polling** : La progression se met à jour lors des actions utilisateur
- **Revalidation** : Cache invalidé après mise à jour de quête

## Logs

Le système de cron produit des logs structurés :

```
[2025-11-14T00:00:00.000Z] [CRON-RENEW-QUESTS] [INFO] 🚀 Démarrage du renouvellement...
[2025-11-14T00:00:02.150Z] [CRON-RENEW-QUESTS] [INFO] ✅ Renouvellement terminé
{
  "usersUpdated": 42,
  "duration": "2150ms"
}
```

## Roadmap future

- [ ] Quêtes hebdomadaires
- [ ] Système de succès/achievements
- [ ] Quêtes spéciales saisonnières
- [ ] Bonus de combo pour streak de jours consécutifs
- [ ] Récompenses variables (items au lieu de Koins)
