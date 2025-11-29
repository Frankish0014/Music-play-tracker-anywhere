@echo off
REM Rwandan Music Tracker - Development Startup Script (Windows)

echo 🎵 Starting Rwandan Music Tracker...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed
echo.

REM Start databases
echo 🗄️  Starting databases (PostgreSQL ^& Redis)...
docker-compose up -d postgres redis

REM Wait for databases to be ready
echo ⏳ Waiting for databases to be ready...
timeout /t 5 /nobreak >nul

REM Check if .env exists
if not exist "backend\.env" (
    echo ⚙️  Creating backend\.env from template...
    copy backend\.env.example backend\.env
    echo ⚠️  Please edit backend\.env and add your configuration!
    echo    At minimum, set JWT_SECRET to a random string
    pause
)

REM Create database if it doesn't exist
echo 🗄️  Creating database if needed...
cd backend
call npm run create-db
if errorlevel 1 (
    echo ⚠️  Database creation failed, but continuing...
)

REM Run migrations
echo 🗃️  Running database migrations...
call npm run migrate
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting development servers...
echo    Backend: http://localhost:3000
echo    Frontend: http://localhost:3001
echo.
echo Press Ctrl+C to stop all services
echo.

REM Start both servers
call npm run dev

