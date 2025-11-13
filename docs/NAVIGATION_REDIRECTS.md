# 🧭 Système de Navigation et Redirections - ATTM

## Vue d'ensemble

Le système de navigation de l'application ATTM est conçu selon les principes **SOLID** et **Clean Architecture** pour assurer une séparation claire des responsabilités et une maintenabilité optimale.

## Architecture

### Layers

```
┌─────────────────────────────────────────────────────┐
│  Presentation Layer (UI Components)                 │
│  - Pages (/, /sign-in, /app/*)                      │
│  - Components (SessionAlert, AuthForm)              │
└────────────────┬────────────────────────────────────┘
                 │ depends on
┌────────────────▼────────────────────────────────────┐
│  Application Layer (Actions & Routing)              │
│  - navigation.actions.ts                            │
│  - Page layouts (app/layout.tsx, app/app/layout.tsx)│
└────────────────┬────────────────────────────────────┘
                 │ depends on
┌────────────────▼────────────────────────────────────┐
│  Domain Layer (Business Logic)                      │
│  - navigation.service.ts                            │
│  - navigation-error.service.ts                      │
└─────────────────────────────────────────────────────┘
```

### Principes SOLID Appliqués

#### 1. **Single Responsibility Principle (SRP)**
- `navigation.service.ts` : Décide **où** rediriger (logique métier)
- `navigation-error.service.ts` : Gère **les erreurs** de navigation
- Page components : **Affichent** l'UI et orchestrent
- Layouts : **Protègent** les routes et structurent

#### 2. **Open/Closed Principle (OCP)**
- Services extensibles pour nouveaux types de redirections
- Système d'erreurs extensible pour nouveaux cas

#### 3. **Dependency Inversion Principle (DIP)**
- Les pages dépendent des **abstractions** (services) pas de Next.js directement
- Les services retournent des **décisions** abstraites, pas des actions concrètes

## Flux de Navigation

### 1. Landing Page (`/`)

**Comportement intelligent** :
- ✅ **Non connecté** → Reste sur `/` (affiche landing page)
- ✅ **Connecté** → Redirection automatique vers `/app`

**Code** :
```tsx
// src/app/page.tsx
const session = await auth.api.getSession({ headers: await headers() })
const decision = decideHomeRedirect({
  isAuthenticated: session !== null && session !== undefined,
  userId: session?.user?.id
})

if (decision.shouldRedirect) {
  redirect(decision.path) // → /app
}
```

### 2. Connexion/Inscription (`/sign-in`)

**Comportement** :
- ✅ **Déjà connecté** → Redirection automatique vers `/app`
- ✅ **Non connecté** → Affiche formulaire auth (connexion + inscription)
- ✅ **Après connexion réussie** → Redirection vers `/app`
- ✅ **Session expirée** → Affiche alerte + formulaire

**Alertes contextuelles** :
```
/sign-in?expired=true → 🔐 "Votre session a expiré..."
/sign-in?callback=/app/creatures → 🔒 "Cette page nécessite une connexion..."
```

**Code** :
```tsx
// src/app/sign-in/page.tsx
const session = await auth.api.getSession({ headers: await headers() })
if (session !== null) {
  redirect('/app') // Déjà connecté
}

// Affiche SessionAlert (détecte query params)
<SessionAlert />
```

### 3. Routes Protégées (`/app/*`)

**Protection** :
- ✅ Toutes les routes `/app/*` sont protégées par `app/app/layout.tsx`
- ✅ **Non authentifié** → Redirection vers `/sign-in?callback=/app`
- ✅ **Session valide** → Accès autorisé

**Code** :
```tsx
// src/app/app/layout.tsx
const session = await auth.api.getSession({ headers: await headers() })

if (session === null || session === undefined) {
  const error = createUnauthenticatedError('/app')
  logNavigationError(error, { attemptedPath: '/app' })
  redirect(error.redirectPath ?? '/sign-in')
}
```

## Services de Navigation

### `navigation.service.ts` (Domain Layer)

Fonctions pures pour décider des redirections :

```typescript
// Décision pour page d'accueil
decideHomeRedirect(session: UserSession): NavigationDecision

// Décision après authentification
decidePostAuthRedirect(options: RedirectOptions): NavigationDecision

// Décision pour route protégée
decideProtectedRouteRedirect(currentPath: string): NavigationDecision

// Vérification de route protégée
isProtectedRoute(path: string): boolean

// Vérification de page auth
isAuthPage(path: string): boolean
```

### `navigation-error.service.ts` (Domain Layer)

Gestion centralisée des erreurs :

```typescript
// Types d'erreurs
enum NavigationErrorType {
  SESSION_EXPIRED,
  UNAUTHENTICATED,
  FORBIDDEN,
  NETWORK_ERROR,
  SERVER_ERROR
}

// Créateurs d'erreurs
createSessionExpiredError(currentPath: string): NavigationError
createUnauthenticatedError(currentPath: string): NavigationError
createNetworkError(originalError?: Error): NavigationError

// Formatage et logging
formatErrorForUser(error: NavigationError): string
logNavigationError(error: NavigationError, context?: Record<string, any>): void
```

