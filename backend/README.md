# URL Shortener - Backend NestJS Enterprise 🚀

## 🏗️ Architecture Clean + NestJS

### Structure Modulaire Professional

```
src/
├── main.ts                    # 🔥 Bootstrap robuste (sécurité, rate limiting)
├── app.module.ts              # 🎯 Module racine avec DI
└── modules/
    ├── config/                # ⚙️ Configuration avec validation Joi
    │   ├── config.module.ts   # Module global @nestjs/config
    │   ├── app-config.service.ts  # Service typé
    │   └── config.validation.ts   # Schema Joi
    │
    ├── database/              # 💾 Module base de données
    │   ├── database.module.ts # Module global Prisma
    │   ├── prisma.service.ts  # Service avec lifecycle & health
    │   └── database-health.service.ts  # Monitoring DB
    │
    ├── health/                # 🩺 Health checks avancés
    │   ├── health.controller.ts    # Status complet (DB, memory)
    │   └── health.module.ts
    │
    └── url/                   # 🔗 Module métier (Clean Architecture)
        ├── domain/            # Logique métier pure
        ├── application/       # Use cases + DTOs + Tests
        ├── infrastructure/    # Implémentations (Prisma, nanoid)
        ├── url.controller.ts  # Contrôleur avec rate limiting
        └── url.module.ts      # Module encapsulé
```

## 🛡️ Sécurité & Performance

- **Helmet** : Protection XSS, CSP, HSTS
- **Rate Limiting** : @nestjs/throttler (50 créations/min, 100 stats/min)
- **CORS** : Configuration dynamique selon environnement
- **Validation** : class-validator + Joi schema strict
- **Compression** : Optimisation des réponses
- **Graceful Shutdown** : Gestion propre des signaux

## 🚀 Démarrage

### Prérequis
```bash
# Base de données PostgreSQL
docker-compose up -d  # Depuis le dossier racine

# Variables d'environnement
export DATABASE_URL="postgresql://postgres:password@localhost:5432/url_shortener"
export PORT=3002
export NODE_ENV=development
```

### Installation & Démarrage
```bash
cd backendNestJS
npm install
npm run db:push      # Sync Prisma schema
npm run build        # Build TypeScript
npm run start:dev    # Mode développement
```

### Tests
```bash
npm test            # Tests unitaires
npm run test:watch  # Mode watch
npm run lint        # ESLint
npm run format      # Prettier
```

## 📊 API Endpoints

### Health Check
```bash
GET /health
# Réponse : { status, database, memory, uptime }
```

### URL Shortening
```bash
# Créer une URL courte (rate limited: 50/min)
POST /api/urls
{
  "originalUrl": "https://example.com",
  "expiresAt": "2024-12-31T23:59:59Z"  // optionnel
}

# Redirection
GET /api/r/:slug  # Redirection 301 + compteur clicks

# Statistiques (rate limited: 100/min)
GET /api/urls/:slug/stats
```

## 🧪 Nice-to-have Implémentés

- ✅ **Dédoublonnage** : URL identiques → même slug
- ✅ **Expiration** : Dates avec validation (max 1 an)
- ✅ **Compteur clicks** : Incrémentation asynchrone
- ✅ **Tests unitaires** : 6 tests couvrant les use cases
- ✅ **Health monitoring** : DB latence + métriques système

## 🏆 SOLID Principles

- **S** : Chaque classe = 1 responsabilité
- **O** : Extensibilité via interfaces (nouveaux validators, services)
- **L** : Substitution respectée (implémentations interchangeables)
- **I** : Interfaces cohésives et spécialisées
- **D** : Dépendances injectées (IoC NestJS natif)

---

**Backend Enterprise-Grade avec NestJS + Clean Architecture ! 💪**