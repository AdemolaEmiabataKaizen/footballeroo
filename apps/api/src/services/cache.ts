import { getRedisClient } from './redis';

// ============================================================
// Cache Helper — Redis-backed with in-memory fallback
// ============================================================

export interface CacheOptions {
  /** Time-to-live in seconds */
  ttl?: number;
}

const DEFAULT_TTL = 1800; // 30 minutes

// In-memory fallback when Redis is unavailable
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

function memGet(key: string): string | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

function memSet(key: string, value: string, ttl: number): void {
  memoryCache.set(key, {
    value,
    expiresAt: ttl > 0 ? Date.now() + ttl * 1000 : 0,
  });
}

async function getClient() {
  try {
    return await getRedisClient();
  } catch {
    return null;
  }
}

/**
 * Get a cached value by key. Returns null if not found or expired.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getClient();

  let value: string | null = null;
  if (client) {
    try {
      value = await client.get(key);
    } catch {
      value = memGet(key);
    }
  } else {
    value = memGet(key);
  }

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
  const ttl = options.ttl ?? DEFAULT_TTL;
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);

  const client = await getClient();
  if (client) {
    try {
      if (ttl > 0) {
        await client.setEx(key, ttl, serialized);
      } else {
        await client.set(key, serialized);
      }
      return;
    } catch { /* fall through to memory */ }
  }

  memSet(key, serialized, ttl);
}

/**
 * Delete a cached value by key.
 */
export async function cacheDel(key: string): Promise<void> {
  memoryCache.delete(key);
  const client = await getClient();
  if (client) {
    try { await client.del(key); } catch {}
  }
}

/**
 * Delete all keys matching a pattern (e.g. "menu:*").
 */
export async function cacheInvalidatePattern(pattern: string): Promise<number> {
  // Memory cache: simple prefix match
  const regex = new RegExp('^' + pattern.replace('*', '.*'));
  let deleted = 0;
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) { memoryCache.delete(key); deleted++; }
  }

  const client = await getClient();
  if (client) {
    try {
      let cursor = 0;
      do {
        const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
        cursor = result.cursor;
        if (result.keys.length > 0) {
          await client.del(result.keys);
          deleted += result.keys.length;
        }
      } while (cursor !== 0);
    } catch {}
  }

  return deleted;
}

/**
 * Check if a key exists in cache.
 */
export async function cacheExists(key: string): Promise<boolean> {
  const client = await getClient();
  if (client) {
    try { return (await client.exists(key)) === 1; } catch {}
  }
  return memGet(key) !== null;
}

/**
 * Get remaining TTL for a key (in seconds). Returns -1 if no TTL, -2 if key doesn't exist.
 */
export async function cacheTTL(key: string): Promise<number> {
  const client = await getClient();
  if (client) {
    try { return await client.ttl(key); } catch {}
  }
  const entry = memoryCache.get(key);
  if (!entry) return -2;
  if (!entry.expiresAt) return -1;
  return Math.max(0, Math.round((entry.expiresAt - Date.now()) / 1000));
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
