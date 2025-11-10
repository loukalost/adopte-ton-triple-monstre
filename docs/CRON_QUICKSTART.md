# 🚀 Guide de démarrage rapide - Système de mise à jour automatique

## ✅ Ce qui a été fait

Le système de mise à jour automatique des monstres est **déjà installé et configuré** dans votre projet Next.js !

### Fichiers créés

- ✅ `src/app/api/cron/update-monsters/route.ts` - API route pour la mise à jour
- ✅ `src/hooks/use-auto-update-monsters.ts` - Hook React pour l'auto-update
- ✅ `src/components/monsters/auto-updater.tsx` - Composant auto-updater
- ✅ `src/app/layout.tsx` - Layout mis à jour avec le composant
- ✅ `src/db/index.ts` - Export de clientPromise ajouté
- ✅ `.env.example` - Variables d'environnement documentées

## 🎯 Comment ça marche ?

1. **Le composant `MonstersAutoUpdater`** est déjà intégré dans le layout principal
2. **À intervalle aléatoire (1-3 minutes)**, il appelle automatiquement l'API `/api/cron/update-monsters`
3. **L'API** se connecte à MongoDB et met à jour aléatoirement l'état de chaque monstre
4. **Tous les logs** sont visibles dans la console du navigateur et dans les logs Vercel

💡 **Pourquoi un intervalle aléatoire ?** Pour simuler un comportement plus naturel et éviter les patterns prévisibles.

## 🔧 Démarrage

### 1. Variables d'environnement (Optionnel)

Si vous voulez sécuriser l'endpoint, ajoutez dans `.env.local` :

```env
# Sécurisation de l'endpoint (optionnel)
CRON_SECRET_TOKEN=votre_token_secret_ici
NEXT_PUBLIC_CRON_SECRET_TOKEN=votre_token_secret_ici
```

⚠️ **Note** : Si vous ne définissez pas ces variables, l'endpoint fonctionnera sans authentification (ce qui est acceptable pour un usage interne).

### 2. Lancer l'application

```bash
npm run dev
# ou
yarn dev
```

### 3. Vérifier que ça fonctionne

#### Option A : Console du navigateur

Ouvrez votre application dans le navigateur et la console (F12). Vous devriez voir :

```
[2025-10-29T...] [AUTO-UPDATE] 🚀 Démarrage des mises à jour automatiques (intervalle aléatoire: 1-3 min)
[2025-10-29T...] [AUTO-UPDATE] 🔄 Déclenchement mise à jour des monstres...
[2025-10-29T...] [AUTO-UPDATE] ✅ Monstres mis à jour avec succès { updated: 5, duration: 223 }
[2025-10-29T...] [AUTO-UPDATE] ⏰ Prochaine mise à jour dans 142s (2 min)
```

#### Option B : Tester l'API manuellement

```bash
# Dans un nouveau terminal
curl http://localhost:3000/api/cron/update-monsters
```

Vous devriez recevoir :

```json
{
  "success": true,
  "updated": 5,
  "timestamp": "2025-10-29T...",
  "duration": 223,
  "details": [...]
}
```

## ⚙️ Configuration

### Modifier les intervalles min/max

Dans `src/app/layout.tsx`, lignes 46-52 :

```tsx
<MonstersAutoUpdater
  minInterval={30000}  // 30 secondes minimum
  maxInterval={120000} // 2 minutes maximum
  enabled
  verbose
  showIndicator={false}
/>
```

**Par défaut :** intervalle aléatoire entre 1 et 3 minutes (60000-180000ms)

### Activer l'indicateur visuel (pour debug)

```tsx
<MonstersAutoUpdater
  interval={60000}
  enabled
  verbose
  showIndicator={true} // ← Badge en bas à droite
/>
```

### Désactiver temporairement

```tsx
<MonstersAutoUpdater
  interval={60000}
  enabled={false} // ← Désactivé
  verbose
  showIndicator={false}
/>
```

## 📊 Suivi et debug

### Logs dans le navigateur

Tous les logs commencent par `[AUTO-UPDATE]` :

```
✅ [AUTO-UPDATE] Mise à jour #1 réussie: 5 monstre(s)
✅ [AUTO-UPDATE] Mise à jour #2 réussie: 5 monstre(s)
```

### Logs Vercel (en production)

Dans le dashboard Vercel > Functions, recherchez `[CRON-UPDATE-MONSTERS]` :

```
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] 🚀 Démarrage de la mise à jour...
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] ✅ Connecté à MongoDB
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] ✨ Monstre 507f... → hungry => sleepy
```

## 🐛 Dépannage

### Problème : Pas de logs dans la console

**Solution** : Vérifiez que `verbose={true}` dans `MonstersAutoUpdater`

### Problème : Erreur "Unauthorized"

**Solution** : Vérifiez que `NEXT_PUBLIC_CRON_SECRET_TOKEN` = `CRON_SECRET_TOKEN`

### Problème : Les monstres ne changent pas d'état

1. Ouvrez la console (F12) et regardez les erreurs
2. Testez l'API : `curl http://localhost:3000/api/cron/update-monsters`
3. Vérifiez la connexion MongoDB
4. Assurez-vous d'avoir au moins 1 monstre en base

### Problème : "clientPromise is not defined"

**Solution** : Vérifiez que `src/db/index.ts` exporte bien `clientPromise` :

```typescript
export default clientPromise
```

## 🚀 Déploiement sur Vercel

### Étape 1 : Push votre code

```bash
git add .
git commit -m "feat: add automatic monsters update system"
git push
```

### Étape 2 : Variables d'environnement (si sécurisation)

Dans Vercel Dashboard > Settings > Environment Variables :

- Ajoutez `CRON_SECRET_TOKEN`
- Ajoutez `NEXT_PUBLIC_CRON_SECRET_TOKEN` (même valeur)

### Étape 3 : Redéployez

Le système démarre automatiquement ! ✨

## 📚 Documentation complète

Pour plus de détails, consultez :

- `docs/CRON_SYSTEM.md` - Documentation technique complète
- `src/app/api/cron/update-monsters/README.md` - Documentation de l'API

## ✨ C'est tout !

Votre système de mise à jour automatique est prêt et fonctionne ! 🎉

Les états de vos monstres seront mis à jour automatiquement toutes les minutes entre :
- 😢 `sad` (triste)
- 😠 `angry` (en colère)
- 😋 `hungry` (affamé)
- 😴 `sleepy` (endormi)