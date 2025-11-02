---
sidebar_position: 3
title: Configuration avancée
---

# ⚙️ Configuration avancée

Guide complet pour personnaliser le système de mise à jour automatique.

## 📋 Options du composant

### Interface `MonstersAutoUpdaterProps`

```tsx
interface MonstersAutoUpdaterProps {
  /** Intervalle minimum en millisecondes (par défaut 60000 = 1 minute) */
  minInterval?: number
  
  /** Intervalle maximum en millisecondes (par défaut 180000 = 3 minutes) */
  maxInterval?: number
  
  /** Active ou désactive les mises à jour automatiques (par défaut true) */
  enabled?: boolean
  
  /** Active les logs détaillés dans la console (par défaut true) */
  verbose?: boolean
  
  /** Affiche un indicateur visuel des mises à jour (par défaut false) */
  showIndicator?: boolean
}
```

## 🎛️ Configurations courantes

### Configuration par défaut (1-3 minutes)

```tsx title="src/app/layout.tsx"
<MonstersAutoUpdater
  minInterval={60000}
  maxInterval={180000}
  enabled
  verbose
  showIndicator={false}
/>
```

### Configuration rapide (30s - 1min)

Pour un développement plus rapide :

```tsx
<MonstersAutoUpdater
  minInterval={30000}   // 30 secondes
  maxInterval={60000}   // 1 minute
  enabled
  verbose
  showIndicator={true}  // Afficher l'indicateur
/>
```

### Configuration lente (5-10 minutes)

Pour économiser les ressources :

```tsx
<MonstersAutoUpdater
  minInterval={300000}  // 5 minutes
  maxInterval={600000}  // 10 minutes
  enabled
  verbose
  showIndicator={false}
/>
```

### Intervalle fixe (toujours 2 minutes)

```tsx
<MonstersAutoUpdater
  minInterval={120000}
  maxInterval={120000}  // Même valeur = fixe
  enabled
  verbose
  showIndicator={false}
/>
```

### Mode développement (debug complet)

```tsx
<MonstersAutoUpdater
  minInterval={10000}   // 10 secondes
  maxInterval={30000}   // 30 secondes
  enabled
  verbose={true}        // Logs détaillés
  showIndicator={true}  // Indicateur visible
/>
```

### Désactivé (arrêt temporaire)

```tsx
<MonstersAutoUpdater
  minInterval={60000}
  maxInterval={180000}
  enabled={false}  // ← Désactivé
  verbose
  showIndicator={false}
/>
```

## 🔧 Configuration par environnement

### Utiliser des variables d'environnement

```tsx title="src/app/layout.tsx"
<MonstersAutoUpdater
  minInterval={
    process.env.NODE_ENV === 'production' 
      ? 60000   // 1 min en production
      : 10000   // 10s en développement
  }
  maxInterval={
    process.env.NODE_ENV === 'production'
      ? 180000  // 3 min en production
      : 30000   // 30s en développement
  }
  enabled
  verbose={process.env.NODE_ENV !== 'production'}
  showIndicator={process.env.NODE_ENV !== 'production'}
/>
```

### Fichier de configuration dédié

Créez un fichier `src/config/cron.config.ts` :

```tsx title="src/config/cron.config.ts"
export const cronConfig = {
  development: {
    minInterval: 10000,  // 10 secondes
    maxInterval: 30000,  // 30 secondes
    enabled: true,
    verbose: true,
    showIndicator: true
  },
  production: {
    minInterval: 60000,   // 1 minute
    maxInterval: 180000,  // 3 minutes
    enabled: true,
    verbose: false,
    showIndicator: false
  }
}

export const getCurrentConfig = () => {
  return process.env.NODE_ENV === 'production'
    ? cronConfig.production
    : cronConfig.development
}
```

Puis dans le layout :

```tsx title="src/app/layout.tsx"
import { getCurrentConfig } from '@/config/cron.config'

// ...

const cronSettings = getCurrentConfig()

<MonstersAutoUpdater {...cronSettings} />
```

