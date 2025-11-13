# 🔐 GitHub OAuth Authentication - Documentation

**Date** : 13 novembre 2025  
**Objectif** : Implémenter l'authentification GitHub OAuth avec Better Auth

---

## ✅ Implémentation Complète

### 📁 Fichiers Créés

#### 1. **`src/config/oauth.config.ts`** - Configuration OAuth
Configuration centralisée pour tous les providers OAuth (GitHub, Google, etc.)

**Exports** :
- `GITHUB_OAUTH_CONFIG` : Configuration GitHub complète
- `OAUTH_PROVIDERS` : Map de tous les providers disponibles
- `OAUTH_ERROR_MESSAGES` : Messages d'erreur prédéfinis
- `getOAuthProviderConfig()` : Helper pour obtenir une config
- `isOAuthProviderEnabled()` : Vérifier si un provider est activé

**Exemple** :
```typescript
import { GITHUB_OAUTH_CONFIG } from '@/config/oauth.config'

// Configuration GitHub
const config = GITHUB_OAUTH_CONFIG
// {
//   name: 'github',
//   label: 'Continuer avec GitHub',
//   icon: '🐙',
//   bgColor: 'bg-gray-800',
//   bgColorHover: 'hover:bg-gray-900',
//   textColor: 'text-white',
//   enabled: true
// }
```

#### 2. **`src/components/auth/oauth-button.tsx`** - Bouton OAuth
Composant réutilisable pour afficher un bouton de connexion OAuth.

**Props** :
- `provider` : Configuration du provider (GitHub, Google, etc.)
- `onError?` : Callback en cas d'erreur
- `callbackURL?` : URL de redirection après connexion (défaut: `/app`)

**Exemple** :
```tsx
<OAuthButton
  provider={GITHUB_OAUTH_CONFIG}
  onError={(error) => console.error(error)}
  callbackURL="/app"
/>
```

**Fonctionnalités** :
- ✅ État de chargement pendant la connexion
- ✅ Gestion des erreurs avec callback
- ✅ Styles configurables via la config
- ✅ Redirection automatique après connexion

#### 3. **`src/components/auth/oauth-section.tsx`** - Section OAuth
Section complète avec tous les boutons OAuth + séparateur visuel.

**Props** :
- `onError?` : Callback en cas d'erreur
- `callbackURL?` : URL de redirection (défaut: `/app`)

**Exemple** :
```tsx
<OAuthSection onError={(error) => console.error(error)} />
```

**Rendu** :
```
┌─────────────────────────────────────┐
│  🐙 Continuer avec GitHub           │
├─────────────────────────────────────┤
│  ─── ou continuer avec email ───    │
└─────────────────────────────────────┘
```

---

## 🔧 Intégration dans les Formulaires

### Formulaire de Connexion (`sign-in-form.tsx`)

**Avant** :
```tsx
<div className='space-y-4'>
  <h2>🔐 Connexion</h2>
  <form>
    <InputField label='Email' ... />
    <InputField label='Mot de passe' ... />
    <Button type='submit'>Se connecter</Button>
  </form>
</div>
```

**Après** :
```tsx
<div className='space-y-4'>
  <h2>🔐 Connexion</h2>
  
  {/* Boutons OAuth (GitHub, etc.) */}
  <OAuthSection onError={onError} callbackURL='/app' />
  
  <form>
    <InputField label='Email' ... />
    <InputField label='Mot de passe' ... />
    <Button type='submit'>Se connecter</Button>
  </form>
</div>
```

### Formulaire d'Inscription (`sign-up-form.tsx`)

Même intégration que le formulaire de connexion.

---

## 🎯 Flux d'Authentification GitHub

### 1️⃣ Utilisateur clique sur "Continuer avec GitHub"

```tsx
<OAuthButton provider={GITHUB_OAUTH_CONFIG} />
```

### 2️⃣ Déclenchement de la connexion OAuth

```typescript
await authClient.signIn.social({
  provider: 'github',
  callbackURL: '/app'
})
```

### 3️⃣ Redirection vers GitHub

Better Auth redirige automatiquement vers :
```
https://github.com/login/oauth/authorize?
  client_id=YOUR_CLIENT_ID
  &redirect_uri=YOUR_APP/api/auth/callback/github
  &scope=user:email
```

### 4️⃣ Autorisation GitHub

L'utilisateur autorise l'application à accéder à ses informations.

### 5️⃣ Callback GitHub → Better Auth

GitHub redirige vers :
```
https://your-app.com/api/auth/callback/github?code=XXXX
```

Better Auth :
- ✅ Échange le code contre un access token
- ✅ Récupère les informations utilisateur GitHub
- ✅ Crée ou met à jour l'utilisateur en base
- ✅ Crée une session

### 6️⃣ Redirection vers l'Application

```
https://your-app.com/app
```

L'utilisateur est maintenant connecté !

---

## 🔐 Configuration Backend (Déjà en place)

### Fichier `src/lib/auth.ts`

```typescript
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { client } from '@/db'

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DATABASE_NAME)),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID,      // ✅ Configuré
      clientSecret: process.env.GITHUB_CLIENT_SECRET // ✅ Configuré
    }
  }
})
```

### Variables d'Environnement (`.env.local`)

```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
MONGODB_DATABASE_NAME=your_database_name
```

---

## 🎨 Personnalisation

