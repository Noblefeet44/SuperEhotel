import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  Users, Bed, Maximize, Check, ArrowRight,
  ChevronRight, Shield, Phone
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Static Room Data
const ROOMS_DATA = [
  {
    slug: 'standard-room',
    name: 'Standard Room',
    category: 'Standard',
    price: 25000,
    maxGuests: 2,
    bedType: 'Queen',
    roomSize: '25 sqm',
    image: '/images/standard-room.jpg',
    description: 'Our Standard Room offers a comfortable retreat with all essential amenities. Perfect for solo travelers or couples seeking a pleasant, quiet stay in Keffi with 24/7 hot water, high-speed Wi-Fi, and climate control.',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Free High-Speed Wi-Fi', '24/7 Hot Water', 'Wardrobe', 'Executive Desk', 'Room Service'],
    gallery: ['/images/standard-room.jpg', '/images/hotel-exterior.jpg'],
    highlights: ['Quiet and cozy atmosphere', 'Dedicated work desk', '24/7 Uninterrupted power supply', 'Daily housekeeping'],
  },
  {
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    category: 'Deluxe',
    price: 40000,
    maxGuests: 2,
    bedType: 'King',
    roomSize: '35 sqm',
    image: '/images/deluxe-room.jpg',
    description: 'Step up to our Deluxe Room for a more spacious and refined experience. Featuring premium plush furnishings, enhanced amenities, a cozy sitting area, and full climate control for an elevated luxury stay.',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Free High-Speed Wi-Fi', '24/7 Hot Water', 'Mini Fridge', 'Wardrobe', 'Sitting Area', 'Executive Desk', 'Room Service'],
    gallery: ['/images/deluxe-room.jpg', '/images/hotel-lobby.jpg'],
    highlights: ['Spacious lounge area', 'Premium King size bed', 'Refrigerated refreshments', 'Express room service'],
  },
  {
    slug: 'executive-room',
    name: 'Executive Room',
    category: 'Executive',
    price: 60000,
    maxGuests: 2,
    bedType: 'King',
    roomSize: '45 sqm',
    image: '/images/executive-room.jpg',
    description: 'Our Executive Room is designed for guests who demand excellence. Enjoy a sophisticated space with premium amenities, a dedicated executive workspace, luxury bath products, and priority concierge care.',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Free High-Speed Wi-Fi', '24/7 Hot Water', 'Mini Bar', 'Refrigerator', 'Sitting Area', 'Executive Desk', 'Bathrobe', 'Complimentary Luxury Toiletries'],
    gallery: ['/images/executive-room.jpg', '/images/hotel-exterior.jpg'],
    highlights: ['Executive business suite desk', 'Fully stocked mini bar', 'Luxury bath robes & slippers', 'VIP concierge service'],
  },
  {
    slug: 'vip-luxury-suite',
    name: 'VIP Luxury Suite',
    category: 'VIP Suite',
    price: 100000,
    maxGuests: 4,
    bedType: 'King (Premium)',
    roomSize: '70 sqm',
    image: '/images/vip-suite.jpg',
    description: 'The pinnacle of luxury at Super E Hotel. Our VIP Suite offers an expansive living room, dining area, premium furnishings, and exclusive amenities for an unforgettable royal experience in Keffi.',
    facilities: ['Air Conditioning', 'Smart TV with Cable', 'High-Speed Wi-Fi', '24/7 Hot Water', 'Full Mini Bar', 'Refrigerator', 'Living Room', 'Dining Area', 'Executive Desk', 'Premium Bathroom', 'Bathrobe & Slippers', 'Complimentary Luxury Toiletries', 'Priority Room Service'],
    gallery: ['/images/vip-suite.jpg', '/images/restaurant-interior.jpg'],
    highlights: ['Separate living & dining quarters', 'Spacious master suite bed', 'Panoramic view', 'Priority 24/7 room service & VIP access'],
  },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ROOMS_DATA.map((room) => ({
    slug: room.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = ROOMS_DATA.find((r) => r.slug === slug);
  if (!room) return { title: 'Room Not Found | Super E Luxury Hotel' };

  return {
    title: `${room.name} | Super E Luxury Hotel & Suites Keffi`,
    description: room.description,
    openGraph: {
      title: `${room.name} - Super E Luxury Hotel`,
      description: room.description,
      images: [room.image],
    },
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params;
  const room = ROOMS_DATA.find((r) => r.slug === slug);

  if (!room) {
    notFound();
  }

  const otherRooms = ROOMS_DATA.filter((r) => r.slug !== slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: room.name,
    description: room.description,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: room.maxGuests,
    },
    offers: {
      '@type': 'Offer',
      price: room.price,
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        paddingTop: 'calc(80px + var(--space-2xl))',
        paddingBottom: 'var(--space-2xl)',
      }}>
        <div className="section-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/rooms" style={{ color: 'rgba(255,255,255,0.8)' }}>Rooms</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#FFFFFF' }}>{room.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge" style={{ background: 'rgba(202, 138, 4, 0.2)', color: 'var(--color-accent-light)', marginBottom: '0.5rem' }}>
                {room.category}
              </span>
              <h1 style={{ color: '#FFFFFF', margin: 0 }}>{room.name}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-accent-light)' }}>
                {formatPrice(room.price)}
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}> / night</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section-padding">
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)', alignItems: 'start' }}>
              {/* Left Column: Image & Details */}
              <div>
                <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '360px', position: 'relative', boxShadow: 'var(--shadow-lg)', marginBottom: 'var(--space-lg)' }}>
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>

                {/* Spec Icons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--color-surface)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)', marginBottom: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Users size={22} style={{ color: 'var(--color-primary)', margin: '0 auto 0.25rem' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Capacity</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Up to {room.maxGuests} Guests</div>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid var(--color-border-light)', borderRight: '1px solid var(--color-border-light)' }}>
                    <Bed size={22} style={{ color: 'var(--color-primary)', margin: '0 auto 0.25rem' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Bed Type</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{room.bedType}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Maximize size={22} style={{ color: 'var(--color-primary)', margin: '0 auto 0.25rem' }} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Room Size</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{room.roomSize}</div>
                  </div>
                </div>

                <h3 style={{ marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Overview</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {room.description}
                </p>

                <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Highlights</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                  {room.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.925rem' }}>
                      <Check size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Room Amenities</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {room.facilities.map((fac, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-muted)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                      <Check size={16} style={{ color: 'var(--color-accent)' }} />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Booking Card */}
              <div>
                <div style={{ position: 'sticky', top: '100px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: 'var(--shadow-xl)' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Reserve {room.name}</h3>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '1.25rem' }}>
                    {formatPrice(room.price)}
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}> / night</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                    <Link
                      href={`/book?room=${room.slug}`}
                      className="btn btn-accent btn-lg"
                      style={{ width: '100%', justifyContent: 'center' }}
                      prefetch={true}
                    >
                      Book Online Now <ArrowRight size={18} />
                    </Link>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shield size={16} style={{ color: 'var(--color-primary)' }} />
                      <span>Instant confirmation & 24/7 reception</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={16} style={{ color: 'var(--color-primary)' }} />
                      <span>Direct Front Desk: 09131964939</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Rooms Section */}
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--color-border-light)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Explore Other Accommodations</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {otherRooms.map((other) => (
                <div key={other.slug} className="card">
                  <div style={{ height: '180px', position: 'relative' }}>
                    <Image src={other.image} alt={other.name} fill style={{ objectFit: 'cover' }} sizes="300px" />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{other.name}</h3>
                    <div style={{ fontWeight: 700, color: 'var(--color-accent)', marginBottom: '1rem' }}>{formatPrice(other.price)} / night</div>
                    <Link href={`/rooms/${other.slug}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }} prefetch={true}>
                      View Room Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
