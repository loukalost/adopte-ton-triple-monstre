---
sidebar_position: 3
---

# API Reference

Documentation complète de l'API backend de ATTM.

## Base URL

```
Production: https://tamagotcho.vercel.app/api
Development: http://localhost:3000/api
```

## Authentification

### Better Auth Endpoints

Tous les endpoints d'authentification sont gérés par Better Auth sous `/api/auth/*`.

#### `POST /api/auth/sign-in/email`

Connexion par email et mot de passe.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": true,
    "createdAt": "2025-11-01T10:00:00Z"
  },
  "session": {
    "token": "session_token_abc123",
    "expiresAt": "2025-12-01T10:00:00Z"
  }
}
```

#### `POST /api/auth/sign-up/email`

Inscription d'un nouvel utilisateur.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "createdAt": "2025-11-01T10:00:00Z"
  }
}
```

#### `POST /api/auth/sign-out`

Déconnexion de l'utilisateur.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

#### `GET /api/auth/session`

Récupère la session active.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "expiresAt": "2025-12-01T10:00:00Z"
  }
}
```

## Monstres

### Server Actions

Les actions serveur sont utilisées pour les opérations sur les monstres.

#### `createMonster()`

Crée un nouveau monstre pour l'utilisateur authentifié.

**Import:**
```typescript
import { createMonster } from '@/actions/monsters.actions'
```

**Parameters:**
```typescript
interface CreateMonsterFormValues {
  name: string  // 3-20 caractères
  draw: string  // JSON stringifié des traits
}
```

**Example:**
```typescript
const monsterData = {
  name: 'Triplou',
  draw: JSON.stringify({
    bodyColor: '#FFB5E8',
    accentColor: '#FF9CEE',
    eyeColor: '#2C2C2C',
    // ... autres traits
  })
}

await createMonster(monsterData)
```

**Response:** `Promise<void>`

**Throws:**
- `Error('User not authenticated')` si pas de session
- `Error('Validation failed')` si données invalides

#### `getMonsters()`

Récupère tous les monstres de l'utilisateur authentifié.

**Import:**
```typescript
import { getMonsters } from '@/actions/monsters.actions'
```

**Example:**
```typescript
const monsters = await getMonsters()
```

**Response:** `Promise<Monster[]>`
```typescript
interface Monster {
  _id: string
  name: string
  level: number
  draw: string
  state: 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy'
  ownerId: string
  createdAt: Date
  updatedAt: Date
}
```

**Throws:**
- `Error('User not authenticated')` si pas de session

## Modèles de Données

### Monster Schema

```typescript
{
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  level: {
    type: Number,
    required: false,
    default: 1,
    min: 1,
    max: 100
  },
  draw: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['happy', 'sad', 'angry', 'hungry', 'sleepy'],
    default: 'happy'
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### User Schema (Better Auth)

```typescript
{
  id: string
  email: string
  name: string
  emailVerified: boolean
  image?: string
  createdAt: Date
  updatedAt: Date
}
```

## Codes d'Erreur

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Données de requête invalides |
| 401 | Unauthorized | Session expirée ou invalide |
| 403 | Forbidden | Pas de permission pour cette ressource |
| 404 | Not Found | Ressource introuvable |
| 409 | Conflict | Conflit (ex: email déjà utilisé) |
| 500 | Internal Server Error | Erreur serveur |

## Rate Limiting

### Limites par Endpoint

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| `/api/auth/sign-in/*` | 5 tentatives | 15 minutes |
| `/api/auth/sign-up/*` | 3 inscriptions | 1 heure |
| Actions monstres | 10 actions | 1 minute |

## Webhooks

### Événements Disponibles

#### `monster.created`

Déclenché quand un nouveau monstre est créé.

**Payload:**
```json
{
  "event": "monster.created",
  "data": {
    "monsterId": "monster_123",
    "userId": "user_123",
    "name": "Triplou",
    "createdAt": "2025-11-01T10:00:00Z"
  }
}
```

#### `monster.updated`

Déclenché quand un monstre est modifié.

**Payload:**
```json
{
  "event": "monster.updated",
  "data": {
    "monsterId": "monster_123",
    "userId": "user_123",
    "changes": {
      "state": "happy",
      "level": 5
    },
    "updatedAt": "2025-11-01T10:00:00Z"
  }
}
```

## SDK & Clients

### TypeScript Client

```typescript
import { createClient } from '@/lib/api-client'

const client = createClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Récupérer les monstres
const monsters = await client.monsters.list()

// Créer un monstre
const newMonster = await client.monsters.create({
  name: 'Furly',
  draw: generatedTraits
})
```

## Variables d'Environnement

### Required

```bash
# Base de données
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_HOST=cluster.mongodb.net
MONGODB_DATABASE_NAME=your_db
MONGODB_APP_NAME=tamagotcho
MONGODB_PARAMS=?retryWrites=true&w=majority

# Authentification
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Stripe (future)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Exemples de Requêtes

### cURL

```bash
# Sign in
curl -X POST https://tamagotcho.vercel.app/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get session
curl -X GET https://tamagotcho.vercel.app/api/auth/session \
  -H "Authorization: Bearer <token>"
```

### JavaScript/Fetch

```javascript
// Sign up
const response = await fetch('/api/auth/sign-up/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePass123'
  })
})

const data = await response.json()
```

### TypeScript/Server Action

```typescript
'use server'

import { getMonsters } from '@/actions/monsters.actions'

export async function loadDashboard() {
  const monsters = await getMonsters()
  
  return {
    monsters,
    stats: {
      total: monsters.length,
      avgLevel: monsters.reduce((sum, m) => sum + m.level, 0) / monsters.length
    }
  }
}
```

## Changelog

### v0.1.0 (2025-11-02)

- ✨ Initial API release
- ✨ Better Auth integration
- ✨ Monster CRUD operations
- ✨ MongoDB connection
- 🔒 Session-based authentication

### Upcoming

- 🚀 GraphQL endpoint
- 🚀 Real-time updates (WebSockets)
- 🚀 Multi-language support
- 🚀 Advanced filtering & sorting
