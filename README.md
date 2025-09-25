# URL Shortener

Un service de raccourcissement d'URL moderne développé avec React/TypeScript (frontend) et NestJS/TypeScript (backend) utilisant Clean Architecture avec PostgreSQL.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v18 ou supérieur)
- Docker et Docker Compose
- npm

### Installation et lancement

#### Option 1 : Setup automatique (recommandé)

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd stoikTest

# 2. Lancer le script de setup automatique
chmod +x setup.sh
./setup.sh

# 3. Démarrer juste les apps (si DB déjà lancée)
npm run db:up && npm start:backend && npm start:frontend
```

#### Option 2 : Setup manuel

```bash
# 1. Cloner le projet
git clone <url-du-repo>
cd stoikTest

# 2. Installer les dépendances
npm install

# 3. Configurer la base de données
npm run db:up
cd backend && npm run db:generate && npm run db:push && cd ..

# 4. Démarrer l'application (avec base de données)
npm run setup
```

L'application sera accessible sur :

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **Base de données** : PostgreSQL sur le port 5432

## 📁 Structure du projet

```
stoikTest/
├── backend/                 # API NestJS/TypeScript (Clean Architecture)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── url/        # Module métier URL
│   │   │   │   ├── domain/         # Entités & Services du domaine
│   │   │   │   ├── application/    # Use Cases & DTOs
│   │   │   │   └── infrastructure/ # Repositories & Adapters
│   │   │   ├── config/     # Configuration & validation
│   │   │   ├── database/   # Prisma & Database health
│   │   │   └── health/     # Health checks
│   │   ├── common/         # Types partagés
│   │   └── main.ts         # Bootstrap NestJS
│   ├── prisma/             # Schéma de base de données
│   └── test/               # Tests d'intégration
├── frontend/               # Interface React/TypeScript
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── services/       # Services API
│   │   ├── types/          # Types TypeScript
│   │   └── utils/          # Utilitaires
├── docker-compose.yml      # Configuration PostgreSQL
└── package.json           # Scripts racine
```

## 🏗️ Architecture

### Backend (NestJS Clean Architecture)

Architecture Clean avec NestJS, SOLID principles et Domain-Driven Design :

#### Structure par Couches

- **Domain** : Entités métier pures, services du domaine, interfaces
- **Application** : Use Cases, DTOs, orchestration des opérations
- **Infrastructure** : Implémentations concrètes (DB, services externes)

#### Modules NestJS

- **UrlModule** : Gestion complète des URLs (création, redirection, stats)
- **ConfigModule** : Configuration centralisée avec validation Joi
- **DatabaseModule** : Prisma, health checks, connexion DB
- **HealthModule** : Monitoring et diagnostics

#### Principes SOLID Appliqués

- **S** - Single Responsibility : Chaque Use Case = une responsabilité
- **O** - Open/Closed : Nouvelles validations sans modifier l'existant
- **L** - Liskov Substitution : Toutes implémentations respectent leurs abstractions
- **I** - Interface Segregation : Interfaces spécialisées par domaine
- **D** - Dependency Inversion : Injection NestJS, abstractions avant implémentations

#### Injection de Dépendances NestJS

```typescript
// Use Cases avec dépendances injectées automatiquement
@Injectable()
export class CreateShortUrlUseCase {
  constructor(
    private readonly urlRepo: UrlRepository,
    private readonly slugService: SlugService,
    private readonly validator: UrlValidatorService
  ) {}
}
```

### Frontend (Architecture moderne React)

- **Composants** : Interface utilisateur modulaire
- **Hooks** : Logique réutilisable (ex: `useUrlShortener`)
- **Services** : Communication avec l'API
- **Types** : Types partagés avec le backend

## 📡 API Endpoints

### POST `/api/urls`

Créer une URL raccourcie

**Body :**

```json
{
  "originalUrl": "https://example.com/very/long/url",
  "expiresAt": "2024-12-31T23:59:59Z" // Optionnel
}
```

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "slug": "aY2Pv8",
    "originalUrl": "https://example.com/very/long/url",
    "shortUrl": "http://localhost:3000/r/aY2Pv8",
    "createdAt": "2024-09-18T10:00:00Z",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

### GET `/r/:slug`

Redirection vers l'URL originale (HTTP 301)

### GET `/api/urls/:slug/stats`

Statistiques d'une URL raccourcie

**Réponse :**

```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "slug": "aY2Pv8",
    "originalUrl": "https://example.com/very/long/url",
    "clicks": 42,
    "createdAt": "2024-09-18T10:00:00Z",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

### GET `/health`

Health check de l'application et de la base de données

**Réponse :**

```json
{
  "status": "healthy",
  "timestamp": "2024-09-18T10:00:00Z",
  "database": "connected",
  "version": "1.0.0"
}
```

## 🧪 Tests

```bash
# Lancer les tests backend
cd backend && npm test

# Lancer les tests en mode watch
cd backend && npm run test:watch
```

