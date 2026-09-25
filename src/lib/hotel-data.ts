// Central Hotel Data & Inventory Store for Super E Luxury Hotel and Suites Ltd.

export interface HotelInfo {
  name: string;
  shortName: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  country: string;
  email: string;
  hotlines: string[];
  whatsappNumber: string;
  logoUrl: string;
  ratesBoardUrl: string;
  serviceChargePercent: number;
  vatPercent: number;
}

export const HOTEL_INFO: HotelInfo = {
  name: 'Super E Luxury Hotel and Suites Ltd.',
  shortName: 'Super E Hotel',
  tagline: 'Where comfort meets luxury...',
  address: '11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A Keffi, Nasarawa State.',
  city: 'Keffi',
  state: 'Nasarawa State',
  country: 'Nigeria',
  email: 'supereluxuryhotelandsuites@gmail.com',
  hotlines: ['07066472533', '09072069217'],
  whatsappNumber: '07066472533',
  logoUrl: '/images/logo.jpg',
  ratesBoardUrl: '/images/room-rates-board.jpg',
  serviceChargePercent: 10,
  vatPercent: 7,
};

export interface BankAccountDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  verifiedBadge: string;
  note: string;
}

export const OFFICIAL_BANK_ACCOUNT: BankAccountDetails = {
  bankName: 'Moniepoint Microfinance Bank',
  accountNumber: '5326187865',
  accountName: 'SUPER E LUXURY HOTEL AND SUITES LTD - RECEPTION',
  verifiedBadge: 'Only Official Receiving Account',
  note: 'This is the company account number and only account to receive payment for Super E Luxury Hotel and Suites Ltd. All banks are accepted for transfer.',
};

export interface HotelPolicy {
  id: string;
  title: string;
  summary: string;
  details: string;
  category: 'rates' | 'timing' | 'payments' | 'cancellation' | 'security';
  badge?: string;
}

export const HOTEL_POLICIES: HotelPolicy[] = [
  {
    id: 'rates_tax',
    title: 'All-Inclusive Pricing',
    summary: 'All published room rates are fully inclusive of 10% Service Charge and 7% VAT.',
    details: 'There are no hidden check-in taxes or surcharges. What you see is your full room rate per night.',
    category: 'rates',
    badge: '10% SC & 7% VAT Included',
  },
  {
    id: 'checkout_time',
    title: 'Check-out Time: 12:00 Noon',
    summary: 'Standard check-out is strictly at 12:00 noon. Check-in commences from 2:00 PM.',
    details: 'To allow our housekeeping team adequate time for sanitization and room preparation for arriving guests, check-out time is prompt at 12:00 noon.',
    category: 'timing',
    badge: '12:00 Noon',
  },
  {
    id: 'late_checkout',
    title: 'Late Check-out Surcharge Policies',
    summary: 'Late check-out between 12:00 noon and 3:00 PM incurs 50% room rate; after 3:00 PM incurs 100% full rate.',
    details: 'Guests requesting late check-out must notify reception in advance. Late check-outs before 1:00 PM / up to 3:00 PM attract 50% of the room charge. Departures after 3:00 PM attract a 100% full day room rate, subject to room availability.',
    category: 'timing',
    badge: '50% / 100% Surcharge',
  },
  {
    id: 'payment_confirmation',
    title: 'Guaranteed Payment Confirmation',
    summary: 'Reservations are only confirmed upon validated payment or official bank transfer deposit.',
    details: 'Your room reservation is secured once payment is confirmed by our front desk or accounting department.',
    category: 'payments',
    badge: 'Payment Required',
  },
  {
    id: 'unpaid_hold',
    title: '5:00 PM Unpaid Reservation Release',
    summary: 'Reservations made without advance payment will be automatically released after 5:00 PM.',
    details: 'Unpaid tentative bookings cannot be guaranteed after 5:00 PM on the scheduled date of arrival and may be allocated to waiting guests.',
    category: 'payments',
    badge: '5:00 PM Cut-off',
  },
  {
    id: 'cancellation_policy',
    title: 'Cancellation Policy',
    summary: 'Cancellations within 24 hours of scheduled arrival attract a 50% cancellation surcharge.',
    details: 'To receive a full credit or reschedule without penalty, please notify the hotel at least 24 hours prior to your check-in time.',
    category: 'cancellation',
    badge: '50% Under 24h',
  },
  {
    id: 'safe_custody',
    title: 'Valuables & Safe Custody Liability',
    summary: 'All valuables (cash, jewelry, gadgets) must be deposited at the front desk safety deposit vaults.',
    details: 'The hotel management accepts no responsibility or legal liability for loss or theft of valuables and money not officially deposited into front desk custody.',
    category: 'security',
    badge: 'Front Desk Deposit',
  },
];

