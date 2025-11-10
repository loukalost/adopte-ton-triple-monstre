# Design System V2 - Style Jeu Vidéo Kawaii 🎮✨

## Vue d'ensemble

Le nouveau design de l'application Tamagotchi est entièrement repensé pour offrir une expérience ultra fun, mignonne et engageante, inspirée des jeux vidéo modernes et du style kawaii japonais.

## Philosophie de Design

### Principes Directeurs
1. **Fun avant tout** : Chaque interaction doit être amusante et gratifiante
2. **Visuel Engageant** : Couleurs vives, animations ludiques, effets visuels spectaculaires
3. **Gros et Visible** : Éléments surdimensionnés pour une meilleure lisibilité et impact
4. **Réactivité Joyeuse** : Feedback immédiat sur chaque action
5. **Style Kawaii** : Emojis partout, formes arrondies, dégradés colorés

### Valeurs Clés
- 🎨 **Coloré** : Palettes vibrantes (purple, pink, orange, yellow)
- ⭐ **Animé** : Mouvements fluides et animations engageantes
- 💖 **Mignon** : Icônes, émojis et formes douces
- 🎮 **Ludique** : Interface de jeu vidéo moderne

## Palette de Couleurs

### Couleurs Principales

#### Purple (Principal)
```css
from-purple-100  /* Fond léger */
from-purple-400  /* Accents */
from-purple-600  /* Texte/Titres */
```

#### Pink (Secondaire)
```css
via-pink-100     /* Transitions */
via-pink-400     /* Accents */
via-pink-600     /* Titres */
```

#### Orange/Yellow (Accent & Koins)
```css
to-orange-100    /* Fond léger */
to-orange-400    /* Accents */
from-yellow-400  /* Koins/Trésor */
```

### Dégradés Signatures

#### Dashboard
```css
bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200
```

#### Cartes de Monstres
```css
bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100
```

#### Wallet
```css
bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-200
```

#### Navigation
```css
bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100
```

## Typographie

### Tailles de Texte

#### Titres Principaux
```tsx
// H1 - Ultra visible
className='text-6xl font-black'

// H2 - Section
className='text-4xl font-black'

// H3 - Sous-section
className='text-2xl font-black'
```

#### Corps de Texte
```tsx
// Large
className='text-xl font-bold'

// Normal
className='text-lg font-medium'

// Petit
className='text-sm font-medium'
```

### Effets de Texte

#### Gradient Coloré
```tsx
className='text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text'
```

#### Ombre Portée
```tsx
className='drop-shadow-2xl'
```

## Composants

### Cartes de Monstres (Monster Card)

**Caractéristiques :**
- ✅ Taille augmentée : `p-8` au lieu de `p-6`
- ✅ Bordure épaisse : `ring-4` au lieu de `ring-1`
- ✅ Ombre spectaculaire : `shadow-[0_8px_30px_rgb(0,0,0,0.12)]`
- ✅ Hover scale : `hover:scale-105`
- ✅ Coins très arrondis : `rounded-[2rem]`

**Animations :**
- Effet de brillance au hover (shine)
- Bulles flottantes en arrière-plan
- Étoiles scintillantes
- Particules au hover
- Rotation légère du monstre

**Zone du Monstre :**
- Taille minimale : `min-h-[280px]`
- Fond blanc avec blur : `bg-white/80 backdrop-blur-sm`
- Scale au hover : `group-hover:scale-110`

### Dashboard

**Layout :**
- Header compact en haut
- **Liste de monstres en priorité visuelle** (plus importante)
- Sidebar (quêtes/tips) en dessous sur mobile

**Statistiques :**
- Cartes compactes avec gradients colorés
- Icônes emojis grandes (text-4xl)
- Chiffres énormes (text-4xl font-black)

### Wallet

**Affichage du Solde :**
- Taille du nombre : `text-9xl` (énorme !)
- Pièces animées qui tournent : `animate-spin-slow`
- Particules explosives lors des transactions

