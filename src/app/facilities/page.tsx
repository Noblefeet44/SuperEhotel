import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wifi, Snowflake, Tv, Droplets, Utensils, Car,
  Shield, Zap, ConciergeBell, Shirt, Star, CalendarCheck, Wine,
  CheckCircle2, MapPin, Phone, ArrowRight, ShieldCheck, Sparkles,
  Camera, Clock, Lock, Coffee
} from 'lucide-react';
import { HOTEL_INFO } from '@/lib/hotel-data';

export const metadata: Metadata = {
  title: 'Hotel Facilities & Amenities | Super E Luxury Hotel & Suites Keffi',
  description:
    'Explore verified on-site facilities at Super E Luxury Hotel & Suites, Keffi, Nasarawa State. 24/7 Front Desk Reception, Gourmet Commercial Kitchen, Secure Shaded Car Parking, Modern Glass Architecture, Grand Event Hall, and VIP Lounge & Bar.',
  keywords: [
    'Super E Hotel facilities Keffi',
    'hotel front desk reception Keffi',
    'hotel restaurant kitchen Keffi',
    'secure hotel car park Keffi',
    'modern hotel architecture Nasarawa',
    'best hotel amenities in Keffi',
    'luxury hotel facilities Nasarawa State',
    'event hall Keffi',
    'VIP lounge Keffi',
  ],
  openGraph: {
    title: 'Verified Facilities & Amenities | Super E Luxury Hotel & Suites Keffi',
    description:
      'Take a visual tour of our 24/7 Front Desk, Hygienic Restaurant Kitchen, Guarded Shaded Car Park, and Contemporary Architectural Wing.',
    url: 'https://super-ehotel.vercel.app/facilities',
    siteName: 'Super E Luxury Hotel & Suites',
    images: [
      {
        url: '/images/super-e-hotel-entrance-lobby-facade-keffi.jpg',
        width: 1200,
        height: 675,
        alt: 'Super E Luxury Hotel 24/7 Grand Entrance and Chandelier Lobby Facade in Keffi',
      },
      {
        url: '/images/super-e-hotel-front-desk-reception-cashier-keffi.jpg',
        width: 1200,
        height: 675,
        alt: 'Super E Luxury Hotel 24/7 Front Desk Reception and Cashier Office in Keffi',
      },
      {
        url: '/images/super-e-hotel-secure-car-parking-lot-compound-keffi.jpg',
        width: 1200,
        height: 675,
        alt: 'Super E Luxury Hotel Secure Shaded Car Parking Lot and Guarded Compound in Keffi',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel Facilities | Super E Luxury Hotel & Suites Keffi',
    description:
      'Verified photos of 24/7 Front Desk, Commercial Kitchen, Shaded Car Parking, and Modern Facade.',
    images: ['/images/super-e-hotel-front-desk-reception-cashier-keffi.jpg'],
  },
};

// Facility with verified photos for Google Image SEO
interface PhotoFacility {
  id: string;
  name: string;
  seoTitle: string;
  category: string;
  badge: string;
  badgeColor: string;
  image: string;
  imageAlt: string;
  caption: string;
  description: string;
  highlights: string[];
}

const PHOTO_FACILITIES: PhotoFacility[] = [
  {
    id: 'front-desk-reception',
    name: '24/7 Front Desk & Cashier Concierge',
    seoTitle: '24/7 Front Desk Reception, POS Cashier & Guest Concierge Desk',
    category: 'Guest Services',
    badge: '24/7 Computerized Check-In',
    badgeColor: '#1E3A8A',
    image: '/images/super-e-hotel-front-desk-reception-cashier-keffi.jpg',
    imageAlt:
      'Super E Luxury Hotel 24/7 Front Desk Reception, POS Cashier Terminal and Guest Check-In Concierge in Keffi Nasarawa State',
    caption:
      'Executive 24/7 front desk with computerized reservations, cashless POS cashier terminals, transparent rate boards, and government hospitality certifications.',
    description:
      'Our modern front desk welcomes guests around the clock with rapid computerized check-in, computerized booking reconciliation, and instant walk-in room assignments. Equipped with high-speed POS terminals for cashless debit card transfers and direct receipt issuance, our certified reception officers ensure a seamless, polite, and secure arrival experience.',
    highlights: [
      '24/7 Dedicated Reception & Night Desk',
      'Instant Cashless POS Card Terminals',
      'Transparent Room Rates Board Display',
      'Luggage Custody & Valuables Front Desk Safe',
      'Express Check-In & Check-Out Clearance',
    ],
  },
  {
    id: 'restaurant-kitchen',
    name: 'Gourmet Commercial Kitchen & Food Prep',
    seoTitle: 'Hygienic Commercial Restaurant Kitchen & Fresh Culinary Food Preparation Center',
    category: 'Dining & Culinary',
    badge: 'Food Safety Certified',
    badgeColor: '#059669',
    image: '/images/super-e-hotel-commercial-kitchen-restaurant-food-prep-keffi.jpg',
    imageAlt:
      'Super E Luxury Hotel Hygienic Commercial Restaurant Kitchen and Fresh Food Preparation in Keffi Nasarawa State',
    caption:
      'State-of-the-art stainless steel commercial kitchen with industrial refrigeration, sterile prep counters, and professional chefs preparing fresh meals.',
    description:
      'Culinary excellence starts with unwavering hygiene. Super E Hotel houses a high-standard commercial kitchen fitted with stainless-steel food preparation counters, commercial deep-freeze refrigeration, high-temperature sanitization, and premium cookware. Our master chefs prepare smoky party jollof rice, pounded yam with rich egusi, fresh catfish pepper soup, and hot continental breakfast dishes delivered straight to your room or dining table.',
    highlights: [
      'Stainless-Steel Food Preparation Stations',
      'Haier Thermocool Commercial Cold Storage',
      'Authentic Nigerian & Continental Menu',
      '24/7 Fast In-Room Dining Delivery',
      'Strict Food Safety & Sanitation Protocols',
    ],
  },
  {
    id: 'secure-parking',
    name: 'Secure Shaded Car Park & Guarded Compound',
    seoTitle: 'Spacious Shaded Guest Car Parking Lot & 24/7 Guarded Security Compound',
    category: 'Security & Parking',
    badge: '24/7 CCTV & Armed Guarded',
    badgeColor: '#D97706',
    image: '/images/super-e-hotel-secure-car-parking-lot-compound-keffi.jpg',
    imageAlt:
      'Super E Luxury Hotel Secure Shaded Car Parking Lot, Canopy Bays and Guarded Perimeter Compound in Keffi Nasarawa State',
    caption:
      'Spacious tiled parking courtyard equipped with heavy-duty steel shade canopies, high boundary perimeter wall, and round-the-clock guarded security.',
    description:
      'Guest safety and vehicle protection are paramount. Our fully fenced and gated compound features an expansive interlocking tiled parking lot fitted with heavy-duty canopy covers to shield your vehicle from direct sun and rain. Guarded 24/7 by trained uniform security personnel with night illumination and perimeter surveillance, we comfortably accommodate executive sedans, heavy SUVs, bus charters, and VIP security convoys.',
    highlights: [
      'Heavy-Duty Steel Protective Sunshade Canopies',
      'Accommodates 30+ Vehicles, SUVs & VIP Convoys',
      'Gated Perimeter Wall with 24/7 Guarded Gatehouse',
      'Bright Night Security Lighting & CCTV Surveillance',
      'Complimentary Secure Guest Parking Included',
    ],
  },
  {
    id: 'grand-entrance',
    name: 'Grand Entrance, Chandelier Lobby & Facade',
    seoTitle: '24/7 Grand Hotel Entrance, Chandelier Reception & Tinted Glass Facade',
    category: 'Architecture & Arrival',
    badge: 'Executive Arrival Experience',
    badgeColor: '#7C3AED',
    image: '/images/super-e-hotel-entrance-lobby-facade-keffi.jpg',
    imageAlt:
      'Super E Luxury Hotel 24/7 Grand Entrance, Ambient Chandelier and Black Marble Tinted Glass Facade in Keffi Nasarawa State',
    caption:
      'Polished black marble entry with illuminated chandelier, double glass automatic doors, and landscaped courtyard entryway.',
    description:
      'From the moment you arrive, Super E Luxury Hotel greets you with architectural splendor. The grand entrance showcases high-gloss polished marble cladding, ambient decorative chandeliers, modern thermal-tinted glass doors, and manicured ornamental plants. Designed to impress executive guests, bridal parties, and international visitors, it sets the stage for unmatched luxury in Nasarawa State.',
    highlights: [
      'Polished Black Marble Portico & Chandelier',
      'Thermal Tinted Soundproof Glass Entrance',
      'Landscaped Outdoor Planters & Patio',
      'Wheelchair & Luggage Accessible Ramps',
      'Covered Drop-off and Pick-up Driveway',
    ],
  },
  {
    id: 'glass-architecture',
    name: 'Modern Glass Architecture & Water Feature',
    seoTitle: 'Contemporary Architectural Glass Wing & Relaxing Outdoor Water Fountain',
    category: 'Architecture & Leisure',
    badge: 'Modern Hospitality Design',
    badgeColor: '#2563EB',
    image: '/images/super-e-hotel-glass-architecture-water-fountain-keffi.jpg',
    imageAlt:
      'Super E Luxury Hotel Contemporary Architectural Glass Facade Wing and Outdoor Water Fountain Feature in Keffi Nasarawa State',
    caption:
      'Striking blue-tinted reflective curtain wall glass architecture, balcony verandas, and soothing outdoor fountain basin.',
    description:
      'Designed with contemporary elegance, the hotel building features floor-to-ceiling reflective glass curtain walls that flood the interiors with natural daylight while reflecting heat. An outdoor decorative water fountain feature creates a tranquil, refreshing ambiance for evening relaxation, social photo sessions, and open-air conversation.',
    highlights: [
      'Reflective Sun-Filtering Blue Glass Architecture',
      'Relaxing Outdoor Fountain Water Feature',
      'Open-Air Balcony Verandas with Scenic Views',
      'Independent High-Efficiency Inverter AC Units',
      'Instagrammable Photo Opportunities',
    ],
  },
];

const GENERAL_AMENITIES = [
  { name: 'Grand Event & Conference Hall', description: '500-capacity multi-purpose event hall with commercial AC, acoustic stage, and backup power for weddings, summits, and seminars.', icon: <CalendarCheck size={28} /> },
  { name: 'VIP Lounge & Stocked Bar', description: 'Exclusive executive relaxation lounge featuring over 80+ chilled beers, imported wines, champagnes, spirits, and weekend DJ entertainment.', icon: <Wine size={28} /> },
  { name: 'Uninterrupted 24/7 Power', description: 'Heavy-duty industrial generator system ensuring 100% constant power for air conditioning, lighting, and gadget charging with zero blackouts.', icon: <Zap size={28} /> },
  { name: 'High-Speed Wi-Fi', description: 'Dedicated high-speed wireless internet covering all rooms, lobbies, and restaurant areas for business productivity and streaming.', icon: <Wifi size={28} /> },
  { name: 'Climate-Controlled Air Conditioning', description: 'Individual remote-controlled split AC units in every guest room and common lounge for personalized indoor comfort.', icon: <Snowflake size={28} /> },
  { name: '24/7 Instant Hot Water', description: 'High-capacity water heating systems in all bathrooms providing soothing, uninterrupted hot showers at any hour.', icon: <Droplets size={28} /> },
  { name: 'Flat Screen Satellite TVs', description: 'Ultra-clear LED smart TVs with premium DSTV sports, news, and entertainment channels in every room category.', icon: <Tv size={28} /> },
  { name: 'In-Room Dining & Room Service', description: 'Full breakfast, lunch, dinner, and late-night snacks delivered promptly to your room door with fresh dining trays.', icon: <ConciergeBell size={28} /> },
  { name: 'Laundry & Garment Care', description: 'Professional washing, dry cleaning, and crisp garment pressing service available same-day for traveling guests.', icon: <Shirt size={28} /> },
  { name: 'Round-the-Clock Security', description: 'Trained security personnel, security checkpoints, and CCTV monitoring ensuring complete peace of mind throughout your stay.', icon: <Shield size={28} /> },
  { name: 'Front Desk Safety Deposit', description: 'Secure front desk custody vaults for safe storage of cash, jewelry, confidential documents, and sensitive valuables.', icon: <Lock size={28} /> },
  { name: 'VIP Concierge & Travel Desk', description: 'Local taxi bookings, airport shuttle arrangement, Keffi navigation guidance, and customized guest assistance.', icon: <Star size={28} /> },
];

export default function FacilitiesPage() {
  // Structured Schema.org JSON-LD for Google Images and Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: HOTEL_INFO.name,
    description:
      'Premier luxury hospitality destination in Keffi, Nasarawa State, featuring 24/7 Front Desk, Commercial Restaurant Kitchen, Secure Shaded Car Parking, and Modern Architectural Glass Wings.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOTEL_INFO.address,
      addressLocality: HOTEL_INFO.city,
      addressRegion: HOTEL_INFO.state,
      addressCountry: HOTEL_INFO.country,
    },
    telephone: HOTEL_INFO.hotlines[0],
    email: HOTEL_INFO.email,
    image: PHOTO_FACILITIES.map((f) => `https://super-ehotel.vercel.app${f.image}`),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Super E Hotel Facilities',
      itemListElement: PHOTO_FACILITIES.map((f, i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: f.name,
          description: f.description,
          image: `https://super-ehotel.vercel.app${f.image}`,
        },
      })),
    },
  };

  return (
    <>
      {/* Inject Google SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════════════════════════════════
          PAGE HERO HEADER
          ═══════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          paddingTop: 'calc(75px + var(--space-2xl))',
          paddingBottom: 'var(--space-2xl)',
          color: '#FFFFFF',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="section-container" style={{ padding: '0 1rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(202, 138, 4, 0.25)',
              border: '1px solid rgba(202, 138, 4, 0.5)',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              color: 'var(--color-accent-light)',
              fontWeight: 800,
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Sparkles size={14} /> Official Verified Hotel Facilities &amp; Amenities
          </div>

          <h1
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(1.85rem, 5vw, 2.75rem)',
              fontWeight: 800,
              margin: '0.25rem 0 0.75rem',
              lineHeight: 1.2,
            }}
          >
            Hotel Facilities &amp; Modern Amenities
          </h1>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '680px',
              margin: '0 auto 1.5rem',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Take a visual tour of Super E Luxury Hotel &amp; Suites, Keffi. From our 24/7 computerized front desk reception and hygienic commercial restaurant kitchen to our secure shaded car parking and contemporary glass architecture.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" className="btn btn-accent btn-sm">
              Book a Room
            </Link>
            <Link href="/rooms" className="btn btn-outline-white btn-sm">
              Explore 8 Room Tiers
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED VISUAL FACILITIES SHOWCASE
          (Optimized for Google Image Search Ranking)
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: '#F8FAFC', paddingBottom: '3rem' }}>
        <div className="section-container">
          <div className="section-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <p className="section-label" style={{ color: '#D97706', fontWeight: 800, letterSpacing: '0.08em' }}>
              VISUAL TOUR &amp; VERIFIED INFRASTRUCTURE
            </p>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', fontWeight: 800 }}>
              On-Site Facilities at Super E Luxury Hotel
            </h2>
            <div className="divider" />
            <p className="section-description" style={{ maxWidth: '640px', margin: '0 auto' }}>
              Real high-resolution photographs of our premises, guest check-in lounges, culinary centers, and secure vehicle accommodations in Keffi, Nasarawa State.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {PHOTO_FACILITIES.map((facility, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  key={facility.id}
                  id={facility.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: isEven ? 'row' : 'row-reverse',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                  }}
                >
                  {/* Photo Container with Semantic <figure> for Google Images */}
                  <figure
                    style={{
                      flex: '1 1 360px',
                      minHeight: '340px',
                      position: 'relative',
                      margin: 0,
                      backgroundColor: '#0F172A',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={facility.image}
                      alt={facility.imageAlt}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={88}
                      priority={index < 2}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#FFFFFF',
                        backdropFilter: 'blur(4px)',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <Camera size={13} /> Verified Hotel Facility
                    </div>

                    <figcaption
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '0.65rem 1rem',
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.75rem',
                        fontStyle: 'italic',
                      }}
                    >
                      {facility.caption}
                    </figcaption>
                  </figure>

                  {/* Descriptive Text & SEO Headlines */}
                  <div
                    style={{
                      flex: '1 1 420px',
                      padding: '2rem 1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '6px',
                          backgroundColor: `${facility.badgeColor}15`,
                          color: facility.badgeColor,
                          border: `1px solid ${facility.badgeColor}35`,
                          textTransform: 'uppercase',
                        }}
                      >
                        {facility.category}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ShieldCheck size={13} color="#059669" /> {facility.badge}
                      </span>
                    </div>

                    {/* SEO-Optimized Heading */}
                    <h2
                      style={{
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.55rem)',
                        fontWeight: 800,
                        color: '#0F172A',
                        lineHeight: 1.3,
                        margin: '0 0 0.85rem',
                      }}
                    >
                      {facility.seoTitle}
                    </h2>

                    <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
                      {facility.description}
                    </p>

                    {/* Highlights bullet points */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          color: '#1E293B',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.6rem',
                        }}
                      >
                        Key Amenities &amp; Standards:
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.45rem' }}>
                        {facility.highlights.map((h, hIdx) => (
                          <li
                            key={hIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: '#334155',
                            }}
                          >
                            <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0 }} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Link
                        href="/book"
                        className="btn btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: '#1E3A8A',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                        }}
                      >
                        Reserve Room with this Facility <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COMPREHENSIVE HOTEL AMENITIES DIRECTORY
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="section-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label" style={{ color: '#D97706', fontWeight: 800 }}>COMPLETE DIRECTORY</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800 }}>
              All Hotel Facilities &amp; Guest Services
            </h2>
            <div className="divider" />
            <p className="section-description" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Every feature designed to guarantee comfort, safety, and productivity throughout your stay in Keffi.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {GENERAL_AMENITIES.map((facility, index) => (
              <div
                key={facility.name}
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(30, 58, 138, 0.08)',
                    color: '#1E3A8A',
                    flexShrink: 0,
                  }}
                >
                  {facility.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.35rem', color: '#0F172A' }}>
                    {facility.name}
                  </h3>
                  <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: '0.85rem', margin: 0 }}>
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONTACT & LOCATION CTA
          ═══════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
          color: '#FFFFFF',
          padding: '3rem 1rem',
          textAlign: 'center',
        }}
      >
        <div className="section-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Ready to Experience Super E Luxury?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Book direct online for best room rate guarantees, or reach out to our front desk concierge directly for event bookings, hall rentals, and airport pickups.
          </p>
          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" className="btn btn-accent btn-md">
              Book Your Stay Online
            </Link>
            <a
              href={`tel:${HOTEL_INFO.hotlines[0]}`}
              className="btn btn-outline-white btn-md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Phone size={16} /> Call Front Desk: {HOTEL_INFO.hotlines[0]}
            </a>
          </div>
          <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)' }}>
            📍 {HOTEL_INFO.address}
          </p>
        </div>
      </section>
    </>
  );
}