### Ajouter un Nouveau Provider (Google, Discord, etc.)

#### 1. Ajouter la config dans `oauth.config.ts`

```typescript
export const GOOGLE_OAUTH_CONFIG: OAuthProviderConfig = {
  name: 'google',
  label: 'Continuer avec Google',
  icon: '🔵',
  bgColor: 'bg-blue-500',
  bgColorHover: 'hover:bg-blue-600',
  textColor: 'text-white',
  enabled: true
}

export const OAUTH_PROVIDERS = {
  github: GITHUB_OAUTH_CONFIG,
  google: GOOGLE_OAUTH_CONFIG // ← Nouveau provider
}
```

#### 2. Configurer Better Auth (`src/lib/auth.ts`)

```typescript
export const auth = betterAuth({
  // ... config existante
  socialProviders: {
    github: { /* ... */ },
    google: {              // ← Nouveau provider
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
})
```

#### 3. Ajouter les variables d'environnement

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**C'est tout !** Le bouton Google apparaîtra automatiquement.

---

## 🎯 Principes SOLID Appliqués

### ✅ Single Responsibility Principle (SRP)

Chaque composant a une responsabilité unique :
- **`oauth.config.ts`** → Configuration uniquement
- **`oauth-button.tsx`** → Affichage d'un bouton uniquement
- **`oauth-section.tsx`** → Orchestration des boutons uniquement

### ✅ Open/Closed Principle (OCP)

Pour ajouter un nouveau provider OAuth :
```typescript
// Ajouter dans oauth.config.ts
export const DISCORD_OAUTH_CONFIG = { ... }

// Ajouter dans OAUTH_PROVIDERS
export const OAUTH_PROVIDERS = {
  github: GITHUB_OAUTH_CONFIG,
  google: GOOGLE_OAUTH_CONFIG,
  discord: DISCORD_OAUTH_CONFIG // ← Extension sans modification
}
```

**Aucune modification des composants !**

### ✅ Dependency Inversion Principle (DIP)

Les composants dépendent de **l'abstraction** (`OAuthProviderConfig`) et non de l'implémentation :

```typescript
interface OAuthButtonProps {
  provider: OAuthProviderConfig // ← Abstraction
  // ...
}
```

---

## 🔒 Sécurité

### Variables d'Environnement

- ✅ **Client ID** : Public (peut être exposé)
- ⚠️ **Client Secret** : **JAMAIS** exposer côté client
  - Stocké uniquement dans `.env.local`
  - Utilisé uniquement côté serveur (Better Auth)
  - Ajouté au `.gitignore`

### Redirections

Better Auth gère automatiquement :
- ✅ Validation du `redirect_uri`
- ✅ Protection CSRF
- ✅ Vérification du `state` parameter

### Sessions

- ✅ Sessions sécurisées via cookies HTTP-only
- ✅ Expiration automatique
- ✅ Protection contre les attaques XSS/CSRF

---

## 🧪 Tests

### Test Manuel

1. Aller sur `/sign-in`
2. Cliquer sur "🐙 Continuer avec GitHub"
3. Autoriser l'application sur GitHub
4. Vérifier la redirection vers `/app`
5. Vérifier que la session est active

### Test de Désactivation

```typescript
// oauth.config.ts
export const GITHUB_OAUTH_CONFIG = {
  // ...
  enabled: false // ← Désactiver temporairement
}
```

Le bouton GitHub ne s'affichera plus.

### Test d'Erreur

Simuler une erreur réseau :
1. Couper la connexion internet
2. Cliquer sur le bouton GitHub
3. Vérifier que l'erreur est affichée

---

## 📊 Résumé

### Fichiers Créés (3)
- ✅ `src/config/oauth.config.ts` (90 lignes)
- ✅ `src/components/auth/oauth-button.tsx` (95 lignes)
- ✅ `src/components/auth/oauth-section.tsx` (62 lignes)

### Fichiers Modifiés (4)
- ✅ `src/components/forms/sign-in-form.tsx`
- ✅ `src/components/forms/sign-up-form.tsx`
- ✅ `src/lib/auth-client.ts`
- ✅ `src/config/index.ts`

### Fonctionnalités
- ✅ Authentification GitHub OAuth
- ✅ Gestion des erreurs
- ✅ États de chargement
- ✅ Redirection automatique
- ✅ Extensible (prêt pour Google, Discord, etc.)
- ✅ Type-safe avec TypeScript
- ✅ Principes SOLID respectés

**Ready for production!** 🚀

---

## 🎉 Utilisation Finale

### Page de Connexion

```
┌──────────────────────────────────────────┐
│  🎮 Bienvenue chez ATTM !                │
│  Vos petits monstres vous attendent 👹✨  │
├──────────────────────────────────────────┤
│                                          │
│  🐙 Continuer avec GitHub                │
│                                          │
│  ─── ou continuer avec email ───         │
│                                          │
│  📧 Email                                │
│  [________________]                      │
│                                          │
│  🔒 Mot de passe                         │
│  [________________]                      │
│                                          │
│  🎮 Se connecter                         │
│                                          │
└──────────────────────────────────────────┘
```

L'utilisateur peut maintenant se connecter avec GitHub en un seul clic ! 🎊

---

**Auteur** : GitHub Copilot  
**Date** : 13 novembre 2025  
**Version** : 1.0.0
