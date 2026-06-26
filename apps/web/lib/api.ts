// ============================================================
// API Client — Fetches data from Footballeroo backend
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const json = await res.json();
    return json as ApiResponse<T>;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

// --- Menu ---

export async function fetchMenu() {
  return fetchApi<{
    dishes: Dish[];
    context: MenuContext;
    generatedAt: string;
    dishCount: number;
  }>('/api/menu');
}

export async function refreshMenu() {
  return fetchApi<{
    dishes: Dish[];
    context: MenuContext;
    generatedAt: string;
  }>('/api/menu/refresh', { method: 'POST' });
}

export async function generateCustomDish(description: string, dietary?: string[]) {
  return fetchApi<Dish>('/api/menu/generate', {
    method: 'POST',
    body: JSON.stringify({ description, dietary }),
  });
}

// --- Fixtures ---

export async function fetchTodayFixtures() {
  return fetchApi<{
    fixtures: Fixture[];
    cuisineTags: string[];
    signatureDishes: { team: string; dishes: string[] }[];
    mood: string;
    matchCount: number;
  }>('/api/fixtures/today');
}

export async function fetchLiveMatches() {
  return fetchApi<{
    live: LiveMatch[];
    all: LiveMatch[];
    mood: string;
  }>('/api/fixtures/live');
}

// --- Types (client-side) ---

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: { name: string; quantity: number; unit: string }[];
  cuisine: string;
  mood: string;
  tags: string[];
  prepTime: number;
  price: number;
  imageUrl?: string;
  tasteScore: number;
  createdAt: string;
}

export interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  status: 'scheduled' | 'live' | 'finished';
  score?: { home: number; away: number };
  kickoff: string;
  competition: string;
  venue?: string;
}

export interface Team {
  id: string;
  name: string;
  country: string;
  cuisineTags: string[];
}

export interface LiveMatch {
  fixtureId: string;
  state: string;
  homeScore: number;
  awayScore: number;
  startedAt?: string;
  endedAt?: string;
  minute?: number;
}

export interface MenuContext {
  fixtures: string;
  cuisines: string[];
  mood: string;
  dishesGenerated: number;
  dishesApproved: number;
  dishesRejected: number;
}
