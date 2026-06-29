import { getRedisClient, getSubscriberClient } from './redis';
import type { AppEvent, EventType } from '@footballeroo/shared';

// ============================================================
// Event Bus — In-process with optional Redis Pub/Sub
// ============================================================

const CHANNEL_PREFIX = 'footballeroo:events';

type EventHandler<T = unknown> = (event: AppEvent<T>) => void | Promise<void>;

// Registry of handlers per event type
const handlers = new Map<EventType, Set<EventHandler>>();
let redisAvailable: boolean | null = null;

async function tryRedis() {
  if (redisAvailable === false) return null;
  try {
    const client = await getRedisClient();
    redisAvailable = true;
    return client;
  } catch {
    redisAvailable = false;
    return null;
  }
}

/**
 * Publish an event to the event bus.
 * Falls back to in-process dispatch if Redis is unavailable.
 */
export async function publishEvent<T>(
  type: EventType,
  payload: T,
): Promise<void> {
  const event: AppEvent<T> = {
    type,
    payload,
    timestamp: new Date().toISOString(),
  };

  const client = await tryRedis();
  if (client) {
    const channel = `${CHANNEL_PREFIX}:${type}`;
    await client.publish(channel, JSON.stringify(event));
  } else {
    // In-process dispatch
    const typeHandlers = handlers.get(type);
    if (typeHandlers) {
      for (const h of typeHandlers) {
        Promise.resolve(h(event as AppEvent<unknown>)).catch((err) => {
          console.error(`[EventBus] Handler error for ${type}:`, err);
        });
      }
    }
  }
}

/**
 * Subscribe to a specific event type.
 */
export async function subscribeEvent<T>(
  type: EventType,
  handler: EventHandler<T>,
): Promise<void> {
  if (!handlers.has(type)) {
    handlers.set(type, new Set());

    // Try Redis subscription
    try {
      const subscriber = await getSubscriberClient();
      const channel = `${CHANNEL_PREFIX}:${type}`;

      await subscriber.subscribe(channel, (message) => {
        try {
          const event = JSON.parse(message) as AppEvent<T>;
          const typeHandlers = handlers.get(type);
          if (typeHandlers) {
            for (const h of typeHandlers) {
              Promise.resolve(h(event as AppEvent<unknown>)).catch((err) => {
                console.error(`[EventBus] Handler error for ${type}:`, err);
              });
            }
          }
        } catch (err) {
          console.error(`[EventBus] Failed to parse event on ${channel}:`, err);
        }
      });
    } catch {
      // Redis unavailable — in-process dispatch will handle it via publishEvent
    }
  }

  handlers.get(type)!.add(handler as EventHandler);
}

/**
 * Unsubscribe a handler from an event type.
 */
export function unsubscribeEvent<T>(
  type: EventType,
  handler: EventHandler<T>,
): void {
  const typeHandlers = handlers.get(type);
  if (typeHandlers) {
    typeHandlers.delete(handler as EventHandler);
  }
}

/**
 * Subscribe to all events (wildcard) — useful for logging/debugging.
 */
export async function subscribeAll(
  handler: EventHandler,
): Promise<void> {
  try {
    const subscriber = await getSubscriberClient();
    const pattern = `${CHANNEL_PREFIX}:*`;

    await subscriber.pSubscribe(pattern, (message, channel) => {
      try {
        const event = JSON.parse(message) as AppEvent;
        Promise.resolve(handler(event)).catch((err) => {
          console.error(`[EventBus] Wildcard handler error on ${channel}:`, err);
        });
      } catch (err) {
        console.error(`[EventBus] Failed to parse wildcard event:`, err);
      }
    });
  } catch {
    // Redis unavailable — wildcard subscriptions won't work without Redis
    console.warn('[EventBus] Redis unavailable — wildcard subscription disabled');
  }
}
