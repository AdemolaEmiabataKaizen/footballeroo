// ============================================================
// Core Domain Types for Footballeroo
// ============================================================

// --- Football ---

export type MatchStatus = 'scheduled' | 'live' | 'finished';
export type MoodType = 'celebration' | 'comfort' | 'fusion' | 'neutral';

export interface Team {
  id: string;
  name: string;
  country: string; // ISO 3166-1 alpha-2
  cuisineTags: string[];
}

export interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  status: MatchStatus;
  score?: { home: number; away: number };
  kickoff: string; // ISO datetime
  competition: string;
  venue?: string;
}

// --- Dishes & Menu ---

export type TasteScore = number; // 0-100

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  cuisine: string;
  mood: MoodType;
  tags: string[];
  prepTime: number; // minutes
  price: number; // in pence
  imageUrl?: string;
  tasteScore: TasteScore;
  fixtureId?: string; // which match inspired this dish
  createdAt: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  isOptional?: boolean;
}

export interface Menu {
  id: string;
  dishes: Dish[];
  fixtures: Fixture[];
  mood: MoodType;
  generatedAt: string;
  expiresAt: string;
}

// --- Users ---

export type DietaryRestriction =
  | 'vegan'
  | 'vegetarian'
  | 'pescatarian'
  | 'halal'
  | 'kosher'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  dietary: DietaryRestriction[];
  favouriteTeams: string[]; // team IDs
  cuisinePreferences: string[];
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Work"
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  isDefault: boolean;
}

// --- Orders ---

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  price: number; // unit price in pence
  customisations?: string[];
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number; // in pence
  deliveryFee: number;
  status: OrderStatus;
  deliveryAddress: Address;
  estimatedDelivery?: string; // ISO datetime
  createdAt: string;
  updatedAt: string;
}

// --- Stock ---

export type StockStatus = 'surplus' | 'adequate' | 'low' | 'out';
export type StockUnit = 'kg' | 'litres' | 'units' | 'portions';

export interface StockItem {
  id: string;
  ingredient: string;
  quantity: number;
  unit: StockUnit;
  threshold: number;
  avgDailyUsage: number;
  status: StockStatus;
  lastUpdated: string;
}

// --- Events ---

export type EventType =
  | 'match.scheduled'
  | 'match.started'
  | 'match.goal'
  | 'match.ended'
  | 'match.result'
  | 'stock.low'
  | 'stock.updated'
  | 'menu.updated'
  | 'order.placed'
  | 'order.status_changed';

export interface AppEvent<T = unknown> {
  type: EventType;
  payload: T;
  timestamp: string;
}

// --- Voice ---

export type VoiceIntent =
  | 'browse_menu'
  | 'ask_about_dish'
  | 'recommend'
  | 'add_to_cart'
  | 'customise_dish'
  | 'checkout'
  | 'unknown';

export interface VoiceCommand {
  transcript: string;
  intent: VoiceIntent;
  entities: Record<string, string>;
  confidence: number;
}

// --- API Responses ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
