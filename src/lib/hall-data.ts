// Event & Banquet Hall Data for Super E Luxury Hotel & Suites Ltd.

export interface HallPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  badge?: string;
  popular?: boolean;
  features: string[];
  suitableFor: string[];
}

export interface HallAmenity {
  name: string;
  description: string;
  iconName: 'zap' | 'snowflake' | 'mic' | 'users' | 'shield' | 'car' | 'sparkles' | 'utensils';
}

export interface HallLayoutOption {
  name: string;
  capacity: string;
  description: string;
}

export interface HallFAQ {
  question: string;
  answer: string;
}

export const HALL_INFO = {
  name: 'Super E Grand Event & Banquet Hall',
  location: '11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A, Keffi, Nasarawa State',
  shortDescription: 'The premier event center and conference banquet hall in Keffi, Nasarawa State. Equipped with high-capacity air conditioning, guaranteed 24/7 power supply, stage, sound system, and secure parking.',
  maxCapacity: 500,
  banquetCapacity: 300,
  theatreCapacity: 500,
  images: [
    '/images/event-hall-banquet.jpg',
    '/images/event-hall-conference.jpg',
    '/images/hotel-lobby.jpg',
    '/images/hotel-exterior.jpg',
  ],
};

export const HALL_AMENITIES: HallAmenity[] = [
  {
    name: 'Uninterrupted 24/7 Power Supply',
    description: 'Heavy-duty industrial standby generators ensure zero power interruption during your sacred event or conference.',
    iconName: 'zap',
  },
  {
    name: 'Industrial Climate Control (AC)',
    description: 'High-tonnage commercial air conditioning units keeping up to 500 guests cool and refreshed throughout the ceremony.',
    iconName: 'snowflake',
  },
  {
    name: 'Acoustic Stage & Pro PA Sound',
    description: 'Elevated presentation stage, wireless microphones, mixer, and high-fidelity surround sound speakers for speeches & music.',
    iconName: 'mic',
  },
  {
    name: 'Flexible Seating & Layouts',
    description: 'Chairs and banquet tables customized for wedding banquets, seminars, classroom workshops, or grand receptions.',
    iconName: 'users',
  },
  {
    name: 'Round-the-Clock VIP Security',
    description: 'Trained professional security personnel and CCTV surveillance for complete guest safety and crowd coordination.',
    iconName: 'shield',
  },
  {
    name: 'Spacious On-Site Secure Parking',
    description: 'Ample parking capacity for VIP motorcades and guest vehicles within our perimeter security gate.',
    iconName: 'car',
  },
  {
    name: 'In-House Banquet Catering & Bar',
    description: 'Option to pair your hall rental with our exquisite Nigerian buffet dishes and fully-stocked bar drinks packages.',
    iconName: 'utensils',
  },
  {
    name: 'Luxury Restrooms & Dressing Suite',
    description: 'Clean, sanitized executive restrooms and a private green room / bridal touch-up suite.',
    iconName: 'sparkles',
  },
];

export const HALL_LAYOUTS: HallLayoutOption[] = [
  {
    name: 'Banquet Dinner & Wedding Setup',
    capacity: 'Up to 300 Guests',
    description: 'Round tables with banquet chairs, dance floor, bridal stage, and buffet serving corridor.',
  },
  {
    name: 'Conference & Theatre Auditorium',
    capacity: 'Up to 500 Guests',
    description: 'Tiered rows facing the elevated stage and presentation screen for lectures, AGMs, summits, and church programs.',
  },
  {
    name: 'Classroom & Workshop Layout',
    capacity: 'Up to 250 Guests',
    description: 'Worktables with writing space, power outlets, and projector sightlines for training sessions.',
  },
  {
    name: 'Cocktail & Evening Gala',
    capacity: 'Up to 600 Guests',
    description: 'Open ambient reception with high-top cocktail tables, VIP lounge corners, and bar stations.',
  },
];

