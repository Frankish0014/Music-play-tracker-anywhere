import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = {
  development: ['JWT_SECRET'],
  production: ['JWT_SECRET', 'POSTGRES_PASSWORD', 'POSTGRES_HOST', 'POSTGRES_DB', 'POSTGRES_USER'],
};

const nodeEnv = process.env.NODE_ENV || 'development';
const required = requiredEnvVars[nodeEnv] || requiredEnvVars.development;

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  if (nodeEnv === 'production') {
    console.error('\n⚠️  Production requires all environment variables to be set!');
    process.exit(1);
  } else {
    console.warn('\n⚠️  Some environment variables are missing. Using defaults.');
  }
}

// Validate JWT_SECRET strength in production
if (nodeEnv === 'production' && process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long in production!');
    process.exit(1);
  }
  if (process.env.JWT_SECRET === 'your-super-secret-key-change-this-in-production') {
    console.error('❌ JWT_SECRET must be changed from default value in production!');
    process.exit(1);
  }
}

export const config = {
  nodeEnv,
  port: parseInt(process.env.PORT || '3000', 10),
  apiVersion: process.env.API_VERSION || 'v1',
  
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'rwanda_music',
    password: process.env.POSTGRES_PASSWORD || 'changeme',
    database: process.env.POSTGRES_DB || 'rwanda_music_db',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3001',
  },
  
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  },
  
  musicRecognition: {
    acoustidApiKey: process.env.ACOUSTID_API_KEY || '',
    auddApiKey: process.env.AUDD_API_KEY || '',
  },
};

export default config;

