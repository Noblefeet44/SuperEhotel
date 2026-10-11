-- ====================================================================
-- SUPER E LUXURY HOTEL & SUITES — RESEND EMAIL & FORMS SCHEMA
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query -> Run)
-- ====================================================================

-- 1. ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 2. EMAIL NOTIFICATION LOGS TABLE
-- Tracks every email dispatched via Resend for auditing and delivery verification
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  template_type TEXT NOT NULL, -- 'booking_received', 'booking_confirmed', 'check_in_welcome', 'check_out_thanks', 'booking_cancelled', 'hall_inquiry', 'hall_confirmed', 'dining_order', 'contact_acknowledgement', 'admin_alert'
  subject TEXT NOT NULL,
  reference_number TEXT,
  resend_id TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'delivered', 'bounced')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_ref ON public.email_logs(reference_number);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON public.email_logs(template_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON public.email_logs(created_at DESC);

-- ====================================================================
-- 3. CONTACT MESSAGES TABLE
-- Stores inquiries submitted through /contact
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);

-- ====================================================================
-- 4. HALL BOOKINGS / BANQUET RESERVATIONS TABLE
-- Stores inquiries submitted through /hall
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.hall_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE,
  organizer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  time_slot TEXT NOT NULL DEFAULT 'Full Day (8 AM - 10 PM)',
  expected_guests INT DEFAULT 100,
  package_name TEXT NOT NULL DEFAULT 'Royal Banquet Hall',
  package_price DECIMAL(12, 2) NOT NULL DEFAULT 350000,
  add_ons JSONB DEFAULT '[]'::jsonb,
  special_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hall_bookings_date ON public.hall_bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_hall_bookings_ref ON public.hall_bookings(reference_number);

-- ====================================================================
-- 5. RESTAURANT ORDERS TABLE
-- Stores dining and room service orders submitted through /restaurant
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.restaurant_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  order_type TEXT NOT NULL DEFAULT 'room-service', -- 'room-service', 'table-reservation', 'takeaway'
  location_details TEXT, -- Room number or Table number
  serving_time TEXT DEFAULT 'ASAP',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  special_notes TEXT,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_restaurant_orders_ref ON public.restaurant_orders(reference_number);
CREATE INDEX IF NOT EXISTS idx_restaurant_orders_created ON public.restaurant_orders(created_at DESC);

-- ====================================================================
-- 6. ENSURE BOOKINGS TABLE HAS EMAIL NOTIFICATION AUDIT COLUMNS
-- ====================================================================
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS received_email_sent_at TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS checkout_email_sent_at TIMESTAMPTZ;

-- ====================================================================
-- 7. GRANT FULL PERMISSIONS (PREVENTS PERMISSION DENIED 42501 ERRORS)
-- ====================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- ====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_orders ENABLE ROW LEVEL SECURITY;

-- Allow insert & select across public client & admin service role
DROP POLICY IF EXISTS "Public and service insert email_logs" ON public.email_logs;
CREATE POLICY "Public and service insert email_logs" ON public.email_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public and service insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public and service insert contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public and service insert hall_bookings" ON public.hall_bookings;
CREATE POLICY "Public and service insert hall_bookings" ON public.hall_bookings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public and service insert restaurant_orders" ON public.restaurant_orders;
CREATE POLICY "Public and service insert restaurant_orders" ON public.restaurant_orders FOR ALL USING (true) WITH CHECK (true);

-- Done!
SELECT 'Supabase Resend emails & forms schema successfully applied!' AS status;
