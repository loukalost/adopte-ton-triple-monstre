# Système de Galerie Publique

## Vue d'ensemble

Le système de galerie permet aux utilisateurs de partager leurs monstres avec la communauté en activant le mode public. Les monstres publics sont visibles par tous les utilisateurs dans la galerie publique accessible à `/app/gallery`.

## Architecture

### Principes SOLID appliqués

Le système de galerie a été conçu en respectant rigoureusement les principes SOLID :

#### 1. Single Responsibility Principle (SRP)
- **`toggleMonsterPublicStatus`** : Gère uniquement la bascule du statut public
- **`getPublicMonsters`** : Récupère uniquement les monstres publics
- **`MonsterPublicToggle`** : Affiche uniquement l'interface de toggle
- **`PublicGallery`** : Orchestre uniquement l'affichage de la galerie
- **`PublicMonsterCard`** : Affiche uniquement un monstre public

#### 2. Open/Closed Principle (OCP)
- Les composants sont extensibles via props (variant, iconOnly)
- Nouvelles fonctionnalités ajoutables sans modifier le code existant
- Filtrage et tri peuvent être ajoutés à `getPublicMonsters` sans changer sa signature

#### 3. Liskov Substitution Principle (LSP)
- `PublicMonsterCard` peut être substitué par d'autres cartes de monstre
- `MonsterPublicToggle` peut être utilisé dans différents contextes (card, détail)

#### 4. Interface Segregation Principle (ISP)
- Interfaces minimales et ciblées pour chaque composant
- Pas de props inutiles ou non utilisées

#### 5. Dependency Inversion Principle (DIP)
- Les composants dépendent d'abstractions (DBMonster, actions Server)
- Pas de dépendances directes sur les implémentations

## Composants

### 1. Modèle de données

#### `DBMonster.isPublic`
```typescript
isPublic?: boolean // Mode public pour la galerie (optionnel, défaut: false)
```

Ajouté au schéma Mongoose et au type TypeScript `DBMonster`.

### 2. Actions Server

#### `toggleMonsterPublicStatus(monsterId: string): Promise<boolean>`
**Fichier** : `src/actions/monsters.actions.ts`

Bascule le mode public/privé d'un monstre.

**Responsabilités** :
- Vérifier l'authentification
- Valider la propriété du monstre
- Inverser le statut `isPublic`
- Revalider le cache des pages concernées

**Retour** : La nouvelle valeur de `isPublic`

**Exemple** :
```typescript
const isNowPublic = await toggleMonsterPublicStatus("507f1f77bcf86cd799439011")
// true (si le monstre était privé) ou false (si le monstre était public)
```

#### `getPublicMonsters(): Promise<DBMonster[]>`
**Fichier** : `src/actions/gallery.actions.ts`

Récupère tous les monstres publics pour la galerie.

**Responsabilités** :
- Se connecter à la base de données
- Récupérer les monstres avec `isPublic = true`
- Trier par date de création (plus récents en premier)

**Retour** : Liste des monstres publics

**Exemple** :
```typescript
const publicMonsters = await getPublicMonsters()
// [{ _id: "...", name: "Pikachu", isPublic: true, ... }, ...]
```

### 3. Composants UI

#### `MonsterPublicToggle`
**Fichier** : `src/components/monsters/monster-public-toggle.tsx`

Composant toggle pour activer/désactiver le mode public d'un monstre.

**Props** :
- `monsterId: string` - Identifiant du monstre
- `isPublic: boolean` - Statut public actuel
- `variant?: 'badge' | 'button'` - Variante d'affichage (défaut: 'badge')
- `iconOnly?: boolean` - Afficher uniquement l'icône (défaut: false)

**Variantes** :
- **badge** : Petit badge discret pour les cartes
- **button** : Bouton complet avec texte pour la page de détail

**Exemple** :
```tsx
<MonsterPublicToggle
  monsterId={monster._id}
  isPublic={monster.isPublic ?? false}
  variant='badge'
/>
```

#### `PublicGallery`
**Fichier** : `src/components/gallery/public-gallery.tsx`

Composant de galerie publique affichant tous les monstres publics.

**Props** :
- `monsters: DBMonster[]` - Liste des monstres publics

**Fonctionnalités** :
- Header informatif avec compteur
- Grille responsive de monstres publics
- État vide si aucun monstre public
- Message d'encouragement

