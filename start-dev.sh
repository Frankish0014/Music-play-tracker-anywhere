#!/bin/bash

# Rwandan Music Tracker - Development Startup Script

echo "🎵 Starting Rwandan Music Tracker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Start databases
echo "🗄️  Starting databases (PostgreSQL & Redis)..."
docker-compose up -d postgres redis

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 5

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your configuration!"
    echo "   At minimum, set JWT_SECRET to a random string"
    read -p "Press Enter to continue after editing .env..."
fi

# Run migrations
echo "🗃️  Running database migrations..."
cd backend
npm run migrate
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development servers..."
echo "   Backend: http://localhost:3000"
echo "   Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start both servers
npm run dev

