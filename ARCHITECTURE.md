# System Architecture

## Overview

The Rwandan Music Tracking System is a comprehensive platform for tracking music plays across Rwanda, enabling fair compensation for artists through accurate, data-driven analytics.

## Architecture Layers

### 1. Detection Layer
- **Always-on Background Detection**: Smartphone apps continuously listen and identify music
- **DJ Controller Integration**: Direct integration with professional DJ software
- **Manual Logging**: Mobile app for venues/DJs to manually log plays
- **Radio/Streaming Integration**: API integrations with radio stations and streaming services

### 2. Data Ingestion Layer
- **Batch Processing**: Efficient batch uploads from mobile devices
- **Real-time Events**: Direct API submissions for DJ controllers
- **Kafka/Message Queue**: (Optional) For high-volume event streaming

### 3. Backend Services
- **Authentication Service**: User management, JWT tokens
- **Music Recognition Service**: AcoustID/Audd.io integration
- **Analytics Engine**: Real-time aggregation and statistics
- **Fraud Detection Service**: Behavioral analysis, anomaly detection
- **Payment Distribution Service**: Royalty calculations and payments

### 4. Data Storage
- **PostgreSQL + TimescaleDB**: Core data and time-series play events
- **Redis**: Caching, real-time statistics, session management
- **S3/Cloud Storage**: Audio samples, reports, exports

### 5. Frontend Applications
- **Admin Dashboard**: System management, reporting
- **Artist Dashboard**: Performance metrics, earnings
- **Public Portal**: Search, trending, artist profiles
- **Mobile App**: Background detection, manual logging

## Data Flow

```
Mobile Device (Background Service)
  ↓ (Batch upload every 1-6 hours)
Backend API (/api/v1/batch/plays)
  ↓
Play Event Service
  ↓
Fraud Detection
  ↓
PostgreSQL (TimescaleDB)
  ↓
Analytics Engine
  ↓
Redis Cache
  ↓
Frontend Dashboards
```

## Key Components

### Backend Services

- **playEventService.js**: Core play event creation and batch processing
- **fraudDetectionService.js**: Anomaly detection, reputation scoring
- **musicRecognitionService.js**: AcoustID/Audd.io API integration
- **deviceService.js**: Device registration and reputation management
- **analyticsService.js**: Aggregation and statistics

### Database Schema

- **users**: User accounts (artists, DJs, venues, admins)
- **artists**: Artist profiles
- **songs**: Song catalog with fingerprints
- **venues**: Venue locations and information
- **play_events**: Time-series hypertable for all play events
- **devices**: Device registry for fraud prevention
- **fraud_flags**: Fraud detection records
- **payment_records**: Royalty payment history

### Security

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting
- Device fingerprinting
- Fraud detection algorithms
- Data encryption at rest and in transit

## Scalability

- **Horizontal Scaling**: Stateless backend services
- **Database**: TimescaleDB for time-series optimization
- **Caching**: Redis for frequently accessed data
- **Batch Processing**: Efficient handling of bulk uploads
- **CDN**: CloudFront/Cloudflare for static assets

## Monitoring

- Error tracking (Sentry)
- Performance monitoring (Datadog/CloudWatch)
- Log aggregation (ELK Stack)
- Health checks and alerts

