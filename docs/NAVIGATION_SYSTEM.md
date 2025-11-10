# Système de Navigation

## Vue d'ensemble

Le système de navigation de l'application Tamagotchi est entièrement responsive et s'adapte automatiquement à la taille de l'écran :
- **Desktop** : Header fixe en haut de l'écran
- **Mobile/Tablette** : Barre de navigation fixe en bas de l'écran (style app mobile)

## Architecture

### Composants de navigation

#### 1. `AppHeader` (`src/components/navigation/app-header.tsx`)
Header pour les écrans desktop (≥ md breakpoint).

**Caractéristiques :**
- Position sticky en haut de l'écran
- Effet backdrop-blur pour un style moderne
- Logo cliquable vers le dashboard
- Navigation avec indicateur visuel de page active
- Bouton de déconnexion
- **Visible uniquement sur desktop** (masqué avec `hidden md:block`)

**Navigation disponible :**
- 🏠 Dashboard (`/dashboard`)
- 🪙 Mon Wallet (`/wallet`)
- 🚪 Déconnexion

#### 2. `BottomNav` (`src/components/navigation/bottom-nav.tsx`)
Barre de navigation en bas pour mobile et tablette (< md breakpoint).

**Caractéristiques :**
- Position fixed en bas de l'écran
- Design style "app mobile" avec icônes et labels
- Grille de 3 colonnes pour répartir les liens
- Indicateur visuel avec gradient pour la page active
- Modal de confirmation pour la déconnexion
- Support du safe-area-inset pour les écrans avec encoche
- Animations fluides (fade-in, slide-up)
- **Visible uniquement sur mobile/tablette** (masqué avec `md:hidden`)

**Navigation disponible :**
- 🏠 Dashboard
- 🪙 Wallet
- 🚪 Quitter (avec confirmation)

#### 3. `AppLayout` (`src/components/navigation/app-layout.tsx`)
Wrapper qui orchestre l'affichage des composants de navigation.

**Fonctionnement :**
```tsx
<AppLayout>
  {/* Contenu de votre page */}
</AppLayout>
```

**Ce qu'il fait :**
- Affiche `AppHeader` en haut (desktop uniquement)
- Wrap le contenu dans un `<main>` avec padding bottom sur mobile
- Affiche `BottomNav` en bas (mobile uniquement)
- Utilise Flexbox pour une structure flex-col min-h-screen

## Utilisation

### Intégrer la navigation dans une page

```tsx
import { AppLayout } from '@/components/navigation'

export default function MaPage() {
  return (
    <AppLayout>
      <div className="p-8">
        {/* Votre contenu ici */}
      </div>
    </AppLayout>
  )
}
```

### Pages intégrées

Les pages suivantes utilisent déjà le système de navigation :
- ✅ `/dashboard` - Tableau de bord
- ✅ `/wallet` - Portefeuille de Koins
- ✅ `/creature/[id]` - Page de détail d'une créature

## Responsive Design

### Breakpoints Tailwind utilisés

```css
/* Mobile et tablette : < 768px */
md:hidden  /* Visible uniquement sur mobile */

/* Desktop : ≥ 768px */
hidden md:block  /* Visible uniquement sur desktop */
```

### Padding adaptatif

Le composant `AppLayout` ajoute automatiquement :
- **Mobile** : `pb-20` (padding bottom pour la barre de navigation)
- **Desktop** : `md:pb-0` (pas de padding, car le header est en haut)

### Safe Area Inset

Sur mobile, la BottomNav utilise `env(safe-area-inset-bottom)` pour gérer correctement :
- Les encoches d'iPhone
- Les barres de gestes Android
- Les zones de sécurité des navigateurs

## Animations

### AppHeader
- Transitions douces sur hover (200ms)
- Active state avec scale-95 au clic

### BottomNav
- **fade-in** : Animation d'apparition du modal (200ms)
- **slide-up** : Animation du modal depuis le bas (300ms)
- **active:scale-95** : Feedback tactile au clic

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { 
    transform: translateY(100%);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}