## Composants

### `SessionAlert` Component

Affiche des alertes contextuelles basées sur les query params :

```tsx
// src/components/auth/session-alert.tsx
<SessionAlert />

// Détecte automatiquement :
// - ?expired=true → Alerte jaune "Session expirée"
// - ?callback=/app → Alerte bleue "Connexion requise"
// - Auto-dismiss après 10s
```

## Matrice de Redirection

| État Utilisateur | Route Actuelle | Action | Destination |
|-----------------|---------------|--------|-------------|
| Non connecté | `/` | Aucune | Reste sur `/` |
| Connecté | `/` | Redirect | `/app` |
| Non connecté | `/sign-in` | Aucune | Reste sur `/sign-in` |
| Connecté | `/sign-in` | Redirect | `/app` |
| Non connecté | `/app/*` | Redirect | `/sign-in?callback=/app/*` |
| Connecté | `/app/*` | Aucune | Accès autorisé |
| Session expirée | `/app/*` | Redirect | `/sign-in?expired=true&callback=/app/*` |

## Gestion des Erreurs

### Logging

Les erreurs de navigation sont loguées pour monitoring :

```typescript
logNavigationError(error, {
  attemptedPath: '/app',
  userId: session?.user?.id,
  timestamp: new Date().toISOString()
})

// En production → Envoi vers service de monitoring (Sentry, LogRocket)
// En développement → Console avec formatting
```

### Messages Utilisateur

Tous les messages d'erreur sont formatés avec des emojis pour l'UX :

```
🔐 Session expirée
🔒 Connexion requise
⛔ Accès refusé
📡 Erreur réseau
⚠️ Erreur serveur
```

## Console Logs

### Logs Nettoyés ✅

- ❌ `sign-in-form.tsx` : Logs de debug retirés
- ❌ `sign-up-form.tsx` : Logs de debug retirés
- ❌ `shop-modal.tsx` : Log d'achat retiré
- ❌ `monster/state/route.ts` : Logs verbeux retirés
- ❌ `webhook/stripe/route.ts` : Logs debug simplifiés

### Logs Conservés ✅

- ✅ `db/index.ts` : Logs de connexion (dev uniquement)
- ✅ `auto-updater.tsx` : Logs conditionnels (flag `verbose`)
- ✅ `navigation-error.service.ts` : Logs d'erreurs pour monitoring
- ✅ `webhook/stripe/route.ts` : Logs essentiels (succès paiement, erreurs)
- ✅ Tous les `console.error()` : Conservés pour le debugging

## Testing

### Scénarios de Test

1. **Landing Page**
   - [ ] Non connecté → Voir la landing page
   - [ ] Connecté → Redirigé vers `/app`

2. **Page de Connexion**
   - [ ] Non connecté → Voir formulaire
   - [ ] Connecté → Redirigé vers `/app`
   - [ ] Session expirée → Voir alerte jaune
   - [ ] Callback présent → Voir alerte bleue

3. **Routes Protégées**
   - [ ] Non connecté + `/app` → Redirigé vers `/sign-in`
   - [ ] Non connecté + `/app/creatures` → Redirigé vers `/sign-in?callback=...`
   - [ ] Connecté → Accès autorisé

4. **Flux Complet**
   - [ ] Landing → Sign-in → App → Dashboard ✅
   - [ ] App (non auth) → Sign-in → Connexion → Retour App ✅
   - [ ] App → Déconnexion → Redirigé vers `/` ✅

## Améliorations Futures

### Court Terme
- [ ] Middleware Next.js pour centraliser la protection des routes
- [ ] Redirect vers callback URL après connexion réussie
- [ ] Toast notifications pour les erreurs de navigation

### Long Terme
- [ ] Intégration avec service de monitoring (Sentry)
- [ ] Rate limiting sur les tentatives de connexion
- [ ] Session refresh automatique avant expiration
- [ ] Support multi-langues pour les messages d'erreur

## Références

### Fichiers Clés

**Services** :
- `src/services/navigation.service.ts`
- `src/services/navigation-error.service.ts`

**Pages** :
- `src/app/page.tsx` (Landing)
- `src/app/sign-in/page.tsx` (Auth)
- `src/app/app/layout.tsx` (Protection)

**Components** :
- `src/components/auth/session-alert.tsx`
- `src/components/forms/sign-in-form.tsx`
- `src/components/forms/sign-up-form.tsx`

### Documentation Connexe
- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [WALLET_REFACTORING_SOLID.md](./WALLET_REFACTORING_SOLID.md)
- [NAVIGATION_SYSTEM.md](./NAVIGATION_SYSTEM.md)

---

**Dernière mise à jour** : 13 novembre 2025
**Auteur** : GitHub Copilot
**Version** : 1.0.0