**Boutons :**
- Très gros : `py-6 px-8 text-2xl`
- Gradients vifs avec effets de brillance
- Animations de particules au clic

### Navigation

**Desktop (AppHeader) :**
- Hauteur : `h-20`
- Logo avec aura lumineuse
- Boutons arrondis : `rounded-2xl`
- Icônes grandes : `text-3xl`

**Mobile (BottomNav) :**
- Grille 3 colonnes
- Boutons avec gradients
- Icônes très visibles : `text-3xl`
- Animation bounce sur l'élément actif

## Animations

### Animations de Base

#### Float (Flottement)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}
```
Usage : Bulles décoratives en arrière-plan

#### Twinkle (Scintillement)
```css
@keyframes twinkle {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(0.8) rotate(0deg);
  }
  50% { 
    opacity: 1;
    transform: scale(1.3) rotate(180deg);
  }
}
```
Usage : Étoiles décoratives

#### Shine (Brillance)
```css
@keyframes shine {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}
```
Usage : Effet de survol sur les boutons

#### Bounce Slow (Rebond Lent)
```css
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```
Usage : Éléments actifs qui rebondissent

### Animations Spectaculaires

#### Explode (Explosion)
```css
@keyframes explode {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(3) translateY(-150px); }
}
```
Usage : Montant animé qui explose (wallet)

#### Explode Particle (Particules Explosives)
```css
@keyframes explode-particle {
  0% { opacity: 0; transform: translate(0, 0) scale(0); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translate(0, -200px) scale(1.5); }
}
```
Usage : Particules en forme de cœurs lors des transactions

### Durées d'Animation

- **Hover** : `duration-300` (300ms)
- **Transitions** : `duration-500` (500ms)
- **Animations continues** : 2-4 secondes
- **Animations décoratives** : 6-8 secondes

## Effets Visuels

### Ombres

#### Ombre Légère
```css
shadow-lg
```

#### Ombre Forte
```css
shadow-2xl
```

#### Ombre Personnalisée
```css
shadow-[0_30px_90px_rgba(0,0,0,0.25)]
```

#### Ombre Colorée (Glow)
```css
hover:shadow-[0_20px_50px_rgba(239,68,68,0.4)]
```

### Blur et Backdrop

```css
backdrop-blur-sm   /* Léger */
backdrop-blur-lg   /* Fort */
```

### Rings (Bordures Arrondies)

```css
ring-4 ring-white/50    /* Standard */
ring-8 ring-white/80    /* Épais */
```

## Éléments Décoratifs

### Bulles Flottantes

```tsx
<div className='pointer-events-none absolute h-96 w-96 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-400/30 blur-3xl animate-float' />
```

### Étoiles Scintillantes

```tsx
<div className='pointer-events-none absolute text-6xl animate-twinkle'>⭐</div>
```

### Émojis Recommandés

#### Navigation & Actions
- 🏠 Home/Dashboard
- 🪙 Wallet/Monnaie
- 🚪 Déconnexion
- ⭐ Niveau
- 🎮 Jeu

#### États & Émotions
- 💖 Amour/Like
- 💚 Positif/Gain
- 💔 Négatif/Perte
- ✨ Magie/Spécial
- 💎 Précieux

#### Temps & Infos
- 📅 Date
- 🔄 Mise à jour
- 💪 Force/Stats
- 🤑 Riche
- 😊 Heureux

## Responsive Design

### Breakpoints

```css
/* Mobile */
< 768px (md)

/* Tablet */
768px - 1024px (md - lg)

