// ============================================================
// Shared Constants for Footballeroo
// ============================================================

export const APP_NAME = 'Footballeroo';
export const TAGLINE = 'Mood Food';

// Taste Officer thresholds
export const TASTE_SCORE = {
  REJECT_THRESHOLD: 40,
  BOLD_CHOICE_THRESHOLD: 70,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
} as const;

// Menu generation
export const MENU_CONFIG = {
  DISHES_PER_TEAM: 3,
  MIN_DISHES: 6,
  MAX_DISHES: 12,
  CACHE_TTL_SECONDS: 1800, // 30 minutes
  REFRESH_ON_MATCH_EVENT: true,
} as const;

// Stock thresholds
export const STOCK_CONFIG = {
  SURPLUS_MULTIPLIER: 1.5, // quantity > avgDailyUsage * 1.5 = surplus
  LOW_STOCK_ALERT_MINUTES: 1,
  EOD_REPORT_HOUR: 23, // 11 PM
} as const;

// Voice
export const VOICE_CONFIG = {
  MAX_RESPONSE_LATENCY_MS: 3000,
  MIN_ACCURACY_PERCENT: 90,
  CONFIRMATION_REQUIRED_INTENTS: ['add_to_cart', 'checkout'] as const,
} as const;

// Order
export const ORDER_CONFIG = {
  DELIVERY_FEE_PENCE: 350,
  FREE_DELIVERY_THRESHOLD_PENCE: 2500,
  MIN_ORDER_PENCE: 800,
} as const;

// API
export const API_CONFIG = {
  RATE_LIMIT_PER_MINUTE: 100,
  GENERATION_RATE_LIMIT_PER_MINUTE: 10,
  DEFAULT_PAGE_SIZE: 20,
} as const;

// FIFA World Cup 2026
export const FIFA_WC_2026 = {
  START_DATE: '2026-06-11',
  END_DATE: '2026-07-19',
  HOST_COUNTRIES: ['US', 'MX', 'CA'],
  TOTAL_TEAMS: 48,
} as const;
