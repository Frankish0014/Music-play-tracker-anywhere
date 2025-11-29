# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 14+ (or use Docker)
- Redis 6+ (or use Docker)

## Quick Start

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis
```

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run Database Migrations

```bash
cd backend
npm run migrate
```

### 5. Start Development Servers

```bash
# From root directory
npm run dev

# Or separately:
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## Mobile App Setup

### Android

```bash
cd mobile
npm install
npm run android
```

### iOS

```bash
cd mobile
npm install
cd ios && pod install && cd ..
npm run ios
```

## Production Deployment

### Using Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

Make sure to set all required environment variables in production:

- `JWT_SECRET`: Strong random secret
- `POSTGRES_PASSWORD`: Secure database password
- `ACOUSTID_API_KEY` or `AUDD_API_KEY`: Music recognition API key
- `AWS_*`: Cloud storage credentials (if using)

## API Endpoints

- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- API Docs: http://localhost:3000/api/v1

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `docker ps`
- Check connection string in `.env`
- Verify database exists: `psql -U rwanda_music -d rwanda_music_db`

### Redis Connection Issues

- Ensure Redis is running: `docker ps`
- Test connection: `redis-cli ping`

### Port Conflicts

- Change ports in `.env` (backend) and `vite.config.js` (frontend)

