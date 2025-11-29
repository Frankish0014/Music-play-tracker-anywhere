import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';

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

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
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
    await connectDatabase();
    console.log('✅ Database connected');
    
    await connectRedis();
    console.log('✅ Redis connected');
    
    httpServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error('');
        console.error('❌ Port 3000 is already in use!');
        console.error('');
        console.error('This usually means the server is already running.');
        console.error('');
        console.error('Solutions:');
        console.error('  1. Check if another instance is running: http://localhost:3000/health');
        console.error('  2. Kill the process using port 3000:');
        console.error('     Windows: netstat -ano | findstr :3000');
        console.error('     Then: taskkill /PID <PID> /F');
        console.error('  3. Or use a different port by setting PORT in .env');
        console.error('');
        console.error('Nodemon will automatically restart when the port becomes available.');
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api/${API_VERSION}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

