---
sidebar_position: 5
title: Dépannage
---

# 🔧 Dépannage

Guide pour résoudre les problèmes courants du système de mise à jour automatique.

## 🚨 Problèmes courants

### Aucun log n'apparaît dans la console

**Symptômes :**
- La console du navigateur est vide
- Aucune trace du système de mise à jour

**Solutions :**

1. **Vérifier que verbose est activé**

```tsx
<MonstersAutoUpdater
  verbose={true}  // ← Doit être true
  // ...
/>
```

2. **Vérifier la console du navigateur**
   - Appuyez sur `F12`
   - Allez dans l'onglet **Console**
   - Recherchez `[AUTO-UPDATE]` dans le filtre

3. **Vérifier que le composant est monté**

Ajoutez temporairement :
```tsx
<MonstersAutoUpdater
  showIndicator={true}  // ← Badge visible
  verbose
  // ...
/>
```

---

### Erreur "Unauthorized" (401)

**Symptômes :**
```
[AUTO-UPDATE] ❌ Erreur lors de la mise à jour { status: 401, error: 'Unauthorized' }
```

**Cause :**
- Les tokens ne correspondent pas
- Token manquant côté client

**Solutions :**

1. **Vérifier `.env.local`**

```env
CRON_SECRET_TOKEN=votre_token_secret
NEXT_PUBLIC_CRON_SECRET_TOKEN=votre_token_secret  # ← Doit être identique
```

2. **Redémarrer le serveur**

```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

3. **Sur Vercel**

Allez dans Settings > Environment Variables et vérifiez que les deux variables ont la même valeur.

4. **Désactiver l'authentification (temporairement)**

Supprimez ou commentez les variables dans `.env.local` :

```env
# CRON_SECRET_TOKEN=...
# NEXT_PUBLIC_CRON_SECRET_TOKEN=...
```

---

### Les monstres ne changent pas d'état

**Symptômes :**
- Les logs montrent des mises à jour réussies
- Mais les états ne changent pas en base de données

**Solutions :**

1. **Vérifier la connexion MongoDB**

Testez manuellement l'API :
```bash
curl http://localhost:3000/api/cron/update-monsters
```

2. **Vérifier les logs API**

Dans le terminal où tourne `npm run dev`, cherchez :
```
[CRON-UPDATE-MONSTERS] [INFO] ✨ Monstre xxx → hungry => sleepy
```

3. **Vérifier dans MongoDB**

- Ouvrez MongoDB Compass
- Regardez la collection `monsters`
- Vérifiez le champ `state` et `updatedAt`

4. **Vérifier qu'il y a des monstres**

```bash
curl http://localhost:3000/api/cron/update-monsters
# Regardez le champ "updated" dans la réponse
```

Si `updated: 0`, il n'y a pas de monstres dans la base.

---

### Erreur "Connection to database failed"

**Symptômes :**
```
[CRON-UPDATE-MONSTERS] [ERROR] ❌ Erreur lors de la mise à jour: Connection to database failed
```

**Solutions :**

1. **Vérifier `.env.local`**

```env
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_HOST=cluster.mongodb.net
MONGODB_DATABASE_NAME=tamagotcho
MONGODB_PARAMS=?retryWrites=true&w=majority
MONGODB_APP_NAME=tamagotcho
```

2. **Tester la connexion MongoDB**

Créez un script de test :
```javascript
// test-db.js
import clientPromise from './src/db/index.js'

