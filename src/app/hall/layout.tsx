import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Hall & Banquet Center in Keffi | Super E Luxury Hotel',
  description: 'Book the premier Event & Banquet Hall in Keffi, Nasarawa State. 500-guest capacity, guaranteed 24/7 power, industrial AC, stage, sound system & secure parking. Perfect for weddings, conferences, AGMs & celebrations.',
  keywords: [
    'event hall in keffi',
    'hall for rent keffi nasarawa',
    'wedding reception hall in keffi',
    'conference hall keffi',
    'event center near nasarawa state university nsuk',
    'banquet hall booking keffi',
    'meeting room keffi',
    'party hall rental keffi',
    'event venue keffi nasarawa',
    'super e hotel event hall',
    'auditorium keffi',
    'seminar hall keffi',
  ],
  alternates: { canonical: 'https://supereluxuryhotel.com/hall' },
  openGraph: {
    title: 'Grand Event & Banquet Hall Booking in Keffi | Super E Luxury Hotel',
    description: 'Premier air-conditioned event hall in Keffi for up to 500 guests. 24/7 uninterrupted power, sound system, stage, and secure parking.',
    url: 'https://supereluxuryhotel.com/hall',
    siteName: 'Super E Luxury Hotel & Suites',
    images: [
      {
        url: 'https://supereluxuryhotel.com/images/event-hall-banquet.jpg',
        width: 1200,
        height: 675,
        alt: 'Super E Luxury Event & Banquet Hall Keffi',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Hall & Banquet Center in Keffi | Super E Luxury Hotel',
    description: 'Premier event center for weddings, conferences and corporate galas in Keffi, Nasarawa State. 24/7 power & full AC.',
    images: ['https://supereluxuryhotel.com/images/event-hall-banquet.jpg'],
  },
};

const hallJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['EventVenue', 'MeetingRoom'],
  'name': 'Super E Grand Event & Banquet Hall Keffi',
  'description': 'The premier multi-purpose event center and conference banquet hall in Keffi, Nasarawa State. 500-guest capacity, industrial climate control, 24/7 generator power guarantee, acoustic stage, and secure parking.',
  'url': 'https://supereluxuryhotel.com/hall',
  'image': 'https://supereluxuryhotel.com/images/event-hall-banquet.jpg',
  'telephone': ['+2347066472533', '+2349072069217'],
  'maximumAttendeeCapacity': 500,
  'priceRange': '₦150,000 - ₦400,000',
  'currenciesAccepted': 'NGN',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A',
    'addressLocality': 'Keffi',
    'addressRegion': 'Nasarawa State',
    'addressCountry': 'NG',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 8.8463,
    'longitude': 7.8736,
  },
  'amenityFeature': [
    { '@type': 'LocationFeatureSpecification', 'name': 'Guaranteed 24/7 Industrial Generator Power', 'value': true },
    { '@type': 'LocationFeatureSpecification', 'name': 'Commercial Air Conditioning Climate Control', 'value': true },
    { '@type': 'LocationFeatureSpecification', 'name': 'Acoustic Stage & Professional PA Sound System', 'value': true },
    { '@type': 'LocationFeatureSpecification', 'name': 'Banquet Tables & Luxury Chairs', 'value': true },
    { '@type': 'LocationFeatureSpecification', 'name': 'Gated Secure VIP Parking Lot', 'value': true },
    { '@type': 'LocationFeatureSpecification', 'name': '24/7 On-Site Armed & Uniformed Security', 'value': true },
    { '@type': 'LocationFeatureSpecification', 'name': 'Private Bridal Dressing Suite & Green Room', 'value': true },
    { '@type': 'LocationFeatureSpecification', 'name': 'In-House Catering & Stocked Bar Packages', 'value': true },
  ],
};

const hallFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'How much to rent an event hall in Keffi at Super E Luxury Hotel?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Hall rental packages at Super E Luxury Hotel start from ₦150,000 for Corporate Half-Day Sessions, ₦280,000 for Grand Full-Day Wedding & Banquet packages, and ₦400,000 for Executive Late-Night Galas. All packages include full air conditioning and 24/7 power guarantee.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Does Super E hall have backup power and AC?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes! Super E Luxury Hotel has dual industrial standby generators providing 100% uninterrupted power supply and high-capacity commercial AC units that keep up to 500 guests cool and comfortable throughout your event.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Can I bring external decorators and food caterers?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes! You are completely free to bring your own professional event decorators, caterers, and DJ. We also offer optional in-house catering (authentic Nigerian buffet dishes) and fully stocked drinks packages directly from our bar.',
      },
    },
    {
      '@type': 'Question',
      'name': 'What is the maximum guest capacity of the event hall?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Our hall accommodates up to 500 guests in a theatre / conference seating setup and up to 300 guests in a spacious banquet round table dinner layout with bridal stage and dance floor.',
      },
    },
    {
      '@type': 'Question',
      'name': 'Where is Super E Event & Banquet Hall located in Keffi?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'The hall is located inside Super E Luxury Hotel & Suites at 11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A, Keffi, Nasarawa State, easily reached from the Abuja-Keffi expressway and near Nasarawa State University (NSUK).',
      },
    },
  ],
};

export default function HallLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hallJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hallFaqJsonLd) }}
      />
      {children}
    </>
  );
}
