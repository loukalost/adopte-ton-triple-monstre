---
sidebar_position: 1
---

# Dashboard Utilisateur

Le dashboard est l'interface principale où les utilisateurs peuvent gérer leurs monstres et interagir avec eux.

## Vue d'ensemble

Le dashboard offre une vue centralisée de tous les monstres de l'utilisateur avec leurs statistiques en temps réel.

### Composants Principaux

#### `DashboardStats`
Affiche les statistiques globales de l'utilisateur :
- Nombre total de monstres
- Niveau moyen des monstres
- Taux de bonheur global
- Monstres nécessitant de l'attention

```typescript
interface DashboardStatsProps {
  totalMonsters: number
  averageLevel: number
  averageHappiness: number
  needsAttention: number
}
```

#### `MonstersList`
Liste tous les monstres de l'utilisateur avec :
- Affichage en grille responsive
- Carte interactive pour chaque monstre
- Indicateurs visuels d'état (badges de couleur)
- Actions rapides (nourrir, jouer, câliner)

#### `CreateMonsterModal`
Modal pour créer un nouveau monstre avec :
- Formulaire de nom
- Génération aléatoire de traits visuels
- Prévisualisation du monstre
- Validation en temps réel

## Navigation

### Structure des Routes

```
/dashboard              → Page principale du dashboard
/dashboard/monsters     → Liste détaillée des monstres
/creature/[id]          → Page individuelle d'un monstre
```

### Permissions

- Accès restreint aux utilisateurs authentifiés
- Redirection automatique vers `/sign-in` si non connecté
- Chaque utilisateur voit uniquement ses propres monstres

## Fonctionnalités

### Création de Monstre

1. Clic sur le bouton "Créer un monstre"
2. Saisie du nom (3-20 caractères)
3. Génération automatique des traits visuels :
   - Couleurs aléatoires (palette pastel)
   - Style de corps (round, square, tall, wide)
   - Style d'yeux (big, small, star, sleepy)
   - Antennes (single, double, curly, none)
   - Accessoires (horns, ears, tail, none)
4. Validation et sauvegarde en base de données

### Actions Rapides

Depuis le dashboard, l'utilisateur peut :
- **Nourrir** : Restaure l'énergie et change l'état vers `happy`
- **Jouer** : Augmente le bonheur et déclenche des animations
- **Câliner** : Réduit le stress et apaise le monstre
- **Réveiller** : Change l'état de `sleepy` vers `happy`

### Statistiques en Temps Réel

Les statistiques se mettent à jour automatiquement :
- Niveau du monstre (augmente avec l'expérience)
- Barre d'amour (0-100%)
- Barre d'énergie (0-100%)
- État émotionnel actuel

## Hooks Utilisés

### `use-monster-stats`
```typescript
const { stats, isLoading } = useMonsterStats()
```

Récupère les statistiques agrégées de tous les monstres.

### `use-monster-action`
```typescript
const { executeAction, isExecuting } = useMonsterAction(monsterId)

await executeAction('feed')
```

Exécute une action sur un monstre spécifique avec gestion d'erreur et notification toast.

## États et Gestion

### États des Monstres

| État | Icône | Description |
|------|-------|-------------|
| `happy` | 😊 | Monstre heureux et énergique |
| `sad` | 😢 | Monstre triste, nécessite de l'attention |
| `hungry` | 😋 | Monstre affamé, a besoin de nourriture |
| `sleepy` | 😴 | Monstre fatigué, doit se reposer |
| `angry` | 😠 | Monstre en colère, nécessite un câlin |

### Animations Canvas

Les monstres sont rendus sur un canvas HTML5 avec :
- Animations fluides (60 FPS)
- Particules d'effets (emojis)
- Transformations dynamiques selon l'action
- Pixel art stylisé

## Responsive Design

Le dashboard s'adapte à toutes les tailles d'écran :

- **Desktop (lg+)** : Grille 3 colonnes
- **Tablet (md)** : Grille 2 colonnes  
- **Mobile (sm)** : Liste verticale

## Performance

### Optimisations

- **Server Components** : Rendu côté serveur pour le chargement initial
- **Lazy Loading** : Chargement différé des cartes de monstres
- **Canvas Optimization** : Utilisation de `requestAnimationFrame`
- **Memoization** : Cache des calculs de statistiques

### Métriques Cibles

- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Largest Contentful Paint** : < 2.5s

## Erreurs Courantes

### Monstre non trouvé
```typescript
if (!monster) {
  throw new Error('Monster not found')
}
```

Redirection automatique vers le dashboard avec message d'erreur.

### Session expirée
Gestion automatique de la reconnexion avec Better Auth.

### Échec de l'action
Toast notification avec message d'erreur spécifique.

## Exemples de Code

### Créer un monstre
```typescript
import { createMonster } from '@/actions/monsters.actions'

const monsterData = {
  name: 'Triplou',
  draw: JSON.stringify(generatedTraits)
}

await createMonster(monsterData)
```

### Exécuter une action
```typescript
import { useMonsterAction } from '@/hooks/monsters'

const { executeAction } = useMonsterAction(monsterId)

await executeAction('feed')
```

## Prochaines Fonctionnalités

- [ ] Système de badges et récompenses
- [ ] Classement entre utilisateurs
- [ ] Partage de monstres sur les réseaux sociaux
- [ ] Mini-jeux pour gagner de l'expérience
- [ ] Boutique d'accessoires premium