async function testConnection() {
  try {
    const client = await clientPromise
    console.log('✅ Connexion réussie')
    const db = client.db()
    const collections = await db.listCollections().toArray()
    console.log('Collections:', collections.map(c => c.name))
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

testConnection()
```

3. **Vérifier les IP autorisées sur MongoDB Atlas**

- Allez sur MongoDB Atlas
- Network Access > Add IP Address
- Ajoutez `0.0.0.0/0` (pour autoriser toutes les IPs en dev)

---

### Les mises à jour sont trop fréquentes/rares

**Problème :**
- Les mises à jour se font trop souvent
- Ou trop rarement

**Solutions :**

1. **Vérifier la configuration**

```tsx
<MonstersAutoUpdater
  minInterval={60000}   // 1 minute min
  maxInterval={180000}  // 3 minutes max
  // ...
/>
```

2. **Pour ralentir**

```tsx
<MonstersAutoUpdater
  minInterval={300000}  // 5 minutes min
  maxInterval={600000}  // 10 minutes max
  // ...
/>
```

3. **Pour accélérer (dev uniquement)**

```tsx
<MonstersAutoUpdater
  minInterval={10000}   // 10 secondes min
  maxInterval={30000}   // 30 secondes max
  // ...
/>
```

---

### L'indicateur visuel ne s'affiche pas

**Symptômes :**
- `showIndicator={true}` mais rien ne s'affiche

**Solutions :**

1. **Vérifier le z-index**

L'indicateur utilise `z-50`. Assurez-vous qu'aucun autre élément n'a un z-index supérieur.

2. **Vérifier dans la console**

```javascript
// Dans la console du navigateur
document.querySelector('[role="status"]')
// Devrait retourner un élément
```

3. **Créer votre propre indicateur**

```tsx
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

export function MyIndicator() {
  const { isUpdating, updateCount } = useAutoUpdateMonsters()
  
  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-2">
      {isUpdating ? '🔄' : '✅'} {updateCount} mises à jour
    </div>
  )
}
```

---

### Erreur "Module not found: Can't resolve '@/db'"

**Symptômes :**
```
Error: Module not found: Can't resolve '@/db'
```

**Solution :**

Vérifiez que `src/db/index.ts` exporte bien `clientPromise` :

```typescript
// src/db/index.ts
export default clientPromise
```

---

### Les mises à jour ne s'arrêtent pas

**Symptômes :**
- Les mises à jour continuent même après avoir fermé l'onglet
- Multiples instances qui tournent

**Cause :**
- Chaque onglet ouvert lance sa propre instance

**Solution normale :**
- C'est le comportement attendu
- Chaque onglet est indépendant

**Pour arrêter :**
- Fermez tous les onglets
- Ou désactivez temporairement :

```tsx
<MonstersAutoUpdater
  enabled={false}  // ← Arrêt temporaire
  // ...
/>
```

---

### Performance : Trop de mises à jour en base

**Symptômes :**
- Charge élevée sur MongoDB
- Coûts élevés

**Solutions :**

1. **Augmenter les intervalles**

```tsx
<MonstersAutoUpdater
  minInterval={300000}  // 5 min
  maxInterval={900000}  // 15 min
  // ...
/>
```

2. **Limiter le nombre de monstres mis à jour**

Modifiez `src/app/api/cron/update-monsters/route.ts` :

```typescript
// Mettre à jour seulement 10 monstres aléatoires au lieu de tous
const monsters = await monstersCollection
  .find({})
  .limit(10)  // ← Limiter
  .toArray()
```

3. **Désactiver en production**

```tsx
<MonstersAutoUpdater
  enabled={process.env.NODE_ENV !== 'production'}
  // ...
/>
```

---

## 🧪 Outils de diagnostic

### 1. Tester l'API manuellement

```bash
curl -v http://localhost:3000/api/cron/update-monsters
```

### 2. Activer tous les logs

```tsx
<MonstersAutoUpdater
  verbose={true}
  showIndicator={true}
  minInterval={10000}
  maxInterval={10000}  // Fixe pour debug
  enabled
/>
```

### 3. Vérifier l'état du hook

```tsx
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

export function DebugCron() {
  const state = useAutoUpdateMonsters()
  
  return (
    <div className="fixed bottom-0 left-0 bg-black text-white p-4 text-xs">
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}
```

### 4. Monitoring Vercel (production)

1. Allez sur Vercel Dashboard
2. Sélectionnez votre projet
3. Onglet **Functions**
4. Filtrez par `/api/cron/update-monsters`
5. Examinez les logs et performances

---

## 📊 Checklist de vérification

Avant de demander de l'aide, vérifiez :

- [ ] `npm run dev` tourne sans erreur
- [ ] `.env.local` est correctement configuré
- [ ] MongoDB est accessible
- [ ] Il y a au moins 1 monstre en base
- [ ] La console du navigateur est ouverte
- [ ] `verbose={true}` est activé
- [ ] Les tokens correspondent (si auth activée)
- [ ] Vous avez essayé de redémarrer le serveur
- [ ] Vous avez testé l'API manuellement avec curl

---

## 🆘 Support

Si le problème persiste :

1. **Vérifiez les logs complets**
   - Console navigateur (F12)
   - Terminal `npm run dev`
   - Logs Vercel (production)

2. **Consultez la documentation**
   - [Guide de démarrage](./quickstart.md)
   - [Configuration](./configuration.md)
   - [Référence API](./api-reference.md)

3. **Cherchez dans les issues GitHub**
   - Peut-être que quelqu'un a eu le même problème

4. **Créez une issue**
   - Incluez les logs
   - Décrivez les étapes pour reproduire
   - Mentionnez votre configuration

---

## 💡 Conseils généraux

- **Commencez simple** : Utilisez la configuration par défaut
- **Logs d'abord** : Activez toujours `verbose` en dev
- **Testez l'API** : curl est votre ami
- **MongoDB** : 90% des problèmes viennent de là
- **Redémarrez** : Souvent la solution la plus simple

