# 🚀 Quick Start Guide - Rwandan Music Tracker

## Step-by-Step Setup Instructions

### Prerequisites Checklist

Before starting, ensure you have:
- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop))
- ✅ **Git** installed
- ✅ **Code Editor** (VS Code recommended)

Verify installations:
```bash
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher
docker --version  # Should show Docker version
```

---

## 🎯 Step 1: Install Dependencies

Open a terminal in the project root directory:

```bash
# Install root dependencies
npm install

# Install all workspace dependencies (backend, frontend, mobile)
npm run install:all
```

**Expected output:** All packages should install without errors.

---

## 🗄️ Step 2: Start Database Services

Start PostgreSQL and Redis using Docker:

```bash
# Start databases in the background
docker-compose up -d postgres redis

# Verify they're running
docker ps
```

You should see `rwanda-music-postgres` and `rwanda-music-redis` containers running.

**Troubleshooting:**
- If Docker isn't running, start Docker Desktop first
- If ports 5432 or 6379 are in use, stop other services using those ports

---

## ⚙️ Step 3: Configure Backend

```bash
cd backend

# Copy environment template
cp .env.example .env
```

Now edit `backend/.env` file. At minimum, set:

```env
# Database (should match docker-compose.yml)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=rwanda_music
POSTGRES_PASSWORD=changeme
POSTGRES_DB=rwanda_music_db

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

**Optional:** Add music recognition API keys if you have them:
```env
ACOUSTID_API_KEY=your-key-here
AUDD_API_KEY=your-key-here
```

---

## 🗃️ Step 4: Run Database Migrations

Create the database tables:

```bash
# Still in backend directory
npm run migrate
```

**Expected output:**
```
✅ Database migrations completed successfully
```

**Troubleshooting:**
- If you get "connection refused", ensure Docker containers are running: `docker ps`
- If you get "password authentication failed", check your `.env` file matches docker-compose.yml

---

## 🖥️ Step 5: Start Backend Server

```bash
# Still in backend directory
npm run dev
```

**Expected output:**
```
✅ Database connected
✅ Redis connected
🚀 Server running on port 3000
📡 API available at http://localhost:3000/api/v1
```

**Keep this terminal open!** The backend needs to keep running.

---

## 🎨 Step 6: Start Frontend (New Terminal)

Open a **new terminal window** and:

```bash
cd frontend

# Install dependencies (if not done already)
npm install

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

**Keep this terminal open too!**

---

## 🌐 Step 7: Access the Application

Open your browser and navigate to:

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000/api/v1
- **Health Check:** http://localhost:3000/health

### Test the Application

1. **Register a new account:**
   - Go to http://localhost:3001/register
   - Fill in the form (email, password, name, role)
   - Click "Register"

2. **Login:**
   - Go to http://localhost:3001/login
   - Use your credentials

3. **Explore Dashboards:**
   - Dashboard: http://localhost:3001/dashboard
   - Top Songs: http://localhost:3001/top-songs
   - Public Portal: http://localhost:3001/public

---

## 📱 Step 8: Mobile App Setup (Optional)

### For Android:

```bash
# Install Android Studio and set up Android SDK
# Then:

cd mobile
npm install

# Start Metro bundler
npm start

# In another terminal, run Android app
npm run android
```

### For iOS (Mac only):

```bash
cd mobile
npm install

# Install iOS dependencies
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# In another terminal, run iOS app
npm run ios
```

**Note:** Mobile app requires:
- Android Studio (for Android)
- Xcode (for iOS, Mac only)
- React Native development environment setup

---

## 🧪 Step 9: Test API Endpoints

You can test the API using curl or Postman:

### Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "resident"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Top Songs (Public)
```bash
curl http://localhost:3000/api/v1/analytics/top-songs?period=7d
```

---

## 🛑 Stopping the Application

To stop everything:

1. **Stop Backend:** Press `Ctrl+C` in the backend terminal
2. **Stop Frontend:** Press `Ctrl+C` in the frontend terminal
3. **Stop Databases:**
   ```bash
   docker-compose down
   ```

To stop databases but keep data:
```bash
docker-compose stop
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
```bash
# Check if containers are running
docker ps

# Restart containers
docker-compose restart postgres redis

# Check logs
docker-compose logs postgres
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Find what's using the port
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000

# Kill the process or change PORT in backend/.env
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
npm run install:all

# Or individually:
cd backend && npm install
cd ../frontend && npm install
cd ../mobile && npm install
```

### Issue: Frontend can't connect to backend
**Solution:**
- Check backend is running on port 3000
- Check `FRONTEND_URL` in backend/.env
- Check CORS settings in `backend/src/server.js`

### Issue: Database migration fails
**Solution:**
```bash
# Drop and recreate database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d postgres redis
cd backend && npm run migrate
```

---

## 📊 Development Workflow

### Typical Development Session:

1. **Start databases:**
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Start backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

3. **Start frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Make changes** - Both servers auto-reload on file changes

5. **Test in browser:** http://localhost:3001

---

## 🎯 Next Steps

Once everything is running:

1. **Create test data:**
   - Register as an artist
   - Add some songs
   - Create play events

2. **Explore features:**
   - View analytics dashboards
   - Test batch upload API
   - Check fraud detection

3. **Read documentation:**
   - `ARCHITECTURE.md` - System architecture
   - `PROJECT_SUMMARY.md` - Feature overview
   - `CONTRIBUTING.md` - Development guidelines

---

## 🆘 Need Help?

- Check the logs: `docker-compose logs`
- Verify environment variables in `.env` files
- Ensure all services are running: `docker ps`
- Check network connectivity between services

---

## ✅ Success Checklist

You're all set when:
- ✅ Docker containers are running (`docker ps`)
- ✅ Backend shows "Server running on port 3000"
- ✅ Frontend shows "Local: http://localhost:3001"
- ✅ You can access http://localhost:3001 in browser
- ✅ You can register/login successfully
- ✅ API health check returns `{"status":"ok"}`

**Happy coding! 🎵**

