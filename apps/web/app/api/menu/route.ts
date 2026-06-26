import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:4000';

/**
 * GET /api/menu — Proxy to backend or serve directly
 * In production (Vercel), this proxies to the API service
 * or can be replaced with direct serverless logic
 */
export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/menu`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/menu — Generate custom dish (proxy)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/api/menu/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate dish' },
      { status: 500 },
    );
  }
}
