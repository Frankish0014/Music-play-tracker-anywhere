# Production Deployment Guide

This guide covers everything you need to deploy the Rwandan Music Tracker system to production.

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured (optional but recommended)
- SSL certificate (for HTTPS)
- Production database credentials
- Strong JWT secret generated

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database (use strong passwords!)
POSTGRES_HOST=your-db-host
POSTGRES_PORT=5432
POSTGRES_USER=rwanda_music
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=rwanda_music_db

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=<strong-password>

# JWT (generate a strong random secret, at least 32 characters)
JWT_SECRET=<generate-strong-random-secret>
JWT_EXPIRES_IN=7d

# Frontend URL (comma-separated for multiple origins)
FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Music Recognition APIs (optional)
ACOUSTID_API_KEY=your-key
AUDD_API_KEY=your-key
```

### Generate JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Docker Production Deployment

### 1. Set Environment Variables

Create a `.env` file in the project root:

```env
POSTGRES_USER=rwanda_music
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=rwanda_music_db
JWT_SECRET=<your-jwt-secret>
```

### 2. Build and Start Services

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health
curl http://localhost/health
curl http://localhost:3000/health
```

### 3. Run Database Migrations

```bash
# Execute migrations inside the backend container
docker-compose -f docker-compose.prod.yml exec backend npm run migrate
```

## Mobile App Production Build

### Android

1. **Generate Release Keystore**

```bash
cd mobile/android/app
keytool -genkeypair -v -storetype PKCS12 -keystore rwanda-music-release.keystore -alias rwanda-music-key -keyalg RSA -keysize 2048 -validity 10000
```

2. **Create `gradle.properties`**

Create `mobile/android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=rwanda-music-release.keystore
MYAPP_RELEASE_KEY_ALIAS=rwanda-music-key
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

3. **Update API URL**

In `mobile/src/services/api.js`, ensure production URL is set:

```javascript
const getApiBaseUrl = () => {
  if (!__DEV__) {
    return 'https://api.yourdomain.com/api/v1'; // Update this
  }
  // ... rest of code
};
```

4. **Build Release APK**

```bash
cd mobile/android
./gradlew assembleRelease

# APK will be at: mobile/android/app/build/outputs/apk/release/app-release.apk
```

5. **Build Release AAB (for Play Store)**

```bash
cd mobile/android
./gradlew bundleRelease

# AAB will be at: mobile/android/app/build/outputs/bundle/release/app-release.aab
```

### iOS

1. **Update API URL**

In `mobile/src/services/api.js`, update production URL.

2. **Configure in Xcode**

- Open `mobile/ios/RwandaMusicTracker.xcworkspace` in Xcode
- Select your development team
- Configure signing & capabilities
- Set Bundle Identifier
- Update version and build numbers

3. **Build for Production**

```bash
cd mobile/ios
pod install
cd ..

# Build release
npx react-native run-ios --configuration Release

# Or archive in Xcode: Product > Archive
```

## Frontend Production Build

The frontend is automatically built in the Docker container. For manual build:

```bash
cd frontend
npm install
npm run build

# The dist/ folder contains the production build
```

## Security Checklist

- [ ] JWT_SECRET is strong and unique (32+ characters)
- [ ] Database passwords are strong
- [ ] Redis password is set
- [ ] CORS origins are restricted to your domains
- [ ] HTTPS is enabled (use reverse proxy like Nginx or Traefik)
- [ ] Environment variables are not committed to git
- [ ] Database backups are configured
- [ ] Rate limiting is enabled
- [ ] Security headers are configured (done in nginx.conf)
- [ ] Android release keystore is secured
- [ ] iOS certificates are properly managed

## Monitoring

### Health Checks

- Backend: `http://your-api-domain:3000/health`
- Frontend: `http://your-domain/health`

### Logs

```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

## Scaling

For production scaling, consider:

1. **Load Balancer**: Use Nginx or Traefik in front of multiple backend instances
2. **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
3. **Redis**: Use managed Redis (AWS ElastiCache, Redis Cloud)
4. **CDN**: Use Cloudflare or AWS CloudFront for frontend assets
5. **Monitoring**: Set up Datadog, New Relic, or similar
6. **Error Tracking**: Integrate Sentry for error monitoring

## Backup Strategy

1. **Database Backups**

```bash
# Manual backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U rwanda_music rwanda_music_db > backup.sql

# Restore
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U rwanda_music rwanda_music_db < backup.sql
```

2. **Automated Backups**: Set up cron jobs or use managed database services with automatic backups

## Troubleshooting

### Backend won't start

- Check environment variables are set correctly
- Verify database is accessible
- Check logs: `docker-compose -f docker-compose.prod.yml logs backend`

### Database connection errors

- Verify POSTGRES_* environment variables
- Check database is running: `docker-compose -f docker-compose.prod.yml ps`
- Test connection manually

### CORS errors

- Verify FRONTEND_URL includes your actual domain
- Check CORS configuration in `backend/src/server.js`

### Mobile app can't connect

- Verify API URL is correct in `mobile/src/services/api.js`
- Check backend is accessible from mobile device
- Verify CORS allows mobile app requests

