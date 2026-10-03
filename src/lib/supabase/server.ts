import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function isUrlValid(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && !url.includes('your-supabase-url');
  } catch {
    return false;
  }
}

export async function createClient() {
  const cookieStore = await cookies();

  const url = isUrlValid(process.env.NEXT_PUBLIC_SUPABASE_URL)
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : 'https://abiavsgmbokwyxlahhyt.supabase.co';

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-supabase')
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWF2c2dtYm9rd3l4bGFoaHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMDgwODEsImV4cCI6MjEwNjU4NDA4MX0.Yb_8sO0E3ruQJl3lEXe09vomaJOmqdRlc3dT6e3offY';

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method is called from a Server Component.
          }
        },
      },
    }
  );
}

