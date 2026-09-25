import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

/**
 * Verify that the request is from an authenticated admin user.
 * Checks the sb-access-token cookie and validates it with Supabase.
 * Returns the user if authenticated, or null if not.
 */
export async function verifyAdminRequest(request: NextRequest | Request): Promise<{ user: any } | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  // Extract the access token from cookies
  let accessToken: string | undefined;

  if ('cookies' in request && typeof request.cookies === 'object' && 'get' in request.cookies) {
    // NextRequest
    accessToken = (request as NextRequest).cookies.get('sb-access-token')?.value;
  } else {
    // Standard Request — parse from cookie header
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/sb-access-token=([^;]+)/);
    accessToken = match?.[1];
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
