// Database types for Super E Luxury Hotel
// These mirror the Supabase schema

export interface HotelSettings {
  id: string;
  hotel_name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  map_embed_url: string;
  map_latitude: number | null;
  map_longitude: number | null;
  currency_symbol: string;
  currency_code: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  created_at: string;
  updated_at: string;
}

export interface RoomCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price_per_night: number;
  max_guests: number;
  bed_type: string;
  room_size: string;
  facilities: string[];
  photos: string[];
  status: 'available' | 'booked' | 'occupied' | 'maintenance';
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: RoomCategory;
}

export interface Guest {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  created_at: string;
}

export type BookingStatus = 'new' | 'awaiting_confirmation' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'not_paid' | 'awaiting_payment' | 'partially_paid' | 'paid' | 'refunded';

export interface Booking {
  id: string;
  reference_number: string;
  guest_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  total_nights: number;
  total_amount: number;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  special_requests: string;
  admin_notes: string;
  assigned_room_number: string;
  cancelled_reason: string;
  created_at: string;
  updated_at: string;
  // Joined
  guest?: Guest;
  room?: Room;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  photo_url: string;
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: MenuCategory;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  icon: string;
  is_enabled: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  guest_name: string;
  rating: number;
  review_text: string;
  is_published: boolean;
  review_date: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  alt_text: string;
  usage_context: string;
  created_at: string;
}

export interface WebsiteContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  updated_at: string;
}

export interface RoomServiceRequest {
  id: string;
  booking_id: string;
  room_number: string;
  guest_name: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total_amount: number;
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

// Booking form types
export interface BookingFormData {
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  full_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  special_requests: string;
}

// Status display helpers
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  new: 'New',
  awaiting_confirmation: 'Awaiting Confirmation',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  not_paid: 'Not Paid',
  awaiting_payment: 'Awaiting Payment',
  partially_paid: 'Partially Paid',
  paid: 'Paid',
  refunded: 'Refunded',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  awaiting_confirmation: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  checked_in: 'bg-purple-100 text-purple-800',
  checked_out: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  not_paid: 'bg-red-100 text-red-800',
  awaiting_payment: 'bg-yellow-100 text-yellow-800',
  partially_paid: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export const ROOM_STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  booked: 'Booked',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
};

export const ROOM_STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  booked: 'bg-blue-100 text-blue-800',
  occupied: 'bg-purple-100 text-purple-800',
  maintenance: 'bg-orange-100 text-orange-800',
};
