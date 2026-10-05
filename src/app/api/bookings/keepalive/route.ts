import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

export async function GET() {
  const startTime = Date.now();
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json({
      status: 'error',
      message: 'Supabase credentials not configured in environment',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }

  try {
    // 1. Ping rooms table to keep database connection and compute active
    const { count: roomsCount, error: roomsErr } = await supabase
      .from('rooms')
      .select('id', { count: 'exact', head: true });

    // 2. Ping bookings table
    const { count: bookingsCount, error: bookingsErr } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true });

    const latencyMs = Date.now() - startTime;

    if (roomsErr && bookingsErr) {
      return NextResponse.json({
        status: 'degraded',
        error: roomsErr.message || bookingsErr.message,
        latencyMs,
        timestamp: new Date().toISOString(),
      }, { status: 502 });
    }

    return NextResponse.json({
      status: 'healthy',
      supabase: 'active',
      keepAlive: true,
      latencyMs,
      inventory: {
        roomsActive: roomsCount ?? 'ok',
        bookingsActive: bookingsCount ?? 0,
      },
      timestamp: new Date().toISOString(),
      message: 'Supabase kept 24/7 active successfully. Project will not be paused.',
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error?.message || 'Failed to ping Supabase',
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}

export async function HEAD() {
  return GET();
}
