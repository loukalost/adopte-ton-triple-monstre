---
sidebar_position: 2
title: Guide de démarrage rapide
---

# 🚀 Guide de démarrage rapide

Le système de mise à jour automatique est **déjà configuré et prêt à l'emploi** !

## ✅ Prérequis

- Node.js 18+ installé
- MongoDB configuré (voir `.env.local`)
- Application Next.js en cours d'exécution

## 🎯 Démarrage en 3 étapes

### 1. Lancer l'application

```bash
npm run dev
# ou
yarn dev
```

### 2. Ouvrir la console du navigateur

1. Ouvrez votre navigateur sur `http://localhost:3000`
2. Appuyez sur `F12` pour ouvrir les outils développeur
3. Allez dans l'onglet **Console**

### 3. Observer les logs

Vous devriez voir immédiatement :

```
[2025-10-29T12:34:56.789Z] [AUTO-UPDATE] 🚀 Démarrage des mises à jour automatiques (intervalle aléatoire: 1-3 min)
[2025-10-29T12:34:56.790Z] [AUTO-UPDATE] 🔄 Déclenchement mise à jour des monstres...
[2025-10-29T12:34:57.012Z] [AUTO-UPDATE] ✅ Monstres mis à jour avec succès { updated: 5, duration: 223 }
[2025-10-29T12:34:57.013Z] [AUTO-UPDATE] ⏰ Prochaine mise à jour dans 142s (2 min)
```

## 🧪 Tester manuellement

### Option A : Via curl

```bash
curl http://localhost:3000/api/cron/update-monsters
```

**Réponse attendue :**

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

### Option B : Dans le navigateur

Ouvrez directement : `http://localhost:3000/api/cron/update-monsters`

### Option C : Via la console JavaScript

```javascript
fetch('/api/cron/update-monsters', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('✅ Résultat:', data))
  .catch(err => console.error('❌ Erreur:', err))
```

## ⚙️ Configuration basique

Le système est configuré dans `src/app/layout.tsx` :

```tsx title="src/app/layout.tsx"
<MonstersAutoUpdater
  minInterval={60000}  // 1 minute minimum
  maxInterval={180000} // 3 minutes maximum
  enabled              // Activé
  verbose              // Logs dans la console
  showIndicator={false} // Pas d'indicateur visuel
/>
```

### Modifier l'intervalle

Pour changer les délais entre les mises à jour :

```tsx
<MonstersAutoUpdater
  minInterval={30000}   // 30 secondes minimum
  maxInterval={120000}  // 2 minutes maximum
  enabled
  verbose
  showIndicator={false}
/>
```

### Activer l'indicateur visuel

Pour voir un badge en bas à droite avec les infos :

```tsx
<MonstersAutoUpdater
  minInterval={60000}
  maxInterval={180000}
  enabled
  verbose
  showIndicator={true} // ← Badge visible
/>
```

### Intervalle fixe

Pour un intervalle fixe (non aléatoire) :

```tsx
<MonstersAutoUpdater
  minInterval={60000}
  maxInterval={60000}  // Même valeur = intervalle fixe
  enabled
  verbose
  showIndicator={false}
/>
```

## 🔒 Sécurité (Optionnel)

Pour sécuriser l'endpoint API, ajoutez dans `.env.local` :

```env title=".env.local"
# Token pour sécuriser l'endpoint
CRON_SECRET_TOKEN=votre_token_ultra_secret_ici

# Token public (doit être identique)
NEXT_PUBLIC_CRON_SECRET_TOKEN=votre_token_ultra_secret_ici
```

:::warning Attention
Si `CRON_SECRET_TOKEN` n'est pas défini, l'endpoint sera accessible **sans authentification**. C'est acceptable pour un usage interne, mais pensez à le sécuriser en production.
:::

## ✅ Vérifier que tout fonctionne

### Checklist

- [ ] L'application démarre sans erreur
- [ ] Les logs apparaissent dans la console
- [ ] La première mise à jour se fait immédiatement
- [ ] Les mises à jour suivantes se font à intervalle aléatoire
- [ ] L'API `/api/cron/update-monsters` répond correctement

### En cas de problème

Consultez la section [Dépannage](./troubleshooting.md).

## 📚 Prochaines étapes

- [Configuration avancée](./configuration.md) - Personnaliser le système
- [API Reference](./api-reference.md) - Documentation de l'API
- [Dépannage](./troubleshooting.md) - Résoudre les problèmes

