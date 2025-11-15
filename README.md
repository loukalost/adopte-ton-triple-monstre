# 🎮 Adopte ton triple monstre

Application web moderne inspirée des célèbres Tamagotchi, développée avec Next.js 15, TypeScript et MongoDB. Un jeu complet de gestion de créatures virtuelles avec économie de Koins, boutique, quêtes et personnalisation.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Fonctionnalités principales

### 🎨 Système de créatures
- **Génération procédurale** - Plus de 200 000 combinaisons uniques de monstres
- **États émotionnels dynamiques** - 5 états différents (heureux, triste, en colère, affamé, endormi)
- **Mise à jour automatique** - Système Cron intégré pour l'évolution des états
- **Galerie publique** - Partagez vos créatures avec la communauté

### 💰 Système économique
- **Monnaie virtuelle (Koins)** - Gagnez des Koins en interagissant avec vos créatures
- **Boutique intégrée** - 5 packs d'achat avec paiement Stripe
- **Système de récompenses** - Chaque action rapporte des Koins (nourrir +10, câliner +12, etc.)
- **Transactions sécurisées** - Intégration complète de Stripe Checkout

### 🎯 Système de quêtes
- **Quêtes journalières** - Missions renouvelées automatiquement à minuit
- **7 types de quêtes** - Feed, level up, interact, buy, gallery, equip...
- **Récompenses progressives** - Gagnez jusqu'à 100 Koins par quête
- **Système de claim** - Réclamez vos récompenses avec animations

### 👒 Personnalisation
- **Accessoires équipables** - Chapeaux, lunettes, chaussures (3 catégories)
- **Arrière-plans personnalisés** - Personnalisez l'environnement de vos créatures
- **Système de rareté** - Commun, Rare, Épique, Légendaire avec prix variables
- **Boutique d'accessoires** - Achetez avec vos Koins

### 🔐 Authentification & Profil
- **Double authentification** - Email/Password + GitHub OAuth (Better Auth)
- **Dashboard personnel** - Gestion complète de vos créatures et statistiques
- **Profil utilisateur** - Suivi du solde de Koins, quêtes et collections

### 📱 Interface moderne
- **Design System V2** - Palette de couleurs cohérente (Moccaccino, Lochinvar, Fuchsia Blue)
- **Responsive mobile-first** - Optimisé pour tous les écrans
- **Composants réutilisables** - Architecture SOLID et Clean Code
- **Animations fluides** - Transitions et feedback visuels soignés

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20.0 ou supérieur
- MongoDB (local ou Atlas)
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone https://github.com/loukalost/adopte-ton-triple-monstre.git
cd adopte-ton-triple-monstre

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials

# Lancer le serveur de développement
npm run dev