/* Desktop */
> 1024px (lg)
```

### Adaptations Mobile

1. **Cartes de Monstres** : `lg:grid-cols-2` au lieu de 3
2. **Navigation** : Bottom bar au lieu de header
3. **Textes** : Légèrement plus petits sur mobile
4. **Padding** : `pb-20` pour laisser place à la bottom nav

## Interactions

### Hover States

```css
hover:scale-105      /* Agrandissement léger */
hover:scale-110      /* Agrandissement moyen */
hover:shadow-xl      /* Ombre augmentée */
hover:brightness-110 /* Éclaircissement */
```

### Active States

```css
active:scale-95      /* Compression au clic */
active:scale-105     /* Léger */
```

### Disabled States

```css
disabled:opacity-50
disabled:cursor-not-allowed
disabled:transform-none
```

## Boutons

### Bouton Primaire (Call to Action)

```tsx
<button className='
  group relative overflow-hidden
  rounded-2xl
  bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500
  px-10 py-5 text-xl font-black text-white
  shadow-2xl ring-4 ring-green-200/50
  transition-all duration-300
  hover:scale-110 hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)]
  active:scale-105
'>
  {/* Effet de brillance */}
  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-shine' />
  
  <span className='relative flex items-center gap-3'>
    <span className='text-3xl'>🌟</span>
    <span>Action</span>
  </span>
</button>
```

### Bouton Secondaire

```tsx
<button className='
  rounded-2xl
  bg-white/80 text-gray-700
  px-6 py-3 text-lg font-black
  hover:bg-white hover:shadow-lg
  ring-2 ring-gray-200
  transition-all duration-300
  transform hover:scale-105
'>
  Secondaire
</button>
```

## Checklist d'Implémentation

### Pour un Nouveau Composant

- [ ] Utiliser des dégradés colorés
- [ ] Ajouter des animations (au moins float/twinkle)
- [ ] Coins très arrondis (`rounded-2xl` ou plus)
- [ ] Ombres spectaculaires
- [ ] Émojis/icônes visibles
- [ ] Effet hover avec scale
- [ ] Bordures épaisses (`ring-4` ou plus)
- [ ] Textes en font-black ou font-bold
- [ ] Tailles de texte généreuses
- [ ] Padding confortable

### Tests Visuels

- [ ] Hover states fonctionnent
- [ ] Animations ne causent pas de lag
- [ ] Lisible sur mobile
- [ ] Contrastes suffisants
- [ ] Cohérent avec le reste du design

## Performance

### Optimisations Appliquées

1. **GPU Acceleration** : `transform` au lieu de `position`
2. **Will-change** : Implicite via les animations CSS
3. **Backdrop-filter** : Utilisé avec parcimonie
4. **Animations** : CSS plutôt que JS quand possible

### Considérations

- Les animations peuvent être désactivées avec `prefers-reduced-motion`
- Les blur peuvent être lourds sur mobile : utiliser avec modération
- Les gradients animés consomment plus de ressources

## Accessibilité

### Maintenue malgré le style fun

- ✅ Contrastes respectés (4.5:1 minimum)
- ✅ Tailles de texte larges (meilleure lisibilité)
- ✅ Focus visible sur tous les éléments
- ✅ Labels aria où nécessaire
- ✅ Feedback visuel clair

### Émojis

- Toujours avec `aria-hidden='true'` quand décoratifs
- Accompagnés de texte alternatif si porteurs de sens

## Migration depuis V1

### Changements Principaux

1. **Couleurs** : Passage de tons sobres à couleurs vives
2. **Tailles** : Tout a grossi (~50% plus grand)
3. **Animations** : Ajout massif d'animations ludiques
4. **Layout** : Monstres mis en avant sur le dashboard
5. **Navigation** : Redesign complet avec couleurs

### Éléments Conservés

- Structure des composants
- Logique métier
- Architecture (Clean Architecture)
- Patterns de code

## Conclusion

Ce nouveau design system transforme l'application en une expérience de jeu vidéo moderne, fun et ultra engageante. Chaque interaction est une célébration visuelle, chaque élément est une invitation à jouer !

**Mantra** : Si ce n'est pas fun, ça ne rentre pas dans le design ! 🎮✨💖
