---
sidebar_position: 4
title: Référence API
---

# 📚 Référence API

Documentation technique complète du système de mise à jour automatique.

## API Route

### `GET/POST /api/cron/update-monsters`

Met à jour aléatoirement les états de tous les monstres dans la base de données.

#### Headers

```http
Content-Type: application/json
Authorization: Bearer <CRON_SECRET_TOKEN>  (optionnel)
```

#### Réponse - Succès (200)

```json
{
  "success": true,
  "updated": 5,
  "timestamp": "2025-10-29T12:34:56.789Z",
  "duration": 234,
  "details": [
    {
      "id": "507f1f77bcf86cd799439011",
      "oldState": "hungry",
      "newState": "sleepy"
    }
  ]
}
```

#### Réponse - Unauthorized (401)

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

#### Réponse - Erreur (500)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Connection to database failed",
  "timestamp": "2025-10-29T12:34:56.789Z",
  "duration": 123
}
```

#### Exemple avec curl

```bash
# Sans authentification
curl http://localhost:3000/api/cron/update-monsters

# Avec authentification
curl -H "Authorization: Bearer votre_token" \
  http://localhost:3000/api/cron/update-monsters

# Avec jq pour formater
curl -s http://localhost:3000/api/cron/update-monsters | jq
```

#### Exemple avec fetch

```javascript
const response = await fetch('/api/cron/update-monsters', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET_TOKEN}`
  }
})

const data = await response.json()
console.log(data)
```

## Hook `useAutoUpdateMonsters`

Hook React pour gérer les mises à jour automatiques avec intervalles aléatoires.

### Signature

```typescript
function useAutoUpdateMonsters(
  options?: UseAutoUpdateMonstersOptions
): {
  trigger: () => Promise<void>
  isUpdating: boolean
  lastUpdate: UpdateResult | null
  updateCount: number
  nextUpdateIn: number | null
}
```

### Options

```typescript
interface UseAutoUpdateMonstersOptions {
  /** Intervalle minimum en millisecondes (défaut: 60000) */
  minInterval?: number
  
  /** Intervalle maximum en millisecondes (défaut: 180000) */
  maxInterval?: number
  
  /** Active/désactive les mises à jour (défaut: true) */
  enabled?: boolean
  
  /** Callback appelé après chaque mise à jour */
  onUpdate?: (result: UpdateResult) => void
  
  /** Active les logs dans la console (défaut: true) */
  verbose?: boolean
}
```

### Valeurs retournées

```typescript
interface ReturnValue {
  /** Fonction pour déclencher manuellement une mise à jour */
  trigger: () => Promise<void>
  
  /** Indique si une mise à jour est en cours */
  isUpdating: boolean
  
  /** Résultat de la dernière mise à jour */
  lastUpdate: UpdateResult | null
  
  /** Nombre de mises à jour effectuées */
  updateCount: number
  
  /** Délai en ms avant la prochaine mise à jour */
  nextUpdateIn: number | null
}
```

### Type `UpdateResult`

```typescript
interface UpdateResult {
  success: boolean
  updated?: number
  timestamp?: string
  duration?: number
  error?: string
}
```

### Exemples d'utilisation

#### Basique

```tsx
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

export function MyComponent() {
  const { isUpdating, lastUpdate, updateCount } = useAutoUpdateMonsters()

  return (
    <div>
      <p>Mises à jour effectuées : {updateCount}</p>
      <p>Statut : {isUpdating ? 'En cours...' : 'En attente'}</p>
    </div>
  )
}
```

#### Avec options

```tsx
const { trigger, isUpdating, lastUpdate, nextUpdateIn } = useAutoUpdateMonsters({
  minInterval: 30000,
  maxInterval: 120000,
  enabled: true,
  verbose: true,
  onUpdate: (result) => {
    if (result.success) {
      console.log(`✅ ${result.updated} monstres mis à jour`)
    }
  }
})
```

#### Déclenchement manuel