export interface RoomUnit {
  id: string;
  roomNumber: string;
  floor: string;
  status: 'available' | 'occupied' | 'booked' | 'maintenance';
  notes?: string;
}

export interface RoomCategoryData {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  maxGuests: number;
  bedType: string;
  roomSize: string;
  image: string;
  images?: string[];
  description: string;
  facilities: string[];
  isFeatured?: boolean;
  units: RoomUnit[];
}

export const INITIAL_ROOMS_DATA: RoomCategoryData[] = [
  {
    id: 'standard',
    slug: 'standard',
    name: 'Standard Room',
    category: 'Standard',
    price: 36000,
    maxGuests: 2,
    bedType: 'Queen Bed',
    roomSize: '25 sqm',
    image: '/images/standard-room.jpg',
    images: [
      '/images/standard-room.jpg',
      '/images/hotel-lobby.jpg',
      '/images/hotel-exterior.jpg',
    ],
    description: 'Our Standard Room offers a comfortable retreat with premium bedding, climate control, and essential amenities. Ideal for business travellers and couples.',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'High-Speed Wi-Fi', 'Hot Water', 'Wardrobe', 'Work Desk'],
    isFeatured: true,
    units: [
      { id: 'std-101', roomNumber: '101', floor: '1st Floor', status: 'available' },
      { id: 'std-102', roomNumber: '102', floor: '1st Floor', status: 'available' },
      { id: 'std-103', roomNumber: '103', floor: '1st Floor', status: 'occupied' },
      { id: 'std-104', roomNumber: '104', floor: '1st Floor', status: 'available' },
    ],
  },
  {
    id: 'deluxe',
    slug: 'deluxe',
    name: 'Deluxe Room',
    category: 'Deluxe',
    price: 47000,
    maxGuests: 2,
    bedType: 'King Bed',
    roomSize: '32 sqm',
    image: '/images/deluxe-room.jpg',
    images: [
      '/images/deluxe-room.jpg',
      '/images/deluxe-1.jpg',
      '/images/hotel-lobby.jpg',
    ],
    description: 'Spacious Deluxe room featuring sophisticated finishes, plush king bedding, tea/coffee maker, and enhanced lounging space.',
    facilities: ['Air Conditioning', 'Smart Flat Screen TV', 'Wi-Fi', 'Hot Water', 'Mini Refrigerator', 'Wardrobe', 'Sitting Lounge'],
    isFeatured: true,
    units: [
      { id: 'dlx-201', roomNumber: '201', floor: '2nd Floor', status: 'available' },
      { id: 'dlx-202', roomNumber: '202', floor: '2nd Floor', status: 'available' },
      { id: 'dlx-203', roomNumber: '203', floor: '2nd Floor', status: 'booked' },
    ],
  },
  {
    id: 'deluxe-1',
    slug: 'deluxe-1',
    name: 'Deluxe 1',
    category: 'Deluxe',
    price: 49000,
    maxGuests: 2,
    bedType: 'King Bed (Plush)',
    roomSize: '36 sqm',
    image: '/images/deluxe-1.jpg',
    images: [
      '/images/deluxe-1.jpg',
      '/images/deluxe-room.jpg',
      '/images/room-rates-board.jpg',
    ],
    description: 'Upgraded Deluxe tier with premium walnut accents, ambient mood lighting, vanity mirror, and soundproofed windows for tranquil rest.',
    facilities: ['Air Conditioning', 'Smart TV with DSTV', 'High-Speed Wi-Fi', 'Hot Water', 'Mini Refrigerator', 'Modern Armchair', 'Wardrobe'],
    isFeatured: true,
    units: [
      { id: 'dlx1-204', roomNumber: '204', floor: '2nd Floor', status: 'available' },
      { id: 'dlx1-205', roomNumber: '205', floor: '2nd Floor', status: 'available' },
      { id: 'dlx1-206', roomNumber: '206', floor: '2nd Floor', status: 'maintenance' },
    ],
  },
  {
    id: 'deluxe-2',
    slug: 'deluxe-2',
    name: 'Deluxe 2',
    category: 'Deluxe',
    price: 50500,
    maxGuests: 2,
    bedType: 'King Bed (Signature)',
    roomSize: '38 sqm',
    image: '/images/deluxe-2.jpg',
    images: [
      '/images/deluxe-2.jpg',
      '/images/deluxe-1.jpg',
      '/images/hotel-exterior.jpg',
    ],
    description: 'Our highest Deluxe tier offering architectural elegance, velvet headboard, executive work station, city view, and luxury bath amenities.',
    facilities: ['Air Conditioning', 'Smart LED TV', 'High-Speed Wi-Fi', 'Rain Shower & Hot Water', 'Mini Bar Fridge', 'Executive Workspace', 'Bathrobes'],
    isFeatured: false,
    units: [
      { id: 'dlx2-207', roomNumber: '207', floor: '2nd Floor', status: 'available' },
      { id: 'dlx2-208', roomNumber: '208', floor: '2nd Floor', status: 'available' },
    ],
  },
  {
    id: 'luxury',
    slug: 'luxury',
    name: 'Luxury Room',
    category: 'Luxury',
    price: 53000,
    maxGuests: 2,
    bedType: 'Master King Bed',
    roomSize: '42 sqm',
    image: '/images/luxury-room.jpg',
    images: [
      '/images/luxury-room.jpg',
      '/images/deluxe-2.jpg',
      '/images/hotel-lobby.jpg',
    ],
    description: 'An exceptional blend of style and comfort. Features rich coral blush padded headboard with diagonal gold chevron accents, custom origami bird lamps, and premium toiletries.',
    facilities: ['Climate Control AC', '55-inch Smart TV', 'High-Speed Wi-Fi', 'Hot Water & Shower', 'Mini Refrigerator', 'Comfortable Lounge Seating', 'Luxury Robe & Slippers'],
    isFeatured: true,
    units: [
      { id: 'lux-301', roomNumber: '301', floor: '3rd Floor', status: 'available' },
      { id: 'lux-302', roomNumber: '302', floor: '3rd Floor', status: 'occupied' },
      { id: 'lux-303', roomNumber: '303', floor: '3rd Floor', status: 'available' },
    ],
  },
  {
    id: 'executive',
    slug: 'executive',
    name: 'Executive Room',
    category: 'Executive',
    price: 59000,
    maxGuests: 2,
    bedType: 'Executive King Bed',
    roomSize: '45 sqm',
    image: '/images/executive-room.jpg',
    images: [
      '/images/executive-room.jpg',
      '/images/executive-1.jpg',
      '/images/luxury-room.jpg',
    ],
    description: 'Tailored for corporate executives and discerning travelers. Features regal burgundy velvet headboard with gold grid inlays, purple ambient ceiling lighting, dedicated meeting desk, and VIP room service.',
    facilities: ['Air Conditioning', 'Smart TV with Streaming', 'High-Speed Wi-Fi', 'Hot Water', 'Full Mini Bar', 'Executive Desk & Ergonomic Chair', 'Room Service Priority'],
    isFeatured: true,
    units: [
      { id: 'exec-304', roomNumber: '304', floor: '3rd Floor', status: 'available' },
      { id: 'exec-305', roomNumber: '305', floor: '3rd Floor', status: 'available' },
    ],
  },
  {
    id: 'executive-1',
    slug: 'executive-1',
    name: 'Executive Room 1',
    category: 'Executive',
    price: 65000,
    maxGuests: 2,
    bedType: 'Executive King (Royal)',
    roomSize: '50 sqm',
    image: '/images/executive-1.jpg',
    images: [
      '/images/executive-1.jpg',
      '/images/executive-room.jpg',
      '/images/hotel-aerial-drone.jpg',
    ],
    description: 'Premier executive accommodation with panoramic city views, designer glass wardrobe, dual work monitors setup, and VIP personalized room service.',
    facilities: ['Dual AC Units', '60-inch Smart TV', 'Dedicated Fiber Wi-Fi', 'Hot Water Shower & Tub', 'Stocked Mini Bar', 'Executive Suite Desk', 'VIP Welcome Refreshment'],
    isFeatured: false,
    units: [
      { id: 'exec1-306', roomNumber: '306', floor: '3rd Floor', status: 'available' },
      { id: 'exec1-307', roomNumber: '307', floor: '3rd Floor', status: 'booked' },
    ],
  },
  {
    id: 'presidential-suite',
    slug: 'presidential-suite',
    name: 'Presidential Suite',
    category: 'Presidential',
    price: 153000,
    maxGuests: 4,
    bedType: 'Master King Bed + Private Lounge',
    roomSize: '85 sqm',
    image: '/images/presidential-suite.jpg',
    images: [
      '/images/presidential-suite.jpg',
      '/images/vip-suite.jpg',
      '/images/hotel-lobby.jpg',
      '/images/hotel-front-drone.jpg',
    ],
    description: 'The crowning jewel of Super E Luxury Hotel. Expansive master suite featuring private living salon with sofa lounge and coffee table, tall cream & gold headboard, luxury dining area, and 24/7 dedicated butler service.',
    facilities: ['Private Living Room & Dining Area', 'Master King Bedroom', '65-inch 4K Smart TVs', 'High-Speed Wi-Fi', 'Jacuzzi & Rain Shower', 'Full Bar & Refrigerator', 'Complimentary VIP Breakfast', '24/7 Dedicated Butler Service'],
    isFeatured: true,
    units: [
      { id: 'pres-401', roomNumber: '401 (Penthouse)', floor: '4th Floor', status: 'available' },
      { id: 'pres-402', roomNumber: '402 (Penthouse)', floor: '4th Floor', status: 'available' },
    ],
  },
];

