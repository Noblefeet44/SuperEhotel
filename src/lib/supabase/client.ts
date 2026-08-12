import { createBrowserClient } from '@supabase/ssr';

function isUrlValid(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && !url.includes('your-supabase-url');
  } catch {
    return false;
  }
}

export function createClient() {
  const url = isUrlValid(process.env.NEXT_PUBLIC_SUPABASE_URL)
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : 'https://placeholder.supabase.co';

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-supabase')
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4ODg4ODgsImV4cCI6MjA5NDQ2NDg4OH0.placeholder';

  return createBrowserClient(url, key);
}

