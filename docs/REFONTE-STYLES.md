# Guide de Refonte des Styles - ATTM

Ce document liste TOUS les changements systématiques à appliquer pour retirer les dégradés et réduire les tailles.

## ✅ TERMINÉ

### Composants Button & Wallet
- ✅ `src/components/button.tsx` - Tailles réduites (xl: px-6 py-3 au lieu de px-8 py-4)
- ✅ `src/config/wallet-packages.ts` - Gradients remplacés par couleurs solides
- ✅ `src/components/wallet/wallet-client.tsx` - Fond gradient → bg-neutral-50, texte 6xl → 2xl, padding 8 → 4
- ✅ `src/components/wallet/wallet-balance.tsx` - Gradient → solid, text-9xl → text-4xl, rounded-3rem → rounded-lg
- ✅ `src/components/wallet/koin-package-card.tsx` - GradientButton → Button, tailles réduites
- ✅ `src/components/wallet/payment-features.tsx` - text-5xl → text-2xl, gap-6 → gap-3
- ✅ `src/components/wallet/ui/card.tsx` - Gradient → solid, rounded-3xl → rounded-lg, p-6 → p-4
- ✅ `src/components/wallet/modal/error-modal-content.tsx` - Gradient → solid, text-6xl → text-2xl

## 🔨 À FAIRE

### Modals Wallet
- `src/components/wallet/modal/success-modal-content.tsx`
  - Remplacer `bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500` par `bg-[color:var(--color-electric-500)]`
  - `text-6xl` → `text-2xl`
  - `rounded-[3rem]` → `rounded-lg`
  - `p-12` → `p-6`
  - Remplacer GradientButton par Button standard

### UI Wallet à supprimer/simplifier
- `src/components/wallet/ui/decorative-background.tsx` - **SUPPRIMER** (gradients animés inutiles)
- `src/components/wallet/ui/gradient-button.tsx` - **SUPPRIMER** (remplacé par Button standard)
- `src/components/wallet/ui/badge.tsx` - Retirer gradient, utiliser bg simple

### Page Sign-in
- `src/app/sign-in/page.tsx`
  - `bg-gradient-to-br from-electric-50 via-neon-purple-50 to-neutral-50` → `bg-[color:var(--color-neutral-50)]`
  - Barre du haut: `bg-gradient-to-r from-electric-400...` → `bg-[color:var(--color-electric-500)]`
  - Titre: `bg-gradient-to-r from-electric-600 to-neon-purple-600 bg-clip-text text-transparent` → `text-[color:var(--color-electric-600)]`
  - `text-3xl` → `text-xl`

### Formulaires
- `src/components/forms/sign-in-form.tsx` - Réduire text-2xl → text-xl
- `src/components/forms/sign-up-form.tsx` - Réduire text-2xl → text-xl
- `src/components/forms/create-monster-form.tsx` - Réduire padding et text sizes

### Landing Page Sections
- `src/components/sections/hero-section.tsx`
  - Supprimer gradients des titres
  - `text-4xl` → `text-2xl`
  - `p-6` → `p-4`

- `src/components/sections/benefits-section.tsx` - Réduire text-3xl → text-xl
- `src/components/sections/monsters-section.tsx` - Réduire padding
- `src/components/sections/actions-section.tsx` - Réduire tailles
- `src/components/sections/newsletter-section.tsx` - Réduire tailles

### Navigation
- `src/components/navigation/app-header.tsx`
  - `bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100` → `bg-[color:var(--color-neutral-100)]`
  - `border-purple-300` → `border-[color:var(--color-neutral-300)]`
  - Logo gradient → couleur solide
  - `text-3xl` → `text-lg`
  - Boutons: retirer gradients yellow-400, red-400, etc.

- `src/components/navigation/bottom-nav.tsx`
  - Même logique que app-header
  - Modal logout: retirer gradient, réduire tailles

### Dashboard Components
- `src/components/dashboard/welcome-hero.tsx`
  - `bg-gradient-to-r from-pink-500 to-purple-600` → `bg-[color:var(--color-electric-500)]`
  - `text-4xl` → `text-2xl`
  - Bouton créer monstre: `from-green-400 via-emerald-500` → `bg-[color:var(--color-electric-500)]`