```

## États visuels

### Page active

**Desktop :**
```tsx
// Fond coloré + shadow
bg-moccaccino-100 text-moccaccino-700 shadow-sm
```

**Mobile :**
```tsx
// Gradient coloré
bg-gradient-to-br from-moccaccino-100 to-fuchsia-blue-100 
text-moccaccino-700 shadow-sm
```

### Page inactive

**Desktop :**
```tsx
text-gray-600 hover:bg-gray-100 hover:text-gray-900
```

**Mobile :**
```tsx
text-gray-600 hover:bg-gray-100 hover:text-gray-900
```

## Modal de déconnexion (Mobile uniquement)

Sur mobile, cliquer sur le bouton "Quitter" affiche un modal de confirmation avec :
- Fond overlay semi-transparent avec blur
- Animation slide-up depuis le bas
- 2 options : "Oui, me déconnecter" (rouge) ou "Annuler" (gris)
- Centré en bas de l'écran avec margin-bottom pour la barre de navigation

## Accessibilité

### Sémantique HTML
- Utilisation correcte de `<header>` et `<nav>`
- Liens avec `<Link>` de Next.js pour la navigation côté client
- Boutons avec `<button>` pour les actions

### Feedback visuel
- États hover clairement identifiables
- États actifs avec couleurs distinctes
- Feedback tactile sur mobile (scale transform)

### Navigation clavier
- Tous les liens et boutons sont accessibles au clavier
- Focus visible par défaut

## Extensions futures possibles

Le système est conçu pour être facilement extensible :

### 1. Ajouter un lien dans la navigation

**Desktop** (`app-header.tsx`) :
```tsx
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/wallet', label: 'Mon Wallet', icon: '🪙' },
  { href: '/shop', label: 'Boutique', icon: '🛒' }, // Nouveau lien
]
```

**Mobile** (`bottom-nav.tsx`) :
```tsx
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/wallet', label: 'Wallet', icon: '🪙' },
  { href: '/shop', label: 'Shop', icon: '🛒' }, // Nouveau lien
  { href: '#logout', label: 'Quitter', icon: '🚪', action: 'logout' }
]
```

⚠️ Pensez à ajuster le `grid-cols-3` en `grid-cols-4` dans BottomNav !

### 2. Ajouter un indicateur de notifications

```tsx
<Link href="/notifications" className="relative">
  <span>🔔</span>
  {hasNotifications && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {notificationCount}
    </span>
  )}
</Link>
```

### 3. Afficher l'avatar utilisateur

```tsx
import Image from 'next/image'

<div className="flex items-center gap-2">
  <Image 
    src={user.avatar} 
    alt={user.name} 
    width={32} 
    height={32}
    className="rounded-full"
  />
  <span>{user.name}</span>
</div>
```

### 4. Menu déroulant

Vous pouvez créer un menu déroulant pour les paramètres utilisateur en utilisant :
- Headless UI (recommandé)
- Radix UI
- Ou votre propre implémentation avec `useState`

## Maintenance

### Changer les couleurs
Les couleurs utilisent le système de design Tailwind avec les couleurs personnalisées :
- `moccaccino-*` : Couleur principale
- `fuchsia-blue-*` : Couleur secondaire
- `lochinvar-*` : Couleur tertiaire

### Modifier les breakpoints
Pour changer le point de bascule desktop/mobile, remplacez `md:` par :
- `sm:` (640px)
- `lg:` (1024px)
- `xl:` (1280px)
- etc.

### Désactiver les animations
Pour des raisons d'accessibilité ou de performance, vous pouvez utiliser :
```tsx
className="motion-reduce:transition-none"
```

## Performance

### Optimisations appliquées
- ✅ Logo préchargé avec `priority` sur Next.js Image
- ✅ Composants client uniquement quand nécessaire (`'use client'`)
- ✅ Navigation côté client avec Next.js Link (pas de rechargement de page)
- ✅ Transitions CSS (GPU-accelerated)
- ✅ Sticky positioning avec `position: sticky`

### Considérations
- Le sticky header peut affecter le layout shift - mesurez avec Lighthouse
- Les animations peuvent être désactivées avec `prefers-reduced-motion`

## Tests manuels

### Checklist de test

**Desktop :**
- [ ] Le header s'affiche en haut
- [ ] Les liens de navigation fonctionnent
- [ ] La page active est bien mise en évidence
- [ ] Le bouton déconnexion fonctionne
- [ ] Le logo redirige vers le dashboard

**Mobile :**
- [ ] La barre s'affiche en bas
- [ ] Les liens de navigation fonctionnent
- [ ] La page active est bien mise en évidence
- [ ] Le modal de déconnexion s'affiche au clic
- [ ] L'animation slide-up fonctionne
- [ ] Le contenu n'est pas caché par la barre

**Responsive :**
- [ ] Basculement correct à 768px
- [ ] Pas de double navigation visible
- [ ] Le padding s'adapte correctement
- [ ] Rotation d'écran fonctionne bien

**Accessibilité :**
- [ ] Navigation au clavier possible
- [ ] Focus visible sur les éléments
- [ ] Lecteur d'écran compatible
