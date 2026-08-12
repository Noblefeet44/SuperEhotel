import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Users, Bed, Maximize, ChevronRight, MessageCircle } from 'lucide-react';
import { formatPrice, generateWhatsAppURL } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Rooms & Suites | Super E Luxury Hotel & Suites',
  description: 'Browse our premium rooms and suites at Super E Luxury Hotel, Keffi. From Standard Rooms to VIP Luxury Suites. Book your perfect accommodation.',
};

const roomCategories = [
  { slug: 'all', name: 'All Rooms' },
  { slug: 'standard', name: 'Standard' },
  { slug: 'deluxe', name: 'Deluxe' },
  { slug: 'executive', name: 'Executive' },
  { slug: 'vip-luxury-suite', name: 'VIP Suite' },
];

const rooms = [
  {
    slug: 'standard-room',
    category: 'standard',
    name: 'Standard Room',
    price: 25000,
    maxGuests: 2,
    bedType: 'Queen',
    roomSize: '25 sqm',
    image: '/images/standard-room.jpg',
    description: 'Our Standard Room offers a comfortable retreat with all essential amenities. Perfect for solo travelers or couples seeking a pleasant stay in Keffi.',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Wi-Fi', 'Hot Water', 'Wardrobe', 'Desk'],
    status: 'available' as const,
  },
  {
    slug: 'deluxe-room',
    category: 'deluxe',
    name: 'Deluxe Room',
    price: 40000,
    maxGuests: 2,
    bedType: 'King',
    roomSize: '35 sqm',
    image: '/images/deluxe-room.jpg',
    description: 'Step up to our Deluxe Room for a more spacious and refined experience. Featuring premium furnishings and enhanced amenities for a truly comfortable stay.',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Wi-Fi', 'Hot Water', 'Mini Fridge', 'Wardrobe', 'Sitting Area', 'Desk'],
    status: 'available' as const,
  },
  {
    slug: 'executive-room',
    category: 'executive',
    name: 'Executive Room',
    price: 60000,
    maxGuests: 2,
    bedType: 'King',
    roomSize: '45 sqm',
    image: '/images/executive-room.jpg',
    description: 'Our Executive Room is designed for guests who demand excellence. Enjoy a sophisticated space with premium amenities and a dedicated work area.',
    facilities: ['Air Conditioning', 'Flat Screen TV', 'Wi-Fi', 'Hot Water', 'Mini Bar', 'Refrigerator', 'Sitting Area', 'Executive Desk', 'Bathrobe', 'Complimentary Toiletries'],
    status: 'available' as const,
  },
  {
    slug: 'vip-luxury-suite',
    category: 'vip-luxury-suite',
    name: 'VIP Luxury Suite',
    price: 100000,
    maxGuests: 4,
    bedType: 'King (Premium)',
    roomSize: '70 sqm',
    image: '/images/vip-suite.jpg',
    description: 'The pinnacle of luxury at Super E Hotel. Our VIP Suite offers an expansive living space, premium furnishings, and exclusive amenities for an unforgettable experience.',
    facilities: ['Air Conditioning', 'Smart TV', 'High-Speed Wi-Fi', 'Hot Water', 'Full Mini Bar', 'Refrigerator', 'Living Room', 'Dining Area', 'Executive Desk', 'Premium Bathroom', 'Bathrobe & Slippers', 'Complimentary Toiletries', 'Room Service Priority'],
    status: 'available' as const,
  },
];

export default function RoomsPage() {
  return (
    <>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        paddingTop: 'calc(80px + var(--space-3xl))',
        paddingBottom: 'var(--space-3xl)',
      }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Accommodation</p>
          <h1 style={{ color: '#FFFFFF', marginBottom: 'var(--space-md)' }}>Our Rooms &amp; Suites</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            From comfortable standard rooms to our exquisite VIP Luxury Suite, find the perfect space for your stay.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)', position: 'sticky', top: '64px', zIndex: 30 }}>
        <div className="section-container">
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            overflowX: 'auto',
            padding: 'var(--space-md) 0',
            WebkitOverflowScrolling: 'touch',
          }}>
            {roomCategories.map((cat) => (
              <button
                key={cat.slug}
                className={cat.slug === 'all' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                style={{ whiteSpace: 'nowrap' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Room Listings */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            {rooms.map((room) => (
              <div
                key={room.slug}
                className="card-static animate-fade-in-up"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  overflow: 'hidden',
                }}
              >
                {/* Mobile: stacked layout, Desktop: side by side */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                }}>
                  {/* Image */}
                  <div style={{
                    position: 'relative',
                    height: '260px',
                    overflow: 'hidden',
                  }}>
                    <Image
                      src={room.image}
                      alt={room.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                    }}>
                      <span className="badge" style={{
                        background: room.status === 'available' ? 'rgba(22, 163, 74, 0.9)' : 'rgba(220, 38, 38, 0.9)',
                        color: '#FFF',
                        backdropFilter: 'blur(4px)',
                      }}>
                        {room.status === 'available' ? '✓ Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: 'var(--space-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                      <div>
                        <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', marginBottom: 'var(--space-xs)' }}>
                          {room.name}
                        </h2>
                        <div style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={16} /> {room.maxGuests} Guests
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Bed size={16} /> {room.bedType}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Maximize size={16} /> {room.roomSize}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                          {formatPrice(room.price)}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>per night</div>
                      </div>
                    </div>

                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: 1.7 }}>
                      {room.description}
                    </p>

                    {/* Facilities */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                      {room.facilities.slice(0, 6).map((facility) => (
                        <span
                          key={facility}
                          style={{
                            padding: '0.25rem 0.625rem',
                            background: 'var(--color-muted)',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {facility}
                        </span>
                      ))}
                      {room.facilities.length > 6 && (
                        <span style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8125rem',
                          color: 'var(--color-primary)',
                          fontWeight: 500,
                        }}>
                          +{room.facilities.length - 6} more
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      <Link href={`/book?room=${room.slug}`} className="btn btn-accent">
                        Book This Room
                      </Link>
                      <a
                        href={generateWhatsAppURL('09131964939', `Hello! I'm interested in your ${room.name} at ${formatPrice(room.price)}/night. Is it available?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp"
                      >
                        <MessageCircle size={18} />
                        Ask on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        padding: 'var(--space-3xl) 0',
        textAlign: 'center',
      }}>
        <div className="section-container">
          <h2 style={{ color: '#FFFFFF', marginBottom: 'var(--space-md)' }}>
            Can&apos;t Decide? Let Us Help
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
            Contact us on WhatsApp and our team will help you choose the perfect room.
          </p>
          <a
            href={generateWhatsAppURL('09131964939', 'Hello! I need help choosing a room at Super E Luxury Hotel.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
          >
            <MessageCircle size={20} />
            Chat With Us
          </a>
        </div>
      </section>
    </>
  );
}
