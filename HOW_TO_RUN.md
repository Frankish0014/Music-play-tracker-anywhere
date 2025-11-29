# 🚀 How to Run the Project

Quick guide to get the Rwandan Music Tracker running on your machine.

## Prerequisites

Make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ Docker Desktop running (`docker --version`)
- ✅ npm 9+ (`npm --version`)

## Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# From project root
npm install
npm run install:all
```

### Step 2: Setup Environment & Start Databases

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Create backend .env file (if it doesn't exist)
cd backend
# Create .env file with at minimum:
# JWT_SECRET=your-random-secret-key-here
# (You can use the defaults for everything else in development)
```

**Quick .env setup:**
```bash
cd backend
cat > .env << EOF
NODE_ENV=development
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=rwanda_music
POSTGRES_PASSWORD=changeme
POSTGRES_DB=rwanda_music_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
FRONTEND_URL=http://localhost:3001
EOF
cd ..
```

### Step 3: Run Database Migrations & Start Servers

**Option A: Use the automated script (Linux/Mac)**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Option B: Manual steps**

```bash
# Run migrations
cd backend
npm run migrate
cd ..

# Start both backend and frontend (from root)
npm run dev
```

This will start:
- **Backend** on http://localhost:3000
- **Frontend** on http://localhost:3001

## Access the Application

- 🌐 **Frontend:** http://localhost:3001
- 🔌 **Backend API:** http://localhost:3000/api/v1
- ❤️ **Health Check:** http://localhost:3000/health

## Running Individual Services

### Backend Only
```bash
cd backend
npm run dev
```

### Frontend Only
```bash
cd frontend
npm run dev
```

## Mobile App (Optional)

### Android
```bash
cd mobile
npm install
npm start          # Start Metro bundler
npm run android    # In another terminal
```

### iOS (Mac only)
```bash
cd mobile
npm install
cd ios && pod install && cd ..
npm start          # Start Metro bundler
npm run ios        # In another terminal
```

## Stop Everything

```bash
# Stop servers: Press Ctrl+C in terminal(s)

# Stop databases
docker-compose down

# Or keep data but stop containers
docker-compose stop
```

## Troubleshooting

### "Port 3000 already in use"
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>
```

### "Cannot connect to database"
```bash
# Check if containers are running
docker ps

# Restart containers
docker-compose restart postgres redis
```

### "Module not found"
```bash
# Reinstall dependencies
npm run install:all
```

## Verify Everything Works

1. ✅ Check health: `curl http://localhost:3000/health`
2. ✅ Open frontend: http://localhost:3001
3. ✅ Register a test account
4. ✅ Login successfully

## Next Steps

- Read `QUICK_START.md` for detailed setup
- Read `PRODUCTION.md` for production deployment
- Check `ARCHITECTURE.md` to understand the system

**That's it! You're ready to go! 🎵**

