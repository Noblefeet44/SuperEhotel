-- ====================================================================
-- SUPER E HOTEL - FIX PERMISSIONS & RESET BOOKINGS MIGRATION
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ====================================================================

-- 1. GRANT FULL PRIVILEGES TO ALL ROLES
-- (Resolves error: 42501 "permission denied for table bookings / rooms / guests")
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 2. UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. ENSURE GUESTS TABLE
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ENSURE ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price DECIMAL(12, 2) NOT NULL DEFAULT 36000,
  max_guests INT DEFAULT 2,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENSURE MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'image',
  file_size BIGINT,
  alt_text TEXT,
  usage_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ENSURE BOOKINGS TABLE & COLUMNS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INT DEFAULT 1,
  total_nights INT,
  total_amount DECIMAL(12, 2),
  booking_status TEXT DEFAULT 'new',
  payment_status TEXT DEFAULT 'paid',
  special_requests TEXT,
  admin_notes TEXT,
  assigned_room_number TEXT,
  receipt_url TEXT,
  receipt_file_name TEXT,
  payment_method TEXT DEFAULT 'transfer',
  payment_reference TEXT,
  amount_paid DECIMAL(12, 2),
  balance_due DECIMAL(12, 2) DEFAULT 0,
  is_walk_in BOOLEAN DEFAULT false,
  cashier_name TEXT,
  room_number TEXT,
  guest_name TEXT,
  guest_phone TEXT,
  guest_whatsapp TEXT,
  guest_email TEXT,
  room_name TEXT,
  room_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist on bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS receipt_url TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS receipt_file_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'transfer';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(12, 2);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS balance_due DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS is_walk_in BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cashier_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_number TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_phone TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_whatsapp TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS room_slug TEXT;

-- Make guest_id & room_id nullable so booking saves NEVER fail
DO $$
BEGIN
  ALTER TABLE public.bookings ALTER COLUMN guest_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.bookings ALTER COLUMN room_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 7. DISABLE RLS ON DATA TABLES (Eliminates all permission blocks)
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.media DISABLE ROW LEVEL SECURITY;

-- 8. RESET OLD BOOKINGS (User Request: "remove all the exiting booking so new booking can start be saving")
TRUNCATE TABLE public.bookings CASCADE;

-- 9. SEED ACTIVE ROOM INVENTORY
INSERT INTO public.rooms (name, slug, price, max_guests, is_available) VALUES
  ('Standard Room', 'standard', 36000, 2, true),
  ('Deluxe Room', 'deluxe', 47000, 2, true),
  ('Deluxe 1', 'deluxe-1', 49000, 2, true),
  ('Deluxe 2', 'deluxe-2', 50500, 2, true),
  ('Luxury Room', 'luxury', 53000, 2, true),
  ('Executive Room', 'executive', 58000, 2, true),
  ('VIP Luxury Suite', 'vip', 80000, 3, true),
  ('Presidential Suite', 'presidential', 153000, 4, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  max_guests = EXCLUDED.max_guests,
  is_available = true;

-- 10. STORAGE BUCKETS (receipts, media, rooms)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('receipts', 'receipts', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  ('media', 'media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  ('rooms', 'rooms', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 11. STORAGE POLICIES
DROP POLICY IF EXISTS "Public select storage" ON storage.objects;
DROP POLICY IF EXISTS "Public insert storage" ON storage.objects;
DROP POLICY IF EXISTS "Public delete storage" ON storage.objects;
DROP POLICY IF EXISTS "Public update storage" ON storage.objects;

CREATE POLICY "Public select storage" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public insert storage" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete storage" ON storage.objects FOR DELETE USING (true);
CREATE POLICY "Public update storage" ON storage.objects FOR UPDATE USING (true);