const STORAGE_KEY = 'super_e_rooms_inventory_v3';

export function getStoredRoomsData(): RoomCategoryData[] {
  if (typeof window === 'undefined') {
    return INITIAL_ROOMS_DATA;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ROOMS_DATA));
      return INITIAL_ROOMS_DATA;
    }
    const parsed: RoomCategoryData[] = JSON.parse(saved);
    // Ensure every room category has a populated images array
    const enriched = parsed.map((r) => {
      const fallback = INITIAL_ROOMS_DATA.find((init) => init.id === r.id);
      const images = r.images && r.images.length > 0
        ? r.images
        : (fallback?.images && fallback.images.length > 0 ? fallback.images : [r.image]);
      return {
        ...r,
        images,
        image: images[0] || r.image,
      };
    });
    return enriched;
  } catch (e) {
    console.error('Error reading rooms from storage:', e);
    return INITIAL_ROOMS_DATA;
  }
}

export function saveStoredRoomsData(data: RoomCategoryData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('super_e_rooms_updated'));
  } catch (e) {
    console.error('Error saving rooms to storage:', e);
  }
}

export function getRoomBySlug(slug: string): RoomCategoryData | undefined {
  const all = getStoredRoomsData();
  return all.find(
    (r) => r.slug === slug || r.id === slug || `${r.slug}-room` === slug || (slug === 'vip-luxury-suite' && r.slug === 'presidential-suite')
  );
}
