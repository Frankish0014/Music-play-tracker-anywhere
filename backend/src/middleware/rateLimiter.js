import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from '../services/redis.js';

let limiterInstance = null;

export async function getRateLimiter() {
  if (!limiterInstance) {
    try {
      const redisClient = getRedisClient();
      limiterInstance = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl_',
        points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
        duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000, // Convert to seconds
      });
    } catch (error) {
      // Fallback to in-memory limiter if Redis not available
      console.warn('Redis not available, using in-memory rate limiter');
      const { RateLimiterMemory } = await import('rate-limiter-flexible');
      limiterInstance = new RateLimiterMemory({
        points: 100,
        duration: 900,
      });
    }
  }
  return limiterInstance;
}

async function rateLimiter(req, res, next) {
  try {
    const limiter = await getRateLimiter();
    await limiter.consume(req.ip || req.connection.remoteAddress);
    next();
  } catch (error) {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later',
      },
    });
  }
}

export default rateLimiter;