Tests implémentés :

- ✅ Use Cases (CreateShortUrl, RedirectUrl, GetUrlStats)
- ✅ Domain services (SlugGenerator, UrlValidator)
- ✅ Infrastructure (UrlRepository)
- ✅ Couverture : 10 tests passant

## 🛠️ Scripts disponibles

### Scripts racine

```bash
npm install        # Installer toutes les dépendances
npm run setup      # Démarrer DB + applications
npm start          # Démarrer les applications (DB séparément)
npm run db:up      # Démarrer PostgreSQL uniquement
npm run db:down    # Arrêter PostgreSQL
npm test           # Lancer les tests
```

### Scripts backend

```bash
cd backend
npm run dev        # Mode développement avec hot-reload
npm run build      # Compiler TypeScript
npm run start      # Démarrer en production
npm run db:generate # Générer le client Prisma
npm run db:push    # Pousser le schéma vers la DB
npm run db:migrate # Créer une migration
npm run db:studio  # Interface Prisma Studio
```

### Scripts frontend

```bash
cd frontend
npm run dev        # Mode développement
npm run build      # Build de production
npm run preview    # Prévisualiser le build
npm run lint       # Linter ESLint
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/url_shortener"
PORT=3000
NODE_ENV=development
BASE_URL="http://localhost:3000"
SLUG_LENGTH=6
CORS_ORIGINS="http://localhost:5173"
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### Base de données

PostgreSQL est configuré via Docker Compose. Pour utiliser une autre base :

1. Modifier `docker-compose.yml`
2. Ajuster `DATABASE_URL` dans `.env`
3. Relancer les migrations : `npm run db:migrate`

## 🚀 Déploiement en production

### Considérations pour la production

1. **Sécurité**

   - Utiliser HTTPS
   - Configurer CORS proprement
   - Validation d'entrée renforcée
   - Rate limiting

2. **Performance**

   - Cache Redis pour les URLs fréquentes
   - CDN pour les assets statiques
   - Index de base de données optimisés

3. **Monitoring**

   - Logs structurés
   - Métriques de performance
   - Health checks

4. **Scalabilité**
   - Load balancer
   - Réplication de base de données
   - Clustering Node.js

### Exemple de déploiement

```dockerfile
# Dockerfile backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY prisma ./prisma
RUN npx prisma generate
CMD ["npm", "start"]
```

## 🎯 Fonctionnalités

### Implémentées ✅

- ✅ **Architecture SOLID** : Injection de dépendances, séparation parfaite
- ✅ **Slugs ultra-fiables** : nanoid garantit l'unicité (68+ milliards de combinaisons)
- ✅ **Validation extensible** : Pattern Strategy, ajout de règles sans modification
- ✅ **Gestion d'erreurs premium** : Types d'erreurs spécialisés, logs structurés
- ✅ **Performance** : Incrémentation des clics asynchrone, pas de blocage
- ✅ **Redirection optimisée** : HTTP 301 permanent pour cache navigateur
- ✅ **URLs identiques** : Détection et réutilisation automatique
- ✅ **Dates d'expiration** : Validation intelligente (1 min à 1 an)
- ✅ **Interface moderne** : React + TypeScript + Tailwind
- ✅ **Tests complets** : 21 tests, couverture des cas limites
- ✅ **Configuration centralisée** : Variables d'environnement validées
- ✅ **Health checks avancés** : Test DB + métriques système

### Améliorations possibles 🔮

- [ ] Authentification et comptes utilisateurs
- [ ] Analytics avancées (géolocalisation, navigateurs)
- [ ] URLs personnalisées (custom slugs)
- [ ] QR codes automatiques
- [ ] API de masse (bulk shortening)
- [ ] Cache Redis
- [ ] Rate limiting
- [ ] Domaines personnalisés

## 📊 Choix techniques

### Pourquoi ces technologies ?

**Backend :**

- **NestJS + TypeScript** : Framework enterprise, architecture modulaire, injection dépendances
- **Clean Architecture** : Séparation Domain/Application/Infrastructure
- **Prisma** : ORM moderne, type-safe, migrations automatiques
- **PostgreSQL** : Robuste, ACID, excellent pour les données relationnelles
- **nanoid** : Slugs courts, URL-safe, performance optimisée

**Frontend :**

- **React + TypeScript** : Composants réutilisables, écosystème mature
- **Vite** : Build ultra-rapide, HMR instantané
- **Tailwind CSS** : Utility-first, design system cohérent
- **Lucide React** : Icônes modernes et cohérentes

### Gestion des cas limites

1. **Slugs en collision** : Génération de nouveaux slugs jusqu'à unicité
2. **URLs expirées** : Vérification automatique lors de l'accès
3. **URLs invalides** : Validation côté client et serveur
4. **Erreurs réseau** : Gestion gracieuse avec messages utilisateur
5. **Base de données indisponible** : Health checks et retry logic
