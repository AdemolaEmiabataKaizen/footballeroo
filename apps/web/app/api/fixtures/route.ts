import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:4000';

/**
 * GET /api/fixtures — Today's fixtures (proxy)
 */
export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/fixtures/today`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }, // Revalidate every 5 min
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fixtures' },
      { status: 500 },
    );
  }
}
