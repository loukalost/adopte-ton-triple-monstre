# Système de Monnaie - Koins

## Vue d'ensemble

Le système de Koins est un système de monnaie virtuelle intégré à l'application Tamagotchi. Chaque utilisateur possède un wallet (portefeuille) qui contient sa monnaie sous forme de Koins.

## Architecture

### 1. Modèle de données (`src/db/models/wallet.model.ts`)

Le modèle Wallet est structuré comme suit :

```typescript
{
  ownerId: ObjectId,     // Référence vers l'utilisateur
  balance: Number,       // Solde en Koins (min: 0)
  createdAt: Date,       // Date de création
  updatedAt: Date        // Dernière mise à jour
}
```

**Caractéristiques :**
- Un wallet par utilisateur (relation 1:1 via `ownerId` unique)
- Solde initial : 100 Koins
- Solde minimum : 0 Koins (pas de découvert)
- Index sur `ownerId` pour optimiser les requêtes

### 2. Server Actions (`src/actions/wallet.actions.ts`)

Trois actions principales sont disponibles :

#### `getWallet()`
- Récupère ou crée le wallet de l'utilisateur authentifié
- Si aucun wallet n'existe, en crée un avec 100 Koins
- Retourne le wallet complet

#### `addKoins(amount: number)`
- Ajoute des Koins au wallet
- Validation : le montant doit être positif
- Revalide le cache de la page `/wallet`

#### `subtractKoins(amount: number)`
- Retire des Koins du wallet
- Validation : montant positif et solde suffisant
- Erreur si solde insuffisant
- Revalide le cache de la page `/wallet`

### 3. Interface utilisateur

#### Page Wallet (`src/app/wallet/page.tsx`)
- Route : `/wallet`
- Protection : nécessite authentification
- Gestion d'erreur en cas de problème de chargement

#### Composant Client (`src/components/wallet/wallet-client.tsx`)

**Fonctionnalités :**
- Affichage du solde actuel en temps réel
- Boutons de test pour ajouter/retirer des Koins (+10, +50, +100 / -10, -50, -100)
- Animation flottante lors des transactions (montant animé vers le haut)
- Indicateur de chargement pendant les transactions
- Affichage des erreurs
- Statistiques : date de création, dernière mise à jour, statut (Riche/Confortable/Économe)

**Animations :**
- Animation `floatUp` : fait flotter le montant ajouté/retiré vers le haut
- Couleur verte pour les ajouts, rouge pour les retraits
- Durée : 1.5 secondes

#### Intégration Dashboard
- Bouton "🪙 Mon Wallet" dans le composant `WelcomeHero`
- Variante `outline` pour un style secondaire
- Lien direct vers `/wallet`

## Terminologie

- **Singulier :** Koin
- **Pluriel :** Koins
- **Symbole :** 🪙

## Flux d'utilisation

### Premier accès d'un utilisateur
1. L'utilisateur clique sur "Mon Wallet" depuis le dashboard
2. La page `/wallet` vérifie l'authentification
3. `getWallet()` est appelé
4. Si aucun wallet n'existe, il est créé avec 100 Koins
5. Le wallet est affiché avec le solde initial

### Transaction (ajout/retrait)
1. L'utilisateur clique sur un bouton (+10, -50, etc.)
2. Le composant client appelle `addKoins()` ou `subtractKoins()`
3. L'animation de montant démarre immédiatement
4. La transaction est validée côté serveur
5. En cas de succès :
   - Le solde est mis à jour
   - L'animation se termine après 1.5s
6. En cas d'erreur :
   - Un message d'erreur s'affiche
   - L'animation s'arrête

## Sécurité

- ✅ Authentification requise pour toutes les actions
- ✅ Validation des montants côté serveur
- ✅ Impossible d'avoir un solde négatif
- ✅ Un seul wallet par utilisateur
- ✅ Vérification de propriété via `ownerId`

## Extensions possibles

Le système est conçu pour être extensible. Voici quelques idées :

1. **Intégration avec les monstres**
   - Coût en Koins pour créer un monstre
   - Récompenses en Koins pour les actions correctes
   - Achats d'accessoires ou de nourriture

2. **Système de quêtes**
   - Récompenses en Koins pour compléter des quêtes
   - Défis quotidiens avec bonus

3. **Magasin**
   - Acheter des objets avec des Koins
   - Personnalisation des monstres

4. **Système de niveau de wallet**
   - Débloquer des fonctionnalités avec plus de Koins
   - Badges en fonction du solde

5. **Transactions entre utilisateurs**
   - Envoyer des Koins à d'autres joueurs
   - Marché d'échange

6. **Historique des transactions**
   - Voir toutes les transactions passées
   - Graphiques d'évolution du solde

## Maintenance

### Vérifier le solde d'un utilisateur
```typescript
const wallet = await getWallet()
console.log(`Solde: ${wallet.balance} Koins`)
```

### Réinitialiser un wallet
Pour réinitialiser le wallet d'un utilisateur, supprimer le document dans MongoDB :
```javascript
db.wallets.deleteOne({ ownerId: ObjectId("...") })
```
Le wallet sera recréé automatiquement avec 100 Koins lors du prochain accès.

## Tests

### Tests manuels disponibles
La page `/wallet` inclut des boutons de test pour :
- Ajouter 10, 50 ou 100 Koins
- Retirer 10, 50 ou 100 Koins (si le solde le permet)

Ces boutons sont visibles et utilisables en développement et en production pour faciliter les tests.

### Scénarios de test recommandés
1. ✅ Créer un nouveau compte → vérifier que le wallet démarre à 100 Koins
2. ✅ Ajouter des Koins → vérifier l'animation et la mise à jour
3. ✅ Retirer des Koins → vérifier l'animation et la mise à jour
4. ✅ Tenter de retirer plus que le solde → vérifier le message d'erreur
5. ✅ Actualiser la page → vérifier la persistence du solde
