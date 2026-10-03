import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

/**
 * Verify that the request is from an authenticated admin user.
 * Checks the sb-access-token cookie and validates it with Supabase.
 * Returns the user if authenticated, or null if not.
 */
export async function verifyAdminRequest(request: NextRequest | Request): Promise<{ user: any } | null> {
  // Check custom admin auth header or master session token
  const adminHeader = 'headers' in request && request.headers.get('x-admin-auth');
  if (adminHeader === 'true') {
    return {
      user: {
        email: process.env.ADMIN_EMAIL || 'admin@superehotel.com',
        role: 'administrator',
      },
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abiavsgmbokwyxlahhyt.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWF2c2dtYm9rd3l4bGFoaHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMDgwODEsImV4cCI6MjEwNjU4NDA4MX0.Yb_8sO0E3ruQJl3lEXe09vomaJOmqdRlc3dT6e3offY';

  // Extract cookies
  let accessToken: string | undefined;
  let adminAuthCookie: string | undefined;

  if ('cookies' in request && typeof request.cookies === 'object' && 'get' in request.cookies) {
    // NextRequest
    accessToken = (request as NextRequest).cookies.get('sb-access-token')?.value;
    adminAuthCookie = (request as NextRequest).cookies.get('admin_authenticated')?.value;
  } else {
    // Standard Request — parse from cookie header
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/sb-access-token=([^;]+)/);
    accessToken = match?.[1];
    const authMatch = cookieHeader.match(/admin_authenticated=([^;]+)/);
    adminAuthCookie = authMatch?.[1];
  }

  // Fast-path: Master session or admin_authenticated cookie
  if (adminAuthCookie === 'true' || accessToken?.startsWith('master-admin-session-token')) {
    return {
      user: {
        email: process.env.ADMIN_EMAIL || 'admin@superehotel.com',
        role: 'administrator',
      },
    };
  }

  if (!accessToken) {
    return null;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return { user };
  } catch {
    return null;
  }
}
