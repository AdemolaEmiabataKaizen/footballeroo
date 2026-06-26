import { createClient, RedisClientType } from 'redis';
import { env } from '../config/env';

// ============================================================
// Redis Client Singleton
// ============================================================

let redisClient: RedisClientType | null = null;
let subscriberClient: RedisClientType | null = null;

/**
 * Get or create the main Redis client (for commands, cache, publishing)
 */
export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('[Redis] Max reconnect attempts reached');
            return new Error('Max reconnect attempts reached');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err) => {
      console.error('[Redis] Client error:', err.message);
    });

    redisClient.on('connect', () => {
      console.warn('[Redis] Connected');
    });

    redisClient.on('reconnecting', () => {
      console.warn('[Redis] Reconnecting...');
    });

    await redisClient.connect();
  }

  return redisClient;
}

/**
 * Get or create a dedicated subscriber client (cannot be used for commands)
 */
export async function getSubscriberClient(): Promise<RedisClientType> {
  if (!subscriberClient) {
    subscriberClient = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error('Max reconnect attempts reached');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    subscriberClient.on('error', (err) => {
      console.error('[Redis:Subscriber] Error:', err.message);
    });

    await subscriberClient.connect();
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
  console.warn('[Redis] Disconnected');
}
