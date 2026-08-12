-- =====================================================
-- SUPER E LUXURY HOTEL & SUITES — Database Schema
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. HOTEL SETTINGS
-- =====================================================
CREATE TABLE hotel_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_name TEXT NOT NULL DEFAULT 'SUPER E LUXURY HOTEL & SUITES',
  tagline TEXT DEFAULT 'Luxury at Its Peak',
  description TEXT DEFAULT 'Experience unparalleled luxury and comfort at Super E Luxury Hotel & Suites, Keffi, Nigeria.',
  phone TEXT DEFAULT '09131964939',
  whatsapp TEXT DEFAULT '09131964939',
  email TEXT DEFAULT '',
  address TEXT DEFAULT 'Keffi, Nasarawa State, Nigeria',
  city TEXT DEFAULT 'Keffi',
  state TEXT DEFAULT 'Nasarawa',
  country TEXT DEFAULT 'Nigeria',
  map_embed_url TEXT DEFAULT '',
  map_latitude DECIMAL(10, 8),
  map_longitude DECIMAL(11, 8),
  currency_symbol TEXT DEFAULT '₦',
  currency_code TEXT DEFAULT 'NGN',
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO hotel_settings (id) VALUES (uuid_generate_v4());

-- =====================================================
-- 2. ROOM CATEGORIES
-- =====================================================
CREATE TABLE room_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default categories
INSERT INTO room_categories (name, slug, description, display_order) VALUES
  ('Standard Room', 'standard', 'Comfortable and well-appointed rooms perfect for a pleasant stay.', 1),
  ('Deluxe Room', 'deluxe', 'Spacious rooms with premium amenities for an elevated experience.', 2),
  ('Executive Room', 'executive', 'Sophisticated rooms designed for the discerning business traveler.', 3),
  ('VIP / Luxury Suite', 'vip-luxury-suite', 'Our finest accommodation with unparalleled luxury and space.', 4);

-- =====================================================
-- 3. ROOMS
-- =====================================================
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_per_night DECIMAL(12, 2) NOT NULL,
  max_guests INT DEFAULT 2,
  bed_type TEXT DEFAULT 'Queen',
  room_size TEXT,
  facilities JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'occupied', 'maintenance')),
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default rooms
INSERT INTO rooms (category_id, name, slug, description, price_per_night, max_guests, bed_type, room_size, facilities, is_featured, display_order) VALUES
  (
    (SELECT id FROM room_categories WHERE slug = 'standard'),
    'Standard Room',
    'standard-room',
    'Our Standard Room offers a comfortable retreat with all essential amenities. Perfect for solo travelers or couples seeking a pleasant stay in Keffi.',
    25000,
    2,
    'Queen',
    '25 sqm',
    '["Air Conditioning", "Flat Screen TV", "Wi-Fi", "Hot Water", "Wardrobe", "Desk"]'::jsonb,
    true,
    1
  ),
  (
    (SELECT id FROM room_categories WHERE slug = 'deluxe'),
    'Deluxe Room',
    'deluxe-room',
    'Step up to our Deluxe Room for a more spacious and refined experience. Featuring premium furnishings and enhanced amenities for a truly comfortable stay.',
    40000,
    2,
    'King',
    '35 sqm',
    '["Air Conditioning", "Flat Screen TV", "Wi-Fi", "Hot Water", "Mini Fridge", "Wardrobe", "Sitting Area", "Desk"]'::jsonb,
    true,
    2
  ),
  (
    (SELECT id FROM room_categories WHERE slug = 'executive'),
    'Executive Room',
    'executive-room',
    'Our Executive Room is designed for guests who demand excellence. Enjoy a sophisticated space with premium amenities and a dedicated work area.',
    60000,
    2,
    'King',
    '45 sqm',
    '["Air Conditioning", "Flat Screen TV", "Wi-Fi", "Hot Water", "Mini Bar", "Refrigerator", "Sitting Area", "Executive Desk", "Bathrobe", "Complimentary Toiletries"]'::jsonb,
    true,
    3
  ),
  (
    (SELECT id FROM room_categories WHERE slug = 'vip-luxury-suite'),
    'VIP Luxury Suite',
    'vip-luxury-suite',
    'The pinnacle of luxury at Super E Hotel. Our VIP Suite offers an expansive living space, premium furnishings, and exclusive amenities for an unforgettable experience.',
    100000,
    4,
    'King (Premium)',
    '70 sqm',
    '["Air Conditioning", "Smart TV", "High-Speed Wi-Fi", "Hot Water", "Full Mini Bar", "Refrigerator", "Living Room", "Dining Area", "Executive Desk", "Premium Bathroom", "Bathrobe & Slippers", "Complimentary Toiletries", "Room Service Priority"]'::jsonb,
    true,
    4
  );

