# 🔄 Système de mise à jour automatique des monstres (Cron)

Ce document explique comment fonctionne le système de mise à jour automatique des états des monstres dans l'application Tamagotcho.

## 📋 Vue d'ensemble

Le système utilise une approche **intégrée dans Next.js** plutôt qu'un service externe. Les mises à jour sont déclenchées automatiquement depuis le frontend à intervalle régulier (par défaut : toutes les minutes).

### Avantages de cette approche

✅ **Pas de service externe** : Tout est intégré dans votre projet Next.js  
✅ **Gratuit** : Aucun coût supplémentaire  
✅ **Simple** : Pas de configuration complexe  
✅ **Flexible** : Intervalle configurable facilement  
✅ **Logs détaillés** : Suivi complet de chaque mise à jour  
✅ **Robuste** : Gestion d'erreur complète et retry automatique  

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│  Layout Principal (src/app/layout.tsx)          │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  MonstersAutoUpdater Component            │ │
│  │  (invisible, tourne en arrière-plan)      │ │
│  └───────────────┬───────────────────────────┘ │
│                  │                             │
│                  │ Toutes les 60s              │
│                  ▼                             │
│  ┌───────────────────────────────────────────┐ │
│  │  useAutoUpdateMonsters Hook               │ │
│  │  - Gère l'intervalle                      │ │
│  │  - Gère les logs                          │ │
│  │  - Évite les appels concurrents           │ │
│  └───────────────┬───────────────────────────┘ │
└──────────────────┼───────────────────────────────┘
                   │
                   │ POST /api/cron/update-monsters
                   ▼
┌─────────────────────────────────────────────────┐
│  API Route (src/app/api/cron/update-monsters)   │
│  - Se connecte à MongoDB                        │
│  - Récupère tous les monstres                   │
│  - Met à jour leurs états aléatoirement         │
│  - Retourne le résultat avec logs détaillés     │
└─────────────────────────────────────────────────┘
```

## 📦 Fichiers créés

1. **`src/app/api/cron/update-monsters/route.ts`**  
   API route Next.js qui effectue la mise à jour des monstres

2. **`src/hooks/use-auto-update-monsters.ts`**  
   Hook React pour déclencher automatiquement les mises à jour

3. **`src/components/monsters/auto-updater.tsx`**  
   Composant wrapper qui utilise le hook (à placer dans le layout)

4. **`src/app/api/cron/update-monsters/README.md`**  
   Documentation de l'API

## 🚀 Installation et Configuration

### Étape 1 : Variables d'environnement (Optionnel)

Pour sécuriser l'endpoint, ajoutez dans `.env.local` :

```env
# Token secret pour sécuriser l'endpoint (optionnel)
CRON_SECRET_TOKEN=votre_token_secret_ultra_securise

# Pour le frontend (doit être identique au précédent)
NEXT_PUBLIC_CRON_SECRET_TOKEN=votre_token_secret_ultra_securise
```

⚠️ **Note** : Si vous ne définissez pas ces variables, l'endpoint sera accessible sans authentification (ce qui est OK pour un usage interne).

### Étape 2 : Le composant est déjà intégré !

Le composant `MonstersAutoUpdater` a été automatiquement ajouté dans `src/app/layout.tsx` :

```tsx
<MonstersAutoUpdater 
  interval={60000}      // 1 minute
  enabled={true}        // Activé
  verbose={true}        // Logs dans la console
  showIndicator={false} // Pas d'indicateur visuel
/>
```

### Étape 3 : Démarrez l'application

```bash
npm run dev
# ou
yarn dev
```

C'est tout ! Le système démarre automatiquement. 🎉

## 📊 Vérification du fonctionnement

### 1. Console du navigateur

Ouvrez la console de votre navigateur, vous devriez voir :

```
[2025-10-29T12:34:56.789Z] [AUTO-UPDATE] 🚀 Démarrage des mises à jour automatiques (intervalle: 60000ms)
[2025-10-29T12:34:56.790Z] [AUTO-UPDATE] 🔄 Déclenchement mise à jour des monstres...
[2025-10-29T12:34:57.012Z] [AUTO-UPDATE] ✅ Monstres mis à jour avec succès { updated: 5, duration: 223 }
```

### 2. Logs Vercel (en production)

Dans le dashboard Vercel > Votre projet > Functions, vous verrez :

```
[2025-10-29T12:34:56.789Z] [CRON-UPDATE-MONSTERS] [INFO] 🚀 Démarrage de la mise à jour des monstres...
[2025-10-29T12:34:56.890Z] [CRON-UPDATE-MONSTERS] [INFO] ✅ Connecté à MongoDB
[2025-10-29T12:34:56.891Z] [CRON-UPDATE-MONSTERS] [INFO] 📊 5 monstre(s) trouvé(s)
[2025-10-29T12:34:56.892Z] [CRON-UPDATE-MONSTERS] [INFO] ✨ Monstre 507f... → hungry => sleepy
[2025-10-29T12:34:57.012Z] [CRON-UPDATE-MONSTERS] [INFO] ✅ Mise à jour terminée: 5 monstre(s) en 223ms
```

### 3. Test manuel de l'API

```bash
# Test local
curl http://localhost:3000/api/cron/update-monsters

