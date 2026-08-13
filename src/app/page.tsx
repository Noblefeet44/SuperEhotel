import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Star, Users, Bed, ChevronRight,
  Wifi, Snowflake, Tv, Droplets, Utensils, Car,
  Shield, Zap, ConciergeBell, Shirt, Dumbbell,
  MessageCircle, Phone, ArrowRight
} from 'lucide-react';
import { generateWhatsAppURL, generatePhoneURL, formatPrice } from '@/lib/utils';

// Icon mapping for facilities
const facilityIcons: Record<string, React.ReactNode> = {
  dumbbell: <Dumbbell size={24} />,
  snowflake: <Snowflake size={24} />,
  wifi: <Wifi size={24} />,
  tv: <Tv size={24} />,
  droplets: <Droplets size={24} />,
  utensils: <Utensils size={24} />,
  'concierge-bell': <ConciergeBell size={24} />,
  car: <Car size={24} />,
  'shield-check': <Shield size={24} />,
  shirt: <Shirt size={24} />,
  zap: <Zap size={24} />,
};

// Static data for initial build (will be fetched from Supabase later)
const rooms = [
  {
    slug: 'standard-room',
    name: 'Standard Room',
    price: 25000,
    maxGuests: 2,
    bedType: 'Queen',
    image: '/images/standard-room.jpg',
    description: 'Comfortable and well-appointed rooms perfect for a pleasant stay.',
  },
  {
    slug: 'deluxe-room',
    name: 'Deluxe Room',
    price: 40000,
    maxGuests: 2,
    bedType: 'King',
    image: '/images/deluxe-room.jpg',
    description: 'Spacious rooms with premium amenities for an elevated experience.',
  },
  {
    slug: 'executive-room',
    name: 'Executive Room',
    price: 60000,
    maxGuests: 2,
    bedType: 'King',
    image: '/images/executive-room.jpg',
    description: 'Sophisticated rooms designed for the discerning business traveler.',
  },
  {
    slug: 'vip-luxury-suite',
    name: 'VIP Luxury Suite',
    price: 100000,
    maxGuests: 4,
    bedType: 'King (Premium)',
    image: '/images/vip-suite.jpg',
    description: 'Our finest accommodation with unparalleled luxury and space.',
  },
];

const facilities = [
  { name: 'Air Conditioning', icon: 'snowflake', description: 'Climate-controlled rooms' },
  { name: 'Free Wi-Fi', icon: 'wifi', description: 'High-speed internet access' },
  { name: 'Flat Screen TV', icon: 'tv', description: 'Modern TVs with cable' },
  { name: 'Hot Water', icon: 'droplets', description: '24/7 hot water supply' },
  { name: 'Restaurant', icon: 'utensils', description: 'Fine Nigerian cuisine' },
  { name: 'Room Service', icon: 'concierge-bell', description: 'In-room dining' },
  { name: 'Parking', icon: 'car', description: 'Secure guest parking' },
  { name: '24/7 Security', icon: 'shield-check', description: 'Round-the-clock safety' },
  { name: 'Laundry Service', icon: 'shirt', description: 'Professional laundry' },
  { name: 'Power Supply', icon: 'zap', description: 'Constant power supply' },
];

const reviews = [
  {
    name: 'Adamu Ibrahim',
    rating: 5,
    text: 'Excellent service and very clean rooms. The staff were incredibly welcoming and the food was amazing. Will definitely come back!',
    date: 'July 2026',
  },
  {
    name: 'Grace Okonkwo',
    rating: 4,
    text: 'Beautiful hotel with great facilities. The room was spacious and comfortable. The Nigerian dishes at the restaurant were absolutely delicious.',
    date: 'July 2026',
  },
  {
    name: 'David Nwachukwu',
    rating: 5,
    text: 'Best hotel in Keffi! The VIP suite was outstanding. Perfect for my business trip. The WiFi was fast and the staff were professional.',
    date: 'August 2026',
  },
];