-- =====================================================
-- 4. GUESTS
-- =====================================================
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. BOOKINGS
-- =====================================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INT DEFAULT 1,
  total_nights INT GENERATED ALWAYS AS (check_out_date - check_in_date) STORED,
  total_amount DECIMAL(12, 2),
  booking_status TEXT DEFAULT 'new' CHECK (booking_status IN ('new', 'awaiting_confirmation', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
  payment_status TEXT DEFAULT 'not_paid' CHECK (payment_status IN ('not_paid', 'awaiting_payment', 'partially_paid', 'paid', 'refunded')),
  special_requests TEXT,
  admin_notes TEXT,
  assigned_room_number TEXT,
  cancelled_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. MENU CATEGORIES
-- =====================================================
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default menu categories
INSERT INTO menu_categories (name, slug, description, display_order) VALUES
  ('Nigerian Dishes', 'nigerian-dishes', 'Authentic Nigerian cuisine prepared with fresh local ingredients', 1),
  ('Breakfast', 'breakfast', 'Start your day with our delicious breakfast options', 2),
  ('Lunch', 'lunch', 'Satisfying lunch selections for the afternoon', 3),
  ('Dinner', 'dinner', 'Premium dinner choices for an elegant evening', 4),
  ('Chops & Fries', 'chops-and-fries', 'Quick bites, chops, and crispy fries', 5),
  ('Grilled & Roasted', 'grilled-and-roasted', 'Perfectly grilled and roasted specialties', 6),
  ('Drinks & Beverages', 'drinks-and-beverages', 'Refreshing drinks, juices, and beverages', 7);

-- =====================================================
-- 7. MENU ITEMS
-- =====================================================
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  photo_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample menu items
INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, display_order) VALUES
  ((SELECT id FROM menu_categories WHERE slug = 'nigerian-dishes'), 'Jollof Rice & Chicken', 'Smoky party-style jollof rice served with perfectly seasoned grilled chicken', 3500, true, true, 1),
  ((SELECT id FROM menu_categories WHERE slug = 'nigerian-dishes'), 'Pounded Yam & Egusi Soup', 'Smooth pounded yam with rich melon seed soup, assorted meat and fish', 4000, true, true, 2),
  ((SELECT id FROM menu_categories WHERE slug = 'nigerian-dishes'), 'Pepper Soup (Goat Meat)', 'Spicy and aromatic goat meat pepper soup with traditional herbs', 3000, true, false, 3),
  ((SELECT id FROM menu_categories WHERE slug = 'nigerian-dishes'), 'Fried Rice & Grilled Fish', 'Colourful fried rice with fresh vegetables and grilled catfish', 4000, true, false, 4),
  ((SELECT id FROM menu_categories WHERE slug = 'nigerian-dishes'), 'Amala & Ewedu with Gbegiri', 'Traditional Yoruba delicacy with smooth amala and ewedu soup', 3500, true, false, 5),
  ((SELECT id FROM menu_categories WHERE slug = 'grilled-and-roasted'), 'Suya (Beef)', 'Classic Nigerian spiced grilled beef skewers', 2500, true, true, 1),
  ((SELECT id FROM menu_categories WHERE slug = 'grilled-and-roasted'), 'Grilled Whole Chicken', 'Whole chicken marinated and grilled to perfection', 6000, true, false, 2),
  ((SELECT id FROM menu_categories WHERE slug = 'chops-and-fries'), 'Chicken & Chips', 'Crispy fried chicken with seasoned french fries', 3000, true, true, 1),
  ((SELECT id FROM menu_categories WHERE slug = 'chops-and-fries'), 'Meat Pie', 'Freshly baked meat pie with seasoned minced filling', 800, true, false, 2),
  ((SELECT id FROM menu_categories WHERE slug = 'drinks-and-beverages'), 'Fresh Chapman', 'Classic Nigerian cocktail with citrus and grenadine', 1500, true, true, 1),
  ((SELECT id FROM menu_categories WHERE slug = 'drinks-and-beverages'), 'Zobo Drink', 'Refreshing hibiscus drink with natural spices', 800, true, false, 2);

-- =====================================================
-- 8. FACILITIES
-- =====================================================
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'star',
  is_enabled BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default facilities
INSERT INTO facilities (name, description, icon, is_enabled, display_order) VALUES
  ('Air Conditioning', 'Climate-controlled rooms for your comfort', 'snowflake', true, 1),
  ('Free Wi-Fi', 'High-speed internet access throughout the hotel', 'wifi', true, 2),
  ('Flat Screen TV', 'Modern flat screen TVs with cable channels', 'tv', true, 3),
  ('Hot Water', '24/7 hot water supply in all rooms', 'droplets', true, 4),
  ('Restaurant', 'On-site restaurant serving Nigerian and international cuisine', 'utensils', true, 5),
  ('Room Service', 'In-room dining available for your convenience', 'concierge-bell', true, 6),
  ('Parking', 'Secure parking space for guests', 'car', true, 7),
  ('24/7 Security', 'Round-the-clock security for your safety', 'shield-check', true, 8),
  ('Laundry Service', 'Professional laundry and dry cleaning service', 'shirt', true, 9),
  ('Power Supply', 'Constant power supply with backup generator', 'zap', true, 10);

-- =====================================================
-- 9. REVIEWS
-- =====================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  review_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample reviews
INSERT INTO reviews (guest_name, rating, review_text, is_published, review_date) VALUES
  ('Adamu Ibrahim', 5, 'Excellent service and very clean rooms. The staff were incredibly welcoming and the food was amazing. Will definitely come back!', true, '2026-07-15'),
  ('Grace Okonkwo', 4, 'Beautiful hotel with great facilities. The room was spacious and comfortable. The Nigerian dishes at the restaurant were absolutely delicious.', true, '2026-07-20'),
  ('David Nwachukwu', 5, 'Best hotel in Keffi! The VIP suite was outstanding. Perfect for my business trip. The WiFi was fast and the staff were professional.', true, '2026-08-01');

-- =====================================================
-- 10. MEDIA
-- =====================================================
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'image',
  file_size INT,
  alt_text TEXT,
  usage_context TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 11. WEBSITE CONTENT
-- =====================================================
CREATE TABLE website_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default website content
INSERT INTO website_content (section_key, title, content) VALUES
  ('hero_subtitle', 'Hero Subtitle', 'Experience unparalleled luxury and comfort in the heart of Keffi, Nigeria. Your perfect stay awaits.'),
  ('about_title', 'About Us', 'Welcome to Super E Luxury Hotel & Suites'),
  ('about_content', 'About Content', 'Super E Luxury Hotel & Suites is a premier hospitality destination located in Keffi, Nasarawa State, Nigeria. We are committed to providing our guests with an exceptional experience that combines modern luxury with warm Nigerian hospitality. Our well-appointed rooms, exquisite restaurant, and attentive staff ensure that every moment of your stay is memorable.'),
  ('restaurant_description', 'Restaurant Description', 'Savor the finest Nigerian cuisine and international dishes at our elegant restaurant. Our skilled chefs prepare each meal with fresh, locally-sourced ingredients and authentic spices.');

-- =====================================================
-- 12. ROOM SERVICE REQUESTS (Future-ready)
-- =====================================================
CREATE TABLE room_service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  room_number TEXT,
  guest_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount DECIMAL(12, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE hotel_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_service_requests ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (for customer-facing pages)
CREATE POLICY "Public read hotel settings" ON hotel_settings FOR SELECT USING (true);
CREATE POLICY "Public read room categories" ON room_categories FOR SELECT USING (true);
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read menu categories" ON menu_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read menu items" ON menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public read facilities" ON facilities FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public read published reviews" ON reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Public read website content" ON website_content FOR SELECT USING (true);

-- PUBLIC INSERT policies (for customer bookings)
CREATE POLICY "Public create guests" ON guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- AUTHENTICATED (Admin) full access policies
CREATE POLICY "Admin full access hotel settings" ON hotel_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access room categories" ON room_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access rooms" ON rooms FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access guests" ON guests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access menu categories" ON menu_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access menu items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access facilities" ON facilities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access media" ON media FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access website content" ON website_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access room service" ON room_service_requests FOR ALL USING (auth.role() = 'authenticated');

-- Public read for media (images used in pages)
CREATE POLICY "Public read media" ON media FOR SELECT USING (true);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_rooms_category ON rooms(category_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_bookings_reference ON bookings(reference_number);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_hotel_settings_updated_at BEFORE UPDATE ON hotel_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_categories_updated_at BEFORE UPDATE ON room_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_website_content_updated_at BEFORE UPDATE ON website_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_service_updated_at BEFORE UPDATE ON room_service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 13. GYM SUBSCRIPTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS gym_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id TEXT NOT NULL,
  package_name TEXT NOT NULL,
  package_price DECIMAL(12, 2) NOT NULL,
  package_duration TEXT NOT NULL,
  member_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  start_date DATE NOT NULL,
  fitness_goals TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE gym_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public create gym_subscriptions" ON gym_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read gym_subscriptions" ON gym_subscriptions FOR SELECT USING (true);
CREATE POLICY "Admin full access gym_subscriptions" ON gym_subscriptions FOR ALL USING (auth.role() = 'authenticated');
CREATE TRIGGER update_gym_subscriptions_updated_at BEFORE UPDATE ON gym_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKET FOR MEDIA
-- =====================================================
-- Run this in the Supabase dashboard under Storage:
-- Create a public bucket called "media" 
-- This will store hotel images uploaded from the admin dashboard