**Exemple** :
```tsx
<PublicGallery monsters={publicMonsters} />
```

#### `PublicMonsterCard`
**Fichier** : `src/components/gallery/public-gallery.tsx`

Carte d'affichage d'un monstre public dans la galerie.

**Props** :
- `monster: DBMonster` - Monstre à afficher

**Caractéristiques** :
- Affichage read-only (pas de toggle)
- Badge "Public" affiché
- Design cohérent avec `MonsterCard`
- Optimisations avec `useMemo`

### 4. Pages

#### `/app/gallery`
**Fichier** : `src/app/app/gallery/page.tsx`

Page de galerie publique accessible à tous les utilisateurs authentifiés.

**Responsabilités** :
- Récupérer les monstres publics
- Afficher la galerie avec `PublicGallery`

**Exemple d'accès** :
```
GET /app/gallery
```

## Navigation

### Mobile (Bottom Nav)
- Ajout d'un item "Galerie" avec l'icône 🌍
- Grille passée de 3 à 4 colonnes

### Desktop (App Header)
- Ajout d'un lien "Galerie" dans la navigation principale

## Emplacements du Toggle

### 1. MonsterCard
- Badge compact dans le coin supérieur droit
- Variante : `badge`
- Empêche la propagation du clic vers le lien

### 2. Page de détail du monstre
- Bouton complet dans la barre de navigation
- Variante : `button`
- Affiche le texte explicatif

## Cache et Revalidation

Lorsque le statut public d'un monstre est modifié, les pages suivantes sont revalidées :
- `/app` - Page principale avec la liste des monstres
- `/app/gallery` - Page de galerie publique
- `/app/creatures/[id]` - Page de détail du monstre

## Optimisations

### Performance
- `useMemo` pour mémoriser les calculs coûteux (parsing traits, background)
- Composants optimisés pour éviter les re-renders inutiles
- Sérialisation JSON pour compatibilité Next.js

### UX
- Feedback visuel immédiat avec `useTransition`
- État de chargement pendant la requête
- Gestion d'erreur avec restauration de l'état précédent

## Cas d'usage

### Utilisateur rend un monstre public
1. L'utilisateur clique sur le toggle (badge ou bouton)
2. `toggleMonsterPublicStatus` est appelée
3. Le statut `isPublic` passe à `true`
4. Les caches sont revalidés
5. Le monstre apparaît dans la galerie publique

### Utilisateur rend un monstre privé
1. L'utilisateur clique sur le toggle (badge ou bouton)
2. `toggleMonsterPublicStatus` est appelée
3. Le statut `isPublic` passe à `false`
4. Les caches sont revalidés
5. Le monstre disparaît de la galerie publique

### Utilisateur consulte la galerie
1. L'utilisateur navigue vers `/app/gallery`
2. `getPublicMonsters` récupère tous les monstres publics
3. La galerie affiche les monstres triés par date
4. Si aucun monstre public : affichage de l'état vide

## Tests recommandés

### Tests unitaires
- Vérifier que `toggleMonsterPublicStatus` inverse correctement le statut
- Vérifier que `getPublicMonsters` retourne uniquement les monstres publics
- Vérifier le tri par date de création

### Tests d'intégration
- Vérifier que le toggle fonctionne dans la carte
- Vérifier que le toggle fonctionne dans la page de détail
- Vérifier que les monstres apparaissent/disparaissent de la galerie

### Tests E2E
- Parcours complet : rendre public → voir dans galerie → rendre privé
- Vérifier la revalidation du cache
- Vérifier la navigation vers la galerie depuis le menu

## Améliorations futures

### Fonctionnalités
- [ ] Filtrage par niveau, état, traits
- [ ] Tri personnalisé (niveau, date, nom)
- [ ] Pagination pour grandes listes
- [ ] Recherche de monstres publics
- [ ] Statistiques de la galerie (total, par utilisateur)

### Optimisations
- [ ] Cache des monstres publics côté client
- [ ] Infinite scroll au lieu de pagination
- [ ] Lazy loading des images de fond

### Social
- [ ] Système de likes/favoris
- [ ] Commentaires sur les monstres publics
- [ ] Profils utilisateurs publics
- [ ] Partage sur réseaux sociaux
