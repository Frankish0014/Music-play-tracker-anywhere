# Rwandan Music Tracking & Analytics System

A comprehensive system for tracking music plays across Rwanda, enabling fair compensation for artists through accurate, data-driven analytics.

## 🎯 Overview

This system tracks music plays in real-time across Rwanda using multiple detection methods:
- **Always-on background detection** on smartphones
- **DJ controller integration** for professional venues
- **Mobile app** for manual/auto logging
- **Radio & streaming service** integration

## 🏗️ Architecture

```
├── backend/          # Node.js + Express API
├── frontend/         # React web dashboards
├── mobile/           # React Native mobile app
├── shared/           # Shared types and utilities
└── infrastructure/   # Docker, K8s, deployment configs
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose (optional)

### Development Setup

```bash
# Install dependencies
npm run install:all

# Start databases
docker-compose up -d postgres redis

# Run migrations
cd backend && npm run migrate

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm start

# Start mobile (separate terminal)
cd mobile && npm start
```

## 📁 Project Structure

### Backend (`/backend`)
- **Services**: Authentication, Music Recognition, Analytics, Payments
- **Models**: Database schemas and models
- **Routes**: API endpoints
- **Middleware**: Auth, validation, error handling
- **Utils**: Helpers, fingerprinting, batch processing

### Frontend (`/frontend`)
- **Admin Dashboard**: Analytics, reporting, venue management
- **Artist Dashboard**: Performance metrics, earnings
- **Public Portal**: Search, trending, artist profiles

### Mobile (`/mobile`)
- **Android**: Background service for always-on detection
- **iOS**: MediaPlayer framework integration
- **Shared**: Common components and services

## 🔧 Core Features

- ✅ Multi-source music detection
- ✅ Real-time analytics & aggregation
- ✅ Batch processing for always-on devices
- ✅ Fraud detection & verification
- ✅ Payment distribution system
- ✅ Role-based access control
- ✅ Offline-first mobile app

## 📊 Tech Stack

**Backend**: Node.js, Express, PostgreSQL, TimescaleDB, Redis, Kafka  
**Frontend**: React, Recharts, Tailwind CSS  
**Mobile**: React Native, Expo  
**Infrastructure**: Docker, Kubernetes, AWS/GCP  
**Music Recognition**: AcoustID, Audd.io API

## 📝 License

MIT

## 🤝 Contributing

See CONTRIBUTING.md for guidelines.