```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📚 Documentation

La documentation complète du projet est disponible dans le dossier `/documentation` et accessible en ligne :

- **Production** : [https://adopte-ton-triple-monstre.vercel.app/documentation](https://adopte-ton-triple-monstre.vercel.app/documentation)
- **Local** : `npm run dev:docs` puis visitez [http://localhost:3000](http://localhost:3000)

### Sections disponibles

- 🏠 **Introduction** - Vue d'ensemble du projet
- 📐 **Architecture** - Principes SOLID et Clean Architecture  
- 🧩 **Composants** - Documentation des composants React
- 🎮 **Fonctionnalités** - Dashboard, Actions, Wallet, Galerie
- 📡 **API Reference** - Documentation complète de l'API REST
- 👾 **Système de Monstres** - Génération procédurale et gestion des créatures
- 🔒 **Authentification** - Configuration et utilisation de Better Auth
- ⏰ **Cron** - Système de mise à jour automatique
- 💰 **Wallet & Shop** - Système de Koins et boutique Stripe
- 🎯 **Quêtes** - Système de quêtes journalières
- 👒 **Accessoires** - Personnalisation et système de rareté
- 🛠️ **Guide de développement** - Instructions pour contribuer

### Documentation technique (dossier `/docs`)

Les fichiers Markdown dans `/docs` contiennent la documentation technique détaillée :

- `ARCHITECTURE.md` - Principes SOLID et structure du code
- `WALLET_SHOP_SYSTEM.md` - Système complet de boutique avec Stripe
- `DAILY_QUESTS_SYSTEM.md` - Implémentation des quêtes journalières
- `GALLERY_SYSTEM.md` - Galerie publique et partage de créatures
- `CRON_SYSTEM.md` - Mise à jour automatique avec Vercel Cron
- `REWARDS_IMPLEMENTATION.md` - Système de récompenses en Koins
- `specs/ACCESSORIES_BACKGROUNDS_SYSTEM.md` - Système de personnalisation complet

### Développer la documentation

```bash
# Démarrer Docusaurus en mode dev
cd documentation
npm install
npm run start
```

## 🏗️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| **Framework** | Next.js 15.5.4 (App Router + Turbopack) |
| **Langage** | TypeScript 5.x (mode strict) |
| **UI** | React 19.1.0 |
| **Styling** | Tailwind CSS 4 avec palette personnalisée |
| **Base de données** | MongoDB 6.20.0 + Mongoose 8.19.1 |
| **Authentification** | Better Auth 1.3.24 (Email + GitHub OAuth) |
| **Paiements** | Stripe 19.3.0 + React Stripe.js |
| **Notifications** | React Toastify 11.0.5 |
| **Effets visuels** | Canvas Confetti 1.9.4 |
| **Linting** | ts-standard 12.0.2 |
| **Déploiement** | Vercel (avec Cron Jobs) |
| **Documentation** | Docusaurus |

## 📁 Structure du projet

```
adopte-ton-triple-monstre/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── checkout/      # Stripe checkout sessions
│   │   │   └── cron/          # Endpoints Cron (quêtes, monstres)
│   │   ├── app/               # Pages protégées de l'application
│   │   │   ├── wallet/        # Boutique de Koins
│   │   │   └── gallery/       # Galerie publique
│   │   ├── creatures/         # Détails des créatures
│   │   ├── sign-in/           # Authentification
│   │   └── page.tsx           # Landing page
│   ├── components/            # Composants React réutilisables
│   │   ├── accessories/       # Système d'accessoires
│   │   ├── backgrounds/       # Arrière-plans personnalisés
│   │   ├── dashboard/         # Composants du tableau de bord
│   │   ├── gallery/           # Galerie publique
│   │   ├── monsters/          # Affichage et actions des monstres
│   │   ├── navigation/        # Header et navigation
│   │   ├── quests/            # Système de quêtes
│   │   ├── shop/              # Boutiques (accessoires, arrière-plans)
│   │   ├── wallet/            # Composants wallet et paiement
│   │   └── sections/          # Sections de la landing page
│   ├── actions/               # Server Actions Next.js
│   │   ├── accessories.actions.ts
│   │   ├── backgrounds.actions.ts
│   │   ├── monsters.actions.ts
│   │   ├── quests.actions.ts
│   │   └── wallet.actions.ts
│   ├── services/              # Logique métier
│   │   ├── monster-generator/ # Génération procédurale
│   │   └── rewards/           # Système de récompenses
│   ├── db/                    # MongoDB & Mongoose
│   │   └── models/            # Modèles de données
│   ├── config/                # Configuration centralisée
│   │   ├── accessories.config.ts
│   │   ├── backgrounds.config.ts
│   │   ├── quests.config.ts
│   │   └── wallet-packages.ts
│   ├── types/                 # Types et interfaces TypeScript
│   ├── lib/                   # Utilitaires et configuration
│   │   ├── auth.ts            # Configuration Better Auth
│   │   └── stripe.ts          # Configuration Stripe
│   └── hooks/                 # Custom React hooks
├── documentation/             # Documentation Docusaurus
├── docs/                      # Documentation technique
│   ├── specs/                 # Spécifications détaillées
│   ├── authentication/        # Docs authentification
│   ├── ARCHITECTURE.md
│   ├── WALLET_SHOP_SYSTEM.md
│   ├── DAILY_QUESTS_SYSTEM.md
│   ├── GALLERY_SYSTEM.md
│   ├── CRON_SYSTEM.md
│   └── ACCESSORIES_BACKGROUNDS_SYSTEM.md
├── public/                    # Assets statiques
└── scripts/                   # Scripts utilitaires
```

## 🎨 Principes d'architecture

Le projet suit rigoureusement les **principes SOLID** et l'**architecture Clean** :

- ✅ **Single Responsibility** - Chaque composant a une seule responsabilité
- ✅ **Open/Closed** - Ouvert à l'extension, fermé à la modification
- ✅ **Liskov Substitution** - Les types peuvent être substitués sans casser le code
- ✅ **Interface Segregation** - Interfaces spécifiques et focalisées
- ✅ **Dependency Inversion** - Dépendance vers des abstractions

Pour plus de détails, consultez la [documentation architecture](./documentation/docs/architecture).

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev              # Démarre Next.js avec Turbopack (port 3000)
npm run dev:docs         # Démarre la documentation Docusaurus (port 3000)

# Build
npm run build            # Build complet (Next.js + Documentation)
npm run build:next       # Build Next.js uniquement
npm run build:docs       # Build documentation uniquement

# Production
npm start                # Démarre le serveur Next.js en production

# Qualité de code
npm run lint             # Linter TypeScript avec ts-standard (auto-fix)
```

