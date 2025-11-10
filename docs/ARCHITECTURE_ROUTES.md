# 🗺️ Architecture des routes

Documentation de la structure des routes de l'application Tamagotcho après refactoring.

## 📋 Vue d'ensemble

L'application est maintenant divisée en **deux parties distinctes** :

### 🌐 Partie publique

Routes accessibles sans authentification :

| Route | Fichier | Description |
|-------|---------|-------------|
| `/` | `src/app/page.tsx` | Landing page publique avec sections marketing |
| `/sign-in` | `src/app/sign-in/page.tsx` | Page de connexion |

### 🔐 Partie applicative

Routes nécessitant une authentification (préfixe `/app`) :

| Route | Fichier | Description |
|-------|---------|-------------|
| `/app` | `src/app/app/page.tsx` | Page principale de l'application (Dashboard) |
| `/app/creatures/[id]` | `src/app/app/creatures/[id]/page.tsx` | Détail d'une créature |
| `/app/wallet` | `src/app/app/wallet/page.tsx` | Portefeuille de Koins |

## 🔄 Migrations effectuées

### Déplacements de fichiers

```
Ancien emplacement              →  Nouvel emplacement
────────────────────────────────────────────────────────────────
src/app/dashboard/page.tsx      →  src/app/app/page.tsx
src/app/creature/[id]/page.tsx  →  src/app/app/creatures/[id]/page.tsx
src/app/wallet/page.tsx         →  src/app/app/wallet/page.tsx
```

### Mises à jour des routes

```
Ancienne route         →  Nouvelle route
──────────────────────────────────────────────
/dashboard             →  /app
/creature/[id]         →  /app/creatures/[id]
/wallet                →  /app/wallet
```

## 📁 Structure des dossiers

```
src/app/
├── page.tsx                    # 🌐 Landing page publique
├── sign-in/
│   └── page.tsx               # 🌐 Connexion
├── app/                       # 🔐 Application protégée
│   ├── page.tsx              # Dashboard principal
│   ├── creatures/
│   │   └── [id]/
│   │       └── page.tsx      # Détail créature
│   └── wallet/
│       └── page.tsx          # Portefeuille
├── api/                       # API routes
│   ├── auth/
│   ├── checkout/
│   ├── cron/
│   ├── monster/
│   ├── monsters/
│   └── webhook/
├── layout.tsx                 # Layout racine
└── globals.css               # Styles globaux
```

## 🔗 Liens mis à jour

### Navigation

Les composants de navigation ont été mis à jour :

**`src/components/navigation/app-header.tsx`**
```tsx
const navItems = [
  { href: '/app', label: 'Dashboard', icon: '🏠' },
  { href: '/app/wallet', label: 'Mon Wallet', icon: '🪙' }
]
```

**`src/components/navigation/bottom-nav.tsx`**
```tsx
const navItems = [
  { href: '/app', label: 'Home', icon: '🏠' },
  { href: '/app/wallet', label: 'Wallet', icon: '🪙' },
  { href: '#logout', label: 'Quitter', icon: '🚪', action: 'logout' }
]
```

### Cartes de monstres

**`src/components/monsters/monster-card.tsx`**
```tsx
<Link href={`/app/creatures/${id}`}>
```

### Formulaires d'authentification

**`src/components/forms/signin-form.tsx`** et **`signup-form.tsx`**
```tsx
callbackURL: '/app'  // Redirection après connexion
```

### Pages de détail

**`src/components/creature/creature-page-client.tsx`**
```tsx
onClick={() => { void router.push('/app') }}  // Bouton retour
```

## 🛡️ Protection des routes

### Routes publiques (non protégées)

- `/` - Landing page
- `/sign-in` - Connexion

### Routes protégées (authentification requise)

Toutes les routes sous `/app/*` vérifient l'authentification :

```tsx
const session = await auth.api.getSession({
  headers: await headers()
})

if (session === null || session === undefined) {
  redirect('/sign-in')
}
```

## 🎯 Avantages de cette architecture

### 1. **Séparation claire** 📦
- Partie publique isolée
- Partie applicative groupée sous `/app`

### 2. **SEO optimisé** 🔍
- Landing page publique optimisée pour les moteurs de recherche
- Routes applicatives protégées

### 3. **URLs sémantiques** 📝
- `/app/creatures/[id]` plus explicite que `/creature/[id]`
- Cohérence avec `/app/wallet`

### 4. **Scalabilité** 📈
- Facile d'ajouter de nouvelles pages publiques
- Structure claire pour étendre l'application

### 5. **Sécurité** 🔒
- Toutes les routes app protégées au même niveau
- Redirection automatique vers `/sign-in`

## 🚀 Prochaines étapes possibles

### Pages publiques à ajouter

- `/about` - À propos
- `/features` - Fonctionnalités détaillées
- `/pricing` - Tarifs
- `/contact` - Contact

### Pages applicatives à ajouter

- `/app/settings` - Paramètres utilisateur
- `/app/leaderboard` - Classement
- `/app/shop` - Boutique d'items
- `/app/achievements` - Succès/trophées

## 📝 Checklist de migration

- [x] Déplacer les fichiers dans les bons dossiers
- [x] Mettre à jour les routes de navigation
- [x] Corriger les liens dans les composants
- [x] Mettre à jour les callbacks d'authentification
- [x] Vérifier les redirections
- [x] Tester les routes protégées
- [x] Documenter la nouvelle structure

## 🧪 Tests

### Tester la partie publique

```bash
# Landing page
curl http://localhost:3000/

# Page de connexion
curl http://localhost:3000/sign-in
```

### Tester la partie applicative

```bash
# Dashboard (redirige vers /sign-in si non authentifié)
curl http://localhost:3000/app

# Détail créature
curl http://localhost:3000/app/creatures/[ID]

# Wallet
curl http://localhost:3000/app/wallet
```

## 📚 Ressources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Better Auth Documentation](https://www.better-auth.com/)

---

**Dernière mise à jour** : 29 octobre 2025  
**Version** : 2.0.0
