import { createClient, RedisClientType } from 'redis';
import { env } from '../config/env';

// ============================================================
// Redis Client Singleton — gracefully degrades if unavailable
// ============================================================

let redisClient: RedisClientType | null = null;
let subscriberClient: RedisClientType | null = null;
let redisUnavailable = false;

/**
 * Get or create the main Redis client (for commands, cache, publishing)
 * Throws if Redis is unavailable.
 */
export async function getRedisClient(): Promise<RedisClientType> {
  if (redisUnavailable) {
    throw new Error('Redis unavailable');
  }

  if (!redisClient) {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        connectTimeoutMs: 3000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            redisUnavailable = true;
            console.warn('[Redis] Unavailable — falling back to in-memory');
            return new Error('Redis unavailable');
          }
          return Math.min(retries * 100, 2000);
        },
      },
    });

    redisClient.on('error', () => {});

    try {
      await redisClient.connect();
    } catch {
      redisUnavailable = true;
      redisClient = null;
      throw new Error('Redis unavailable');
    }
  }

  return redisClient;
}

/**
 * Get or create a dedicated subscriber client (cannot be used for commands)
 */
export async function getSubscriberClient(): Promise<RedisClientType> {
  if (redisUnavailable) {
    throw new Error('Redis unavailable');
  }

  if (!subscriberClient) {
    subscriberClient = createClient({
      url: env.REDIS_URL,
      socket: {
        connectTimeoutMs: 3000,
        reconnectStrategy: (retries) => {
          if (retries > 3) return new Error('Redis unavailable');
          return Math.min(retries * 100, 2000);
        },
      },
    });

    subscriberClient.on('error', () => {});

    try {
      await subscriberClient.connect();
    } catch {
      subscriberClient = null;
      throw new Error('Redis unavailable');
    }
  }

  return subscriberClient;
}

/**
 * Gracefully disconnect all Redis clients
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  if (subscriberClient) {
    await subscriberClient.quit();
    subscriberClient = null;
  }
}