## 🎮 Utilisation

### Créer et gérer vos créatures

1. **Inscription/Connexion** - Créez un compte ou connectez-vous avec GitHub
2. **Dashboard** - Accédez à votre tableau de bord (`/app`)
3. **Interagissez** - Nourrissez, câlinez, consolez ou réveillez vos monstres pour gagner des Koins
4. **Galerie publique** - Rendez vos créatures publiques pour les partager avec la communauté

### Gagner et dépenser des Koins

- **Actions sur les monstres** : +8 à +15 Koins par action
- **Quêtes journalières** : Jusqu'à +100 Koins par quête complétée
- **Achats** : Boutique avec packs de 5€ à 800€

### Système de quêtes

- 7 types de quêtes différentes disponibles
- Renouvellement automatique à minuit (Vercel Cron)
- Réclamez vos récompenses dans le dashboard

### Personnalisation

- **Accessoires** : Achetez chapeaux, lunettes et chaussures
- **Arrière-plans** : Personnalisez l'environnement de vos créatures
- **Raretés** : Du Commun au Légendaire avec prix variables

## 🔐 Configuration

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```bash
# MongoDB
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
MONGODB_DATABASE_NAME="adopte-ton-triple-monstre"

# Better Auth
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="votre_secret_key_ici"

# GitHub OAuth
GITHUB_CLIENT_ID="votre_github_client_id"
GITHUB_CLIENT_SECRET="votre_github_client_secret"

# Stripe (paiements)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Cron (optionnel, pour sécuriser les endpoints)
CRON_SECRET_TOKEN="votre_token_secret"
NEXT_PUBLIC_CRON_SECRET_TOKEN="votre_token_secret"
```

#### Marius, voici tes identifiants pour MongoDB :
- **Pseudo :** RiusMax
- **Adresse mail :** test@test.test
- **Mot de passe :** testtest

### Configuration Stripe

1. Créer un compte sur [Stripe](https://stripe.com)
2. Récupérer les clés API (mode test pour le développement)
3. Créer les produits correspondant aux packs de Koins :
   - 10 Koins → 5€
   - 50 Koins → 20€
   - 500 Koins → 150€
   - 1000 Koins → 200€
   - 5000 Koins → 800€

4. Mettre à jour `src/lib/stripe.ts` avec vos Product IDs

### Configuration Vercel Cron

Pour les mises à jour automatiques (quêtes, monstres), configurez dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/cron/renew-quests",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/update-monsters",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de développement](./docs/development-guide.md) pour :

- Installer l'environnement de développement
- Comprendre les conventions de code et l'architecture
- Suivre les principes SOLID et Clean Architecture
- Soumettre une Pull Request

### Workflow

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/ma-feature`)
3. Commit les changements (`git commit -m 'feat: ajout de ma feature'`)
4. Push vers la branche (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

### Conventions de code

- **TypeScript strict mode** - Typage fort obligatoire
- **SOLID principles** - Respecter les 5 principes (SRP, OCP, LSP, ISP, DIP)
- **Clean Architecture** - Séparer les couches (Presentation, Application, Domain, Infrastructure)
- **Component-driven** - Composants réutilisables et testables
- **ts-standard** - Linting automatique avec `npm run lint`

## 🚀 Fonctionnalités à venir

- [ ] Système d'élevage et reproduction de monstres
- [ ] Batailles entre créatures
- [ ] Classements et compétitions
- [ ] Événements saisonniers
- [ ] Marketplace pour échanger des accessoires
- [ ] Système d'achievements
- [ ] Modes de jeu multijoueurs

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **RiusmaX** - [GitHub](https://github.com/RiusmaX)
- **loukalost** - [GitHub](https://github.com/loukalost)

Projet réalisé dans le cadre de la formation **My Digital School**.

---

## 📊 Statistiques du projet

- **200 000+** combinaisons uniques de monstres
- **5 packages** de Koins disponibles
- **7 types** de quêtes journalières
- **3 catégories** d'accessoires
- **4 niveaux** de rareté (Commun → Légendaire)
- **Architecture SOLID** - 100% conforme
- **TypeScript strict** - Typage complet

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React de nouvelle génération
- [Better Auth](https://www.better-auth.com/) - Solution d'authentification moderne
- [Stripe](https://stripe.com/) - Plateforme de paiement sécurisée
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [MongoDB](https://www.mongodb.com/) - Base de données NoSQL
- [Docusaurus](https://docusaurus.io/) - Générateur de documentation
- [Vercel](https://vercel.com/) - Plateforme de déploiement et hosting

---

**Développé avec ❤️ et ☕ par l'équipe Adopte ton triple monstre**