- `src/components/dashboard/stats-card.tsx` - Vérifier si gradients, sinon OK
- `src/components/dashboard/quests-section.tsx` - Réduire padding
- `src/components/dashboard/mood-tip-section.tsx`
  - `bg-gradient-to-br from-neon-purple-100/90 via-white to-electric-100/80` → `bg-[color:var(--color-neutral-50)]`

- `src/components/dashboard/user-profile-card.tsx` - Réduire tailles si nécessaire
- `src/components/dashboard/create-monster-modal.tsx` - Réduire tailles modal

### Creature Components
- `src/components/creature/level-up-animation.tsx`
  - **CHANGEMENT MAJEUR**: Retirer TOUS les gradients
  - `bg-gradient-to-br from-yellow-300/30 via-purple-400/30 to-pink-400/30` → supprimer overlay ou bg simple
  - `text-8xl` → `text-3xl`
  - `from-yellow-400 via-pink-500 to-purple-500` → `text-[color:var(--color-electric-600)]`
  - `border-yellow-400` → `border-[color:var(--color-electric-500)]`

- `src/components/creature/creature-page-client.tsx` - Réduire padding général
- `src/components/creature/creature-traits-panel.tsx` - Déjà migré?
- `src/components/creature/creature-colors-panel.tsx` - Déjà migré?
- `src/components/creature/level-up-modal.tsx` - Réduire tailles texte

### Monster Components
- `src/components/monsters/empty-monsters-state.tsx`
  - `bg-gradient-to-br from-white/90 via-electric-50/80 to-neon-purple-50/80` → `bg-[color:var(--color-neutral-50)]`

## Règles de Conversion Systématiques

### Gradients → Couleurs Solides
```tsx
// AVANT
bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent

// APRÈS
text-[color:var(--color-electric-600)]

// AVANT (background)
bg-gradient-to-br from-white via-yellow-50 to-orange-100

// APRÈS
bg-[color:var(--color-neutral-50)]

// AVANT (border gradient effect)
bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500

// APRÈS
bg-[color:var(--color-electric-500)]
```

### Réduction de Tailles
```tsx
// Textes
text-9xl → text-4xl (titres très grands)
text-6xl → text-2xl (titres de sections)
text-5xl → text-xl (sous-titres)
text-4xl → text-lg (titres cards)
text-3xl → text-base (texte important)
text-2xl → text-sm (texte secondaire)
text-xl → text-xs (petits labels)

// Padding
p-12 → p-6 (containers principaux)
p-8 → p-4 (sections)
p-6 → p-3 (cards)
px-8 py-5 → px-4 py-3 (boutons)

// Margins/Gaps
mb-12 → mb-6
mb-8 → mb-4
gap-8 → gap-4
gap-6 → gap-3

// Borders/Radius
rounded-[3rem] → rounded-lg
rounded-3xl → rounded-lg
rounded-2xl → rounded-md
border-4 → border-2
ring-8 → ring-2
ring-4 → ring (ou retirer)

// Shadows
shadow-[0_30px_90px_...] → shadow-lg
shadow-[0_20px_60px_...] → shadow-md
shadow-xl → shadow-md
shadow-2xl → shadow-lg
```

### Palette de Couleurs
- **Primary (Electric Blue)**: `var(--color-electric-500)` pour boutons, liens
- **Accent (Neon Purple)**: `var(--color-neon-purple-500)` pour highlights
- **Backgrounds**: `var(--color-neutral-50)` (clair) à `var(--color-neutral-900)` (sombre)
- **Texte**: `var(--color-neutral-700)` (principal), `var(--color-neutral-600)` (secondaire)
- **Borders**: `var(--color-neutral-200)` ou `var(--color-neutral-300)`

## Ordre de Priorité

1. ✅ Navigation (header + bottom-nav) - Plus visible
2. ✅ Page sign-in - Point d'entrée
3. ✅ Landing page sections - Première impression
4. ✅ Dashboard welcome-hero - Premier écran après login
5. ✅ Creature level-up-animation - Effet "WOW" à tempérer
6. Modals restants
7. Formulaires
8. Autres composants moins critiques