# Test en production
curl https://votre-app.vercel.app/api/cron/update-monsters
```

## ⚙️ Configuration avancée

### Changer les intervalles

Dans `src/app/layout.tsx` :

```tsx
<MonstersAutoUpdater 
  minInterval={30000}   // 30 secondes minimum
  maxInterval={120000}  // 2 minutes maximum
  // ...
/>
```

💡 **Astuce** : Pour un intervalle fixe, définissez `minInterval` = `maxInterval`

### Activer l'indicateur visuel (pour debug)

```tsx
<MonstersAutoUpdater 
  showIndicator={true}  // Affiche un petit badge en bas à droite
  // ...
/>
```

### Désactiver les logs

```tsx
<MonstersAutoUpdater 
  verbose={false}  // Pas de logs dans la console
  // ...
/>
```

### Désactiver temporairement

```tsx
<MonstersAutoUpdater 
  enabled={false}  // Désactive complètement les mises à jour auto
  // ...
/>
```

## 🎨 Utilisation avancée : Bouton manuel

Si vous voulez ajouter un bouton pour déclencher manuellement une mise à jour :

```tsx
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

export function UpdateButton() {
  const { trigger, isUpdating, lastUpdate, nextUpdateIn } = useAutoUpdateMonsters({
    enabled: false, // Désactive l'auto-update
  })

  return (
    <div>
      <button 
        onClick={trigger} 
        disabled={isUpdating}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isUpdating ? '🔄 Mise à jour...' : '🔄 Mettre à jour les monstres'}
      </button>
      
      {lastUpdate && (
        <p className="mt-2">
          {lastUpdate.success 
            ? `✅ ${lastUpdate.updated} monstre(s) mis à jour en ${lastUpdate.duration}ms` 
            : `❌ Erreur: ${lastUpdate.error}`
          }
        </p>
      )}
      
      {nextUpdateIn && (
        <p className="mt-1 text-sm text-gray-500">
          Prochaine: dans {Math.round(nextUpdateIn / 1000)}s
        </p>
      )}
    </div>
  )
}
```

## 🔧 Dépannage

### Problème : Aucun log n'apparaît

**Solution** : Vérifiez que `verbose={true}` et ouvrez la console du navigateur

### Problème : Erreur "Unauthorized"

**Solution** : Vérifiez que `NEXT_PUBLIC_CRON_SECRET_TOKEN` correspond exactement à `CRON_SECRET_TOKEN`

### Problème : Les monstres ne se mettent pas à jour

1. Vérifiez la console du navigateur pour les erreurs
2. Testez l'API manuellement : `/api/cron/update-monsters`
3. Vérifiez la connexion MongoDB
4. Vérifiez que vous avez bien des monstres dans la base de données

### Problème : Trop de requêtes / Performance

**Solution** : Augmentez l'intervalle (ex: `interval={300000}` pour 5 minutes)

## 📈 Déploiement sur Vercel

Aucune configuration spéciale n'est nécessaire ! Le système fonctionne automatiquement sur Vercel.

### Variables d'environnement Vercel

Si vous utilisez l'authentification, ajoutez dans Vercel :

1. Allez dans Settings > Environment Variables
2. Ajoutez :
   - `CRON_SECRET_TOKEN` = votre_token_secret
   - `NEXT_PUBLIC_CRON_SECRET_TOKEN` = votre_token_secret
3. Redéployez

## 📝 États des monstres

### Intervalle aléatoire

Le système utilise un **intervalle aléatoire entre 1 et 3 minutes** entre chaque mise à jour. Cela signifie que :

- Après chaque mise à jour, le système attend un temps aléatoire entre 60 et 180 secondes
- Cela évite les patterns prévisibles et simule un comportement plus naturel
- L'intervalle exact de la prochaine mise à jour est affiché dans les logs

Les états sont mis à jour aléatoirement parmi :

- `sad` - Triste 😢
- `angry` - En colère 😠
- `hungry` - Affamé 😋
- `sleepy` - Endormi 😴

## 🔐 Sécurité

- ✅ Authentification optionnelle par token
- ✅ Pas d'exposition de données sensibles
- ✅ Rate limiting géré par Vercel automatiquement
- ✅ Logs détaillés pour audit

## 🎯 Prochaines améliorations possibles

1. **Webhooks** : Notifier d'autres services après chaque mise à jour
2. **Statistiques** : Tracker le nombre de mises à jour par jour
3. **Logique avancée** : États basés sur l'heure de la journée
4. **Personnalisation** : Intervalle différent selon le type de monstre

## ❓ Questions fréquentes

### Que se passe-t-il si plusieurs onglets sont ouverts ?

Chaque onglet déclenchera ses propres mises à jour. L'API gère cela correctement grâce à MongoDB qui est thread-safe.

### Cela consomme-t-il beaucoup de ressources ?

Non, l'appel est très léger (~200ms) et n'est fait que toutes les minutes. Sur Vercel, vous resterez largement dans les limites gratuites.

### Puis-je utiliser un vrai cron job à la place ?

Oui, mais ce n'est pas recommandé car les solutions gratuites sont limitées (1x/jour sur Vercel gratuit). La solution actuelle est plus flexible.

---

**Besoin d'aide ?** Consultez le fichier `src/app/api/cron/update-monsters/README.md` pour plus de détails sur l'API.
