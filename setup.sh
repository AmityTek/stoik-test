#!/bin/bash

echo "🚀 Configuration du projet URL Shortener..."

# Vérification des prérequis
command -v node >/dev/null 2>&1 || { echo "❌ Node.js requis mais non installé. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker requis mais non installé. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose requis mais non installé. Aborting." >&2; exit 1; }

echo "✅ Prérequis vérifiés"

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Création du fichier .env pour le backend
if [ ! -f backend/.env ]; then
    echo "📝 Création du fichier .env..."
    cat > backend/.env << EOF
DATABASE_URL="postgresql://postgres:password@localhost:5432/url_shortener"
PORT=3000
NODE_ENV=development
BASE_URL="http://localhost:3000"
SLUG_LENGTH=6
CORS_ORIGINS="http://localhost:5173"
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
EOF
    echo "✅ Fichier .env créé"
else
    echo "ℹ️  Fichier .env déjà existant"
fi

# Démarrage de PostgreSQL
echo "🐘 Démarrage de PostgreSQL..."
docker-compose up -d

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL..."
sleep 5

# Génération du client Prisma et push du schéma
echo "🗄️  Configuration de la base de données..."
cd backend
npm run db:generate
npm run db:push
cd ..

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "Pour démarrer l'application :"
echo "  npm start:backend && npm start:frontend"
echo ""
echo "URLs disponibles :"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo ""
echo "Pour arrêter PostgreSQL :"
echo "  npm run db:down"
