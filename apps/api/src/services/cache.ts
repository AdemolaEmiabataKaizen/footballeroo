import { getRedisClient } from './redis';

// ============================================================
// Cache Helper — Redis-backed with TTL support
// ============================================================

export interface CacheOptions {
  /** Time-to-live in seconds */
  ttl?: number;
}

const DEFAULT_TTL = 1800; // 30 minutes

/**
 * Get a cached value by key. Returns null if not found or expired.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  const value = await client.get(key);

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

/**
 * Set a value in cache with optional TTL.
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  options: CacheOptions = {},
): Promise<void> {
  const client = await getRedisClient();
  const ttl = options.ttl ?? DEFAULT_TTL;
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);

  if (ttl > 0) {
    await client.setEx(key, ttl, serialized);
  } else {
    await client.set(key, serialized);
  }
}

/**
 * Delete a cached value by key.
 */
export async function cacheDel(key: string): Promise<void> {
  const client = await getRedisClient();
  await client.del(key);
}

/**
 * Delete all keys matching a pattern (e.g. "menu:*").
 */
export async function cacheInvalidatePattern(pattern: string): Promise<number> {
  const client = await getRedisClient();
  let cursor = 0;
  let deletedCount = 0;

  do {
    const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
    cursor = result.cursor;

    if (result.keys.length > 0) {
      await client.del(result.keys);
      deletedCount += result.keys.length;
    }
  } while (cursor !== 0);

  return deletedCount;
}

/**
 * Check if a key exists in cache.
 */
export async function cacheExists(key: string): Promise<boolean> {
  const client = await getRedisClient();
  const exists = await client.exists(key);
  return exists === 1;
}

/**
 * Get remaining TTL for a key (in seconds). Returns -1 if no TTL, -2 if key doesn't exist.
 */
export async function cacheTTL(key: string): Promise<number> {
  const client = await getRedisClient();
  return client.ttl(key);
}

// ============================================================
// Cache Key Builders — consistent key naming
// ============================================================

export const CacheKeys = {
  /** Current live menu */
  liveMenu: () => 'menu:live',

  /** Menu for a specific fixture */
  fixtureMenu: (fixtureId: string) => `menu:fixture:${fixtureId}`,

  /** Today's fixtures */
  todayFixtures: () => 'fixtures:today',

  /** User's personalised recommendations */
  userRecommendations: (userId: string) => `recommendations:${userId}`,

  /** Dish by ID */
  dish: (dishId: string) => `dish:${dishId}`,

  /** Stock snapshot */
  stockSnapshot: () => 'stock:snapshot',

  /** Rate limiter */
  rateLimit: (userId: string, action: string) => `ratelimit:${userId}:${action}`,
} as const;