export const HALL_PACKAGES: HallPackage[] = [
  {
    id: 'half-day-seminar',
    name: 'Corporate Half-Day Session',
    tagline: 'Ideal for workshops, lectures, press briefings & seminars',
    price: 150000,
    duration: 'Up to 5 Hours (Morning or Afternoon)',
    badge: 'Corporate Standard',
    features: [
      '5 Hours dedicated hall access',
      'Full industrial air conditioning',
      'Guaranteed 24/7 standby power supply',
      'Standard podium & 2 wireless microphones',
      'Up to 300 theatre seating setup',
      'VIP secure car park access',
    ],
    suitableFor: ['Corporate Seminars', 'Workshops', 'Press Briefings', 'Lectures & Trainings'],
  },
  {
    id: 'full-day-wedding',
    name: 'Grand Wedding & Banquet Package',
    tagline: 'Our flagship full-day package for wedding receptions & celebrations',
    price: 280000,
    duration: 'Full Day (8:00 AM – 8:00 PM)',
    badge: 'Most Popular',
    popular: true,
    features: [
      'Full 12 hours hall access for decoration & event',
      'Continuous uninterrupted climate control (AC)',
      'Dual standby generator power assurance',
      'Full PA sound system, wireless mics & stage lighting',
      'Banquet tables & luxury chairs arrangement',
      'Dedicated on-site event coordinator & technician',
      'Private bridal / VIP dressing room',
      'Full perimeter security & parking attendants',
    ],
    suitableFor: ['Wedding Receptions', 'Milestone Birthdays', 'State Receptions', 'Banquets & Dinners'],
  },
  {
    id: 'vip-executive-gala',
    name: 'Executive Gala & Late Night Celebration',
    tagline: 'Extended duration with premium audio-visual & nightlife access',
    price: 400000,
    duration: 'Full Day + Night (8:00 AM – 11:30 PM)',
    badge: 'Executive VIP',
    features: [
      'Extended hours up to 11:30 PM for nighttime celebrations',
      'Unrestricted sound volume with pro audio engineering',
      'Continuous 24/7 generator power guarantees',
      'Full stage & ambient mood lighting package',
      'Complimentary 1-Night Luxury Room stay for event host/couple',
      'VIP bottle service coordination with our Lounge & Bar',
      'Priority room reservation rates for out-of-town guests',
    ],
    suitableFor: ['Gala Dinners', 'Award Ceremonies', 'Late Night Parties', 'Multi-Session Summits'],
  },
];

export const HALL_FAQS: HallFAQ[] = [
  {
    question: 'Where is Super E Event & Banquet Hall located in Keffi?',
    answer: 'Super E Event Hall is conveniently located at 11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A, Keffi, Nasarawa State, easily accessible from the Abuja-Keffi expressway and near Nasarawa State University (NSUK).',
  },
  {
    question: 'What is the maximum guest capacity of the event hall?',
    answer: 'Our hall comfortably hosts up to 500 guests in a theatre/conference auditorium setup, and up to 300 guests in a spacious banquet dinner layout with round tables, stage, and dance floor.',
  },
  {
    question: 'Is power supply guaranteed throughout the event?',
    answer: 'Yes! Super E Luxury Hotel operates continuous industrial backup generators that switch on automatically, ensuring 100% uninterrupted electricity, powerful air conditioning, and sound throughout your celebration.',
  },
  {
    question: 'Can we bring external decorators and food caterers?',
    answer: 'Yes, clients are welcome to bring their preferred event decorators and caterers. We also offer optional in-house catering (authentic Nigerian dishes) and bar drink packages straight from our hotel drinks inventory.',
  },
  {
    question: 'How do I book or inspect the hall before my event?',
    answer: 'You can submit an online reservation inquiry on this page or message us directly on WhatsApp at 07066472533 / 09072069217. Our event manager will schedule a physical inspection and lock in your chosen date upon deposit.',
  },
  {
    question: 'Do you offer discounted room rates for event guests staying overnight?',
    answer: 'Yes! When you book our event hall, your guests enjoy special discounted accommodation rates across our 8 room categories (Standard, Deluxe, Luxury, Executive, and Presidential Suite).',
  },
];