## 🔐 Configuration de sécurité

### Variables d'environnement

```env title=".env.local"
# Token secret pour l'API (serveur uniquement)
CRON_SECRET_TOKEN=super_secret_token_123

# Token public (client - doit être identique)
NEXT_PUBLIC_CRON_SECRET_TOKEN=super_secret_token_123
```

### Sur Vercel

1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez les deux variables :
   - `CRON_SECRET_TOKEN`
   - `NEXT_PUBLIC_CRON_SECRET_TOKEN`
3. Redéployez

### Désactiver l'authentification

Supprimez ou ne définissez pas les variables `CRON_SECRET_TOKEN`. L'endpoint sera accessible sans authentification.

## 🎨 Personnalisation de l'indicateur visuel

L'indicateur affiche :
- État actuel (en cours / inactif)
- Nombre de mises à jour effectuées
- Dernière mise à jour (succès/erreur)
- Temps avant la prochaine mise à jour

### Position personnalisée

Pour modifier la position, créez votre propre composant :

```tsx title="src/components/custom-updater.tsx"
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

export function CustomUpdater() {
  const { isUpdating, lastUpdate, updateCount, nextUpdateIn } = 
    useAutoUpdateMonsters({
      minInterval: 60000,
      maxInterval: 180000,
      enabled: true,
      verbose: true
    })

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded">
      {isUpdating ? (
        <p>🔄 Mise à jour en cours...</p>
      ) : (
        <div>
          <p>✅ {updateCount} mises à jour</p>
          {nextUpdateIn && (
            <p className="text-xs">
              Prochaine : {Math.round(nextUpdateIn / 1000)}s
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

## 📊 Logs personnalisés

### Callback onUpdate

```tsx
const [stats, setStats] = useState({ success: 0, errors: 0 })

<MonstersAutoUpdater
  minInterval={60000}
  maxInterval={180000}
  enabled
  verbose
  showIndicator={false}
  onUpdate={(result) => {
    if (result.success) {
      setStats(prev => ({ ...prev, success: prev.success + 1 }))
      // Envoi à un service analytics
      analytics.track('Monster Update Success', {
        updated: result.updated,
        duration: result.duration
      })
    } else {
      setStats(prev => ({ ...prev, errors: prev.errors + 1 }))
      // Log d'erreur
      console.error('Update failed:', result.error)
    }
  }}
/>
```

## 🚀 Optimisations

### Réduire la charge en production

```tsx
const isProduction = process.env.NODE_ENV === 'production'

<MonstersAutoUpdater
  minInterval={isProduction ? 300000 : 30000}  // 5 min vs 30s
  maxInterval={isProduction ? 600000 : 60000}  // 10 min vs 1 min
  enabled
  verbose={!isProduction}  // Logs seulement en dev
  showIndicator={!isProduction}
/>
```

### Désactiver pendant les tests

```tsx
const isTesting = process.env.NODE_ENV === 'test'

<MonstersAutoUpdater
  minInterval={60000}
  maxInterval={180000}
  enabled={!isTesting}  // Désactivé en test
  verbose
  showIndicator={false}
/>
```

## 📝 Résumé des valeurs recommandées

| Environnement | minInterval | maxInterval | verbose | showIndicator |
|---------------|-------------|-------------|---------|---------------|
| **Développement** | 10000 (10s) | 30000 (30s) | true | true |
| **Staging** | 30000 (30s) | 120000 (2min) | true | false |
| **Production** | 60000 (1min) | 180000 (3min) | false | false |
| **Test** | - | - | false | false (désactivé) |

## 🔗 Voir aussi

- [API Reference](./api-reference.md) - Documentation de l'API
- [Hook useAutoUpdateMonsters](./api-reference.md#hook-useautoupdatemonsters)
- [Dépannage](./troubleshooting.md) - Résoudre les problèmes