const featuredDishes = [
  { name: 'Jollof Rice & Chicken', price: 3500, description: 'Smoky party-style jollof rice with grilled chicken' },
  { name: 'Pounded Yam & Egusi', price: 4000, description: 'Rich melon seed soup with assorted meat' },
  { name: 'Suya (Beef)', price: 2500, description: 'Classic Nigerian spiced grilled beef skewers' },
];

export default function HomePage() {
  const whatsappNumber = '09131964939';
  const phoneNumber = '09131964939';

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="hero">
        <Image
          src="/images/hotel-exterior.jpg"
          alt="Super E Luxury Hotel & Suites aerial drone view"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={85}
        />
        <div className="hero-overlay" />
        <div className="hero-content animate-fade-in-up">
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>
            Welcome to
          </p>
          <h1>Super E Luxury<br />Hotel &amp; Suites</h1>
          <p className="hero-tagline">Luxury at Its Peak</p>
          <div className="hero-location">
            <MapPin size={18} />
            <span>Keffi, Nasarawa State, Nigeria</span>
          </div>
          <div className="hero-cta">
            <Link href="/book" className="btn btn-accent btn-lg">
              <Bed size={20} />
              Book a Room
            </Link>
            <a
              href={generateWhatsAppURL(whatsappNumber, 'Hello! I would like to book a room at Super E Luxury Hotel.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <MessageCircle size={20} />
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ROOM SHOWCASE
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-label">Accommodation</p>
            <h2 className="section-title">Our Rooms &amp; Suites</h2>
            <div className="divider" />
            <p className="section-description">
              From comfortable standard rooms to our exquisite VIP Luxury Suite, 
              find the perfect space for your stay in Keffi.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-xl)',
          }}>
            {rooms.map((room, index) => (
              <div key={room.slug} className={`room-card animate-fade-in-up animate-delay-${(index + 1) * 100}`}>
                <div className="room-card-image">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="room-card-price">
                    {formatPrice(room.price)}<span style={{ fontWeight: 400, fontSize: '0.75rem' }}>/night</span>
                  </div>
                </div>
                <div className="room-card-body">
                  <h3>{room.name}</h3>
                  <div className="room-card-meta">
                    <span><Users size={16} /> {room.maxGuests} Guests</span>
                    <span><Bed size={16} /> {room.bedType}</span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginBottom: 'var(--space-md)' }}>
                    {room.description}
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <Link href={`/rooms/${room.slug}`} className="btn btn-outline btn-sm" style={{ flex: 1 }} prefetch={true}>
                      View Details
                    </Link>
                    <Link href={`/book?room=${room.slug}`} className="btn btn-primary btn-sm" style={{ flex: 1 }} prefetch={true}>
                      Book Now
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link href="/rooms" className="btn btn-outline">
              View All Rooms <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FACILITIES
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-label">Hotel Amenities</p>
            <h2 className="section-title">Our Facilities</h2>
            <div className="divider" />
            <p className="section-description">
              Everything you need for a comfortable and enjoyable stay.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 'var(--space-lg)',
          }}>
            {facilities.map((facility, index) => (
              <div
                key={facility.name}
                className={`animate-fade-in-up animate-delay-${Math.min((index + 1) * 100, 500)}`}
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-background)',
                  border: '1px solid var(--color-border-light)',
                  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(30, 58, 138, 0.08)',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-sm)',
                }}>
                  {facilityIcons[facility.icon] || <Star size={24} />}
                </div>
                <h4 style={{ fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{facility.name}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{facility.description}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link href="/facilities" className="btn btn-outline">
              All Facilities <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          RESTAURANT PREVIEW
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-3xl)',
            alignItems: 'center',
          }}>
            <div>
              <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
                <p className="section-label">Dining</p>
                <h2 className="section-title">Our Restaurant</h2>
                <div className="divider" style={{ margin: 'var(--space-md) 0' }} />
                <p className="section-description" style={{ margin: 0, textAlign: 'left' }}>
                  Savor the finest Nigerian cuisine and international dishes at our elegant restaurant. 
                  Our skilled chefs prepare each meal with fresh, locally-sourced ingredients and authentic spices.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                {featuredDishes.map((dish) => (
                  <div key={dish.name} className="card-static" style={{ padding: 'var(--space-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                      <h4 style={{ fontSize: '1rem', flex: 1 }}>{dish.name}</h4>
                      <span style={{ 
                        color: 'var(--color-accent)', 
                        fontWeight: 600, 
                        fontSize: '0.9375rem',
                        whiteSpace: 'nowrap',
                        marginLeft: 'var(--space-sm)'
                      }}>
                        {formatPrice(dish.price)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {dish.description}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <Link href="/restaurant" className="btn btn-primary">
                  <Utensils size={18} />
                  View Full Menu
                </Link>
                <a
                  href={generateWhatsAppURL('09131964939', 'Hello! I would like to make a reservation at your restaurant.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle size={18} />
                  Reserve a Table
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GYM & FITNESS PREVIEW
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-light)' }}>
        <div className="section-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-2xl)',
            alignItems: 'center',
          }}>
            <div>
              <p className="section-label">Fitness & Wellness</p>
              <h2 className="section-title">State-of-the-Art Gym & Fitness Hall</h2>
              <div className="divider" style={{ margin: 'var(--space-md) 0' }} />
              <p className="section-description" style={{ margin: '0 0 var(--space-lg) 0', textAlign: 'left' }}>
                Stay fit during your stay with our modern, fully equipped fitness center. Featuring top cardio equipment, free weights, certified trainers, and dedicated ladies aerobics fitness studio.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <Link href="/gym" className="btn btn-accent">
                  <Dumbbell size={18} />
                  Explore Gym & Packages
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative', height: '300px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <Image
                src="/images/gym-hall.png"
                alt="Super E Gym Fitness Hall"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          REVIEWS
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-surface)' }}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-label">Testimonials</p>
            <h2 className="section-title">What Our Guests Say</h2>
            <div className="divider" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-xl)',
          }}>
            {reviews.map((review, index) => (
              <div
                key={index}
                className="card-static"
                style={{ padding: 'var(--space-xl)' }}
              >
                <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-md)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < review.rating ? '#CA8A04' : 'none'}
                      color={i < review.rating ? '#CA8A04' : '#CBD5E1'}
                    />
                  ))}
                </div>
                <p style={{
                  fontStyle: 'italic',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--space-lg)',
                  fontSize: '0.9375rem',
                }}>
                  &ldquo;{review.text}&rdquo;
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--color-foreground)' }}>{review.name}</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LOCATION
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div className="section-header">
            <p className="section-label">Find Us</p>
            <h2 className="section-title">Our Location</h2>
            <div className="divider" />
            <p className="section-description">
              Conveniently located in Keffi, Nasarawa State, Nigeria.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--space-2xl)',
            alignItems: 'start',
          }}>
            <div className="card-static" style={{ overflow: 'hidden' }}>
              <div style={{
                height: '300px',
                background: 'var(--color-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <MapPin size={48} style={{ marginBottom: 'var(--space-md)', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.9375rem' }}>Google Maps embed will be configured from the admin dashboard</p>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-lg)',
              justifyContent: 'center',
            }}>
              <a href={generatePhoneURL(phoneNumber)} className="btn btn-primary btn-lg">
                <Phone size={20} />
                Call Us: {phoneNumber}
              </a>
              <a
                href={generateWhatsAppURL(whatsappNumber, 'Hello! I need directions to Super E Luxury Hotel in Keffi.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={20} />
                Get Directions via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        padding: 'var(--space-4xl) 0',
      }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Ready to Experience Luxury?</p>
          <h2 style={{
            color: '#FFFFFF',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            marginBottom: 'var(--space-md)',
          }}>
            Book Your Stay at Super E Luxury Hotel
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '600px',
            margin: '0 auto var(--space-2xl)',
            fontSize: '1.05rem',
          }}>
            Experience unparalleled luxury, exceptional service, and the finest Nigerian hospitality. 
            Your perfect stay in Keffi awaits.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" className="btn btn-accent btn-lg">
              <Bed size={20} />
              Book a Room Now
            </Link>
            <a
              href={generateWhatsAppURL(whatsappNumber, 'Hello! I would like to book a room at Super E Luxury Hotel.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-white btn-lg"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
