import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';

// Import config first to validate environment variables
import config from './config/env.js';
import logger from './utils/logger.js';
import { connectDatabase } from './database/connection.js';
import { connectRedis } from './services/redis.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/auth.js';
import artistsRoutes from './routes/artists.js';
import songsRoutes from './routes/songs.js';
import venuesRoutes from './routes/venues.js';
import playEventsRoutes from './routes/playEvents.js';
import analyticsRoutes from './routes/analytics.js';
import batchRoutes from './routes/batch.js';
import usersRoutes from './routes/users.js';

const app = express();
const httpServer = createServer(app);
const PORT = config.port;
const API_VERSION = config.apiVersion;

// Middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// CORS configuration - support multiple origins for production
const allowedOrigins = config.frontend.url 
  ? config.frontend.url.split(',').map(url => url.trim())
  : ['http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || config.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  };

  // Check database connection
  try {
    const pool = await import('./database/connection.js');
    const client = await pool.default.connect();
    client.release();
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'degraded';
  }

  // Check Redis connection
  try {
    const redis = await import('./services/redis.js');
    const redisClient = redis.getRedisClient();
    await redisClient.ping();
    health.redis = 'connected';
  } catch (error) {
    health.redis = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// API Routes
app.use(`/api/${API_VERSION}/auth`, rateLimiter, authRoutes);
app.use(`/api/${API_VERSION}/artists`, artistsRoutes);
app.use(`/api/${API_VERSION}/songs`, songsRoutes);
app.use(`/api/${API_VERSION}/venues`, venuesRoutes);
app.use(`/api/${API_VERSION}/plays`, playEventsRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/batch`, rateLimiter, batchRoutes);
app.use(`/api/${API_VERSION}/users`, usersRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize connections and start server
async function startServer() {
  try {
    // Create logs directory if it doesn't exist (for production)
    if (config.nodeEnv === 'production') {
      const fs = await import('fs');
      const path = await import('path');
      const logsDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
    }

    await connectDatabase();
    logger.info('Database connected successfully');
    
    await connectRedis();
    logger.info('Redis connected successfully');
    
    httpServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`, { error: error.message });
        logger.error('Solutions: Check if another instance is running, kill the process, or use a different port');
        process.exit(1);
      } else {
        logger.error('Server error', { error: error.message, stack: error.stack });
        process.exit(1);
      }
    });
    
    httpServer.listen(PORT, () => {
      logger.info(`Server started successfully`, {
        port: PORT,
        environment: config.nodeEnv,
        apiVersion: API_VERSION,
        apiUrl: `http://localhost:${PORT}/api/${API_VERSION}`,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

startServer();

export default app;

