-- =====================================================
-- MIGRATION: Add receipt support to bookings
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Add receipt columns to bookings table
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS receipt_url TEXT,
  ADD COLUMN IF NOT EXISTS receipt_file_name TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS balance_due DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS is_walk_in BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cashier_name TEXT,
  ADD COLUMN IF NOT EXISTS room_number TEXT;

-- 2. Create public receipts storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'receipts', 'receipts', true, 10485760,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS policies for receipts bucket
CREATE POLICY "Public upload receipts"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Public read receipts"
  ON storage.objects FOR SELECT USING (bucket_id = 'receipts');

CREATE POLICY "Admin delete receipts"
  ON storage.objects FOR DELETE USING (bucket_id = 'receipts');

-- 4. Ensure media and rooms buckets exist
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, 10485760) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('rooms', 'rooms', true, 10485760) ON CONFLICT (id) DO NOTHING;