```tsx
const { trigger, isUpdating } = useAutoUpdateMonsters({
  enabled: false // Pas d'auto-update
})

return (
  <button onClick={trigger} disabled={isUpdating}>
    {isUpdating ? 'Mise à jour...' : 'Mettre à jour maintenant'}
  </button>
)
```

#### Affichage du délai

```tsx
const { nextUpdateIn } = useAutoUpdateMonsters()

return (
  <div>
    {nextUpdateIn && (
      <p>Prochaine mise à jour dans {Math.round(nextUpdateIn / 1000)}s</p>
    )}
  </div>
)
```

#### Avec callback

```tsx
const [stats, setStats] = useState({ total: 0, monsters: 0 })

useAutoUpdateMonsters({
  minInterval: 60000,
  maxInterval: 180000,
  onUpdate: (result) => {
    if (result.success) {
      setStats({
        total: stats.total + 1,
        monsters: stats.monsters + (result.updated || 0)
      })
    }
  }
})
```

## Composant `MonstersAutoUpdater`

Composant React pour intégrer facilement les mises à jour automatiques.

### Props

```typescript
interface MonstersAutoUpdaterProps {
  minInterval?: number
  maxInterval?: number
  enabled?: boolean
  verbose?: boolean
  showIndicator?: boolean
}
```

### Exemple d'utilisation

```tsx title="src/app/layout.tsx"
import { MonstersAutoUpdater } from '@/components/monsters/auto-updater'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <MonstersAutoUpdater
          minInterval={60000}
          maxInterval={180000}
          enabled
          verbose
          showIndicator={false}
        />
      </body>
    </html>
  )
}
```

## États des monstres

```typescript
type MonsterState = 'sad' | 'angry' | 'hungry' | 'sleepy'

const MONSTER_STATES: readonly MonsterState[] = [
  'sad',    // 😢 Triste
  'angry',  // 😠 En colère
  'hungry', // 😋 Affamé
  'sleepy'  // 😴 Endormi
]
```

## Logs

Tous les logs sont préfixés pour faciliter le filtrage :

### Logs frontend

```
[TIMESTAMP] [AUTO-UPDATE] [LEVEL] message
```

Exemples :
```
[2025-10-29T...] [AUTO-UPDATE] 🚀 Démarrage des mises à jour automatiques (intervalle aléatoire: 1-3 min)
[2025-10-29T...] [AUTO-UPDATE] 🔄 Déclenchement mise à jour des monstres...
[2025-10-29T...] [AUTO-UPDATE] ✅ Monstres mis à jour avec succès
[2025-10-29T...] [AUTO-UPDATE] ⏰ Prochaine mise à jour dans 142s (2 min)
[2025-10-29T...] [AUTO-UPDATE] ❌ Erreur lors de la mise à jour
```

### Logs API/Backend

```
[TIMESTAMP] [CRON-UPDATE-MONSTERS] [LEVEL] message
```

Exemples :
```
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] 🚀 Démarrage de la mise à jour des monstres...
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] 🔌 Connexion à MongoDB...
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] ✅ Connecté à MongoDB
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] 📊 5 monstre(s) trouvé(s)
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] ✨ Monstre 507f... → hungry => sleepy
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] ✅ Mise à jour terminée: 5 monstre(s) en 223ms
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [ERROR] ❌ Erreur lors de la mise à jour des monstres
```

## Variables d'environnement

```env
# Token secret serveur (optionnel)
CRON_SECRET_TOKEN=your_secret_token

# Token public client (optionnel, doit être identique)
NEXT_PUBLIC_CRON_SECRET_TOKEN=your_secret_token
```

## Constantes

```typescript
// Valeurs par défaut
const DEFAULT_MIN_INTERVAL = 60000  // 1 minute
const DEFAULT_MAX_INTERVAL = 180000 // 3 minutes
const DEFAULT_ENABLED = true
const DEFAULT_VERBOSE = true
const DEFAULT_SHOW_INDICATOR = false

// Limites
const MAX_DURATION = 60 // Durée max d'exécution API (secondes)
```

## 🔗 Voir aussi

- [Configuration avancée](./configuration.md)
- [Dépannage](./troubleshooting.md)
- [Guide de démarrage](./quickstart.md)

