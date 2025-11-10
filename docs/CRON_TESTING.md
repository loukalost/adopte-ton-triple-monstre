# 🧪 Tests du système de mise à jour automatique

Ce document explique comment tester le système de mise à jour automatique des monstres.

## Tests manuels

### 1. Test de l'API directement

```bash
# Test sans authentification
curl http://localhost:3000/api/cron/update-monsters

# Test avec authentification
curl -H "Authorization: Bearer votre_token" \
  http://localhost:3000/api/cron/update-monsters

# Test avec jq pour formater le JSON
curl -s http://localhost:3000/api/cron/update-monsters | jq
```

**Résultat attendu** :

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

### 2. Test dans le navigateur

1. Ouvrez `http://localhost:3000/api/cron/update-monsters`
2. Vous devriez voir le JSON de réponse
3. Rafraîchissez plusieurs fois pour voir les états changer

### 3. Test avec la console du navigateur

```javascript
// Appeler l'API depuis la console
fetch('/api/cron/update-monsters', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('✅ Résultat:', data))
  .catch(err => console.error('❌ Erreur:', err))
```

### 4. Vérifier les logs en temps réel

#### Dans le navigateur

Ouvrez la console (F12) et laissez tourner. Vous devriez voir un log toutes les 60 secondes :

```
[2025-10-29T...] [AUTO-UPDATE] 🚀 Démarrage des mises à jour automatiques (intervalle: 60000ms)
[2025-10-29T...] [AUTO-UPDATE] 🔄 Déclenchement mise à jour des monstres...
[2025-10-29T...] [AUTO-UPDATE] ✅ Monstres mis à jour avec succès { updated: 5, duration: 223 }
```

#### Dans le terminal (dev)

Votre terminal `npm run dev` devrait afficher :

```
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] 🚀 Démarrage de la mise à jour des monstres...
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] 🔌 Connexion à MongoDB...
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] ✅ Connecté à MongoDB
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] 📊 5 monstre(s) trouvé(s)
[2025-10-29T...] [CRON-UPDATE-MONSTERS] [INFO] ✨ Monstre 507f... → hungry => sleepy
```

## Tests automatisés (Optionnel)

### Test unitaire de l'API route

Créez un fichier `src/app/api/cron/update-monsters/__tests__/route.test.ts` :

```typescript
import { GET } from '../route'
import { NextRequest } from 'next/server'

describe('API Route: /api/cron/update-monsters', () => {
  it('should return success response', async () => {
    const request = new NextRequest('http://localhost:3000/api/cron/update-monsters')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.updated).toBeGreaterThanOrEqual(0)
  })

  it('should return 401 if token is invalid', async () => {
    process.env.CRON_SECRET_TOKEN = 'secret123'
    
    const request = new NextRequest('http://localhost:3000/api/cron/update-monsters')
    const response = await GET(request)

    expect(response.status).toBe(401)
  })
})
```

## Scénarios de test

### Scénario 1 : Première mise à jour

1. Démarrez l'application : `npm run dev`
2. Ouvrez `http://localhost:3000`
3. Ouvrez la console (F12)
4. Attendez 5 secondes maximum
5. ✅ Vous devriez voir le premier log de mise à jour

### Scénario 2 : Mise à jour continue

1. Laissez l'application ouverte
2. Observez les logs toutes les 60 secondes
3. ✅ Chaque mise à jour devrait réussir

### Scénario 3 : Vérification en base de données

1. Connectez-vous à MongoDB (Compass, CLI, etc.)
2. Regardez la collection `monsters`
3. Notez l'état de quelques monstres
4. Attendez 60 secondes
5. Rafraîchissez la collection
6. ✅ Les états devraient avoir changé

### Scénario 4 : Test de l'indicateur visuel

1. Modifiez `src/app/layout.tsx` :
   ```tsx
   <MonstersAutoUpdater showIndicator={true} />
   ```
2. Rafraîchissez la page
3. ✅ Un badge devrait apparaître en bas à droite
4. ✅ Il devrait montrer l'animation pendant les mises à jour

### Scénario 5 : Test avec plusieurs onglets

1. Ouvrez l'application dans 3 onglets
2. Ouvrez la console dans chaque onglet
3. ✅ Chaque onglet devrait logger indépendamment
4. ✅ Les mises à jour en base devraient se faire correctement

### Scénario 6 : Test de déconnexion MongoDB

1. Arrêtez MongoDB (ou bloquez l'accès réseau)
2. Attendez une mise à jour
3. ✅ Un log d'erreur devrait apparaître
4. Relancez MongoDB
5. ✅ La prochaine mise à jour devrait réussir

## Métriques à surveiller

### Performance

- ✅ Durée d'exécution : < 500ms pour 10 monstres
- ✅ Durée d'exécution : < 2000ms pour 100 monstres
- ✅ Pas de timeout Vercel (< 60s)

### Fiabilité

- ✅ 100% des mises à jour réussissent en conditions normales
- ✅ Récupération automatique après erreur réseau
- ✅ Pas de fuite mémoire après 100+ mises à jour

### Logs

- ✅ Chaque mise à jour génère des logs
- ✅ Les logs contiennent un timestamp
- ✅ Les erreurs sont loggées correctement

## Checklist de vérification

Avant de déployer en production :

- [ ] L'API `/api/cron/update-monsters` répond correctement
- [ ] Les logs apparaissent dans la console du navigateur
- [ ] Les logs apparaissent dans le terminal (dev)
- [ ] Les états des monstres changent en base de données
- [ ] Le système fonctionne avec plusieurs onglets ouverts
- [ ] Le système récupère après une erreur
- [ ] Les variables d'environnement sont configurées (si sécurisation)
- [ ] Le système fonctionne sur Vercel (si déployé)

## Outils de debug

### 1. Mode debug intensif

Modifiez `src/app/layout.tsx` :

```tsx
<MonstersAutoUpdater
  interval={10000}      // 10 secondes au lieu de 60
  enabled
  verbose
  showIndicator={true}  // Badge visible
/>
```

### 2. Filtrer les logs dans la console

Dans la console du navigateur, utilisez le filtre :
- `AUTO-UPDATE` : Logs frontend
- `CRON-UPDATE-MONSTERS` : Logs API

### 3. Monitoring Vercel

En production :
1. Allez sur Vercel Dashboard
2. Sélectionnez votre projet
3. Onglet "Functions"
4. Filtrez par `/api/cron/update-monsters`
5. Observez les logs et performances

## Problèmes connus et solutions

### Le premier appel est long

**Normal** : La première connexion MongoDB prend plus de temps (~2-3s)

### Les logs n'apparaissent pas immédiatement

**Normal** : Le premier appel est fait immédiatement, puis toutes les 60s

### Erreur "Too many requests"

**Solution** : Augmentez l'intervalle ou utilisez un rate limiter

### Mémoire qui augmente progressivement

**Solution** : Vérifiez qu'il n'y a pas de références qui empêchent le garbage collection

---

**Besoin d'aide ?** Consultez `docs/CRON_SYSTEM.md` pour plus de détails.
