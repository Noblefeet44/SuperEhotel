import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const masterEmail = (process.env.ADMIN_EMAIL || 'admin@superehotel.com').toLowerCase().trim();
    const masterPassword = (process.env.ADMIN_PASSWORD || 'SuperE2026').trim();
    const inputEmail = email.toLowerCase().trim();
    const inputPassword = password.trim();

    let authenticatedUser: { email: string; role: string } | null = null;
    let accessToken = '';
    let refreshToken = '';
    let expiresIn = 60 * 60 * 24 * 7;

    // 1. Try Supabase Auth
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputEmail,
          password: inputPassword,
        });

        if (!error && data?.session) {
          authenticatedUser = {
            email: data.user.email || inputEmail,
            role: 'administrator',
          };
          accessToken = data.session.access_token;
          refreshToken = data.session.refresh_token;
          expiresIn = data.session.expires_in || expiresIn;
        }
      } catch (authErr) {
        console.warn('Supabase auth attempt error:', authErr);
      }
    }

    // 2. Master Credentials check (if Supabase Auth did not match or is unavailable)
    if (!authenticatedUser && inputEmail === masterEmail && inputPassword === masterPassword) {
      authenticatedUser = {
        email: masterEmail,
        role: 'administrator',
      };
      accessToken = 'master-admin-session-token-' + Date.now();
      refreshToken = 'master-admin-refresh-token-' + Date.now();
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // Set the auth tokens as cookies
    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      user: authenticatedUser,
    });

    // Store the access token in a cookie
    response.cookies.set('sb-access-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn,
    });

    if (refreshToken) {
      response.cookies.set('sb-refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Non-httpOnly flag for client-side auth status check only (no secrets)
    response.cookies.set('admin_authenticated', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn,
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const accessToken = request.headers.get('cookie')?.match(/sb-access-token=([^;]+)/)?.[1];
      if (accessToken) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: `Bearer ${accessToken}` } }
        });
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Supabase signout warning:', err);
    }
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.set('sb-access-token', '', { path: '/', maxAge: 0 });
  response.cookies.set('sb-refresh-token', '', { path: '/', maxAge: 0 });
  response.cookies.set('admin_authenticated', '', { path: '/', maxAge: 0 });
  response.cookies.set('admin_session', '', { path: '/', maxAge: 0 });

  return response;
}
