import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  Users, Bed, Maximize, Check, ArrowRight,
  ChevronRight, Shield, Phone, Sparkles, ShieldCheck, Clock
} from 'lucide-react';
import { formatPrice, generatePhoneURL, generateWhatsAppURL } from '@/lib/utils';
import { INITIAL_ROOMS_DATA, HOTEL_INFO, HOTEL_POLICIES } from '@/lib/hotel-data';
import { RoomImageCarousel } from '@/components/rooms/RoomImageCarousel';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INITIAL_ROOMS_DATA.map((room) => ({
    slug: room.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = INITIAL_ROOMS_DATA.find(
    (r) => r.slug === slug || r.id === slug || `${r.slug}-room` === slug || (slug === 'vip-luxury-suite' && r.slug === 'presidential-suite')
  );
  if (!room) return { title: 'Room Not Found | Super E Luxury Hotel' };

  return {
    title: `${room.name} — ₦${room.price.toLocaleString()} | Super E Luxury Hotel & Suites Keffi`,
    description: room.description,
    openGraph: {
      title: `${room.name} — Super E Luxury Hotel`,
      description: room.description,
      images: [room.image],
    },
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params;
  const room = INITIAL_ROOMS_DATA.find(
    (r) => r.slug === slug || r.id === slug || `${r.slug}-room` === slug || (slug === 'vip-luxury-suite' && r.slug === 'presidential-suite')
  );

  if (!room) {
    notFound();
  }

  const otherRooms = INITIAL_ROOMS_DATA.filter((r) => r.slug !== slug).slice(0, 3);

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
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          paddingTop: 'calc(65px + var(--space-xl))',
          paddingBottom: 'var(--space-2xl)',
          color: '#FFFFFF',
        }}
      >
        <div className="section-container" style={{ padding: '0 1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.8rem',
              marginBottom: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/" style={{ color: 'rgba(255,255,255,0.8)' }}>Home</Link>
            <ChevronRight size={13} />
            <Link href="/rooms" style={{ color: 'rgba(255,255,255,0.8)' }}>Rooms</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#FFFFFF' }}>{room.name}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(202, 138, 4, 0.25)',
                  color: 'var(--color-accent-light)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '0.35rem',
                }}
              >
                {room.category}
              </span>
              <h1 style={{ color: '#FFFFFF', margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                {room.name}
              </h1>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--color-accent-light)' }}>
                {formatPrice(room.price)}
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}> / night</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#FDE047', textAlign: 'right' }}>
                Inclusive of 10% Service &amp; 7% VAT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section style={{ padding: 'var(--space-xl) 0', paddingBottom: 'calc(var(--space-3xl) + 60px)' }}>
        <div className="section-container" style={{ padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            {/* Left Column: Image, Amenities & Policy Checklist */}
            <div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }}>
                <RoomImageCarousel
                  images={room.images && room.images.length > 0 ? room.images : [room.image]}
                  fallbackImage={room.image}
                  roomName={room.name}
                  facilities={room.facilities}
                  height="clamp(280px, 42vw, 440px)"
                  showThumbnails={true}
                  priority={true}
                  badge={
                    <span
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#FFFFFF',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {room.category} Tier
                    </span>
                  }
                />
              </div>

              {/* Spec Icons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  background: 'var(--color-surface)',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                }}
              >
                <div>
                  <Users size={18} style={{ color: 'var(--color-primary)', margin: '0 auto 0.2rem' }} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Capacity</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Up to {room.maxGuests}</div>
                </div>
                <div style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                  <Bed size={18} style={{ color: 'var(--color-primary)', margin: '0 auto 0.2rem' }} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Bed Type</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{room.bedType}</div>
                </div>
                <div>
                  <Maximize size={18} style={{ color: 'var(--color-primary)', margin: '0 auto 0.2rem' }} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Room Size</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{room.roomSize}</div>
                </div>
              </div>

              {/* Overview */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Room Description
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {room.description}
                </p>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                  Included Room Amenities
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem' }}>
                  {room.facilities.map((fac, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: '#F8FAFC',
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      <Check size={14} style={{ color: '#16A34A', flexShrink: 0 }} />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Essential Hotel Policies for this stay */}
              <div
                style={{
                  background: '#FEFCE8',
                  border: '1px solid #FEF08A',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={18} style={{ color: '#A16207' }} />
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#854D0E' }}>
                    Important Guest Policies
                  </h4>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#713F12', lineHeight: 1.6 }}>
                  <li><strong>Check-out Time:</strong> Strictly 12:00 Noon. Late check-out between 12-3 PM attracts 50% charge; after 3 PM attracts 100%.</li>
                  <li><strong>Guaranteed Booking:</strong> Reservations are confirmed only after verified payment.</li>
                  <li><strong>5:00 PM Release:</strong> Unpaid bookings are automatically released after 5:00 PM on arrival date.</li>
                  <li><strong>Safe Custody:</strong> All money &amp; valuables must be deposited at the front desk.</li>
                  <li><strong>Cancellations:</strong> Cancellations under 24 hours attract a 50% surcharge.</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Mobile-first Sticky Booking Card */}
            <div>
              <div
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  position: 'sticky',
                  top: '80px',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Reserve this room</span>
                <h3 style={{ margin: '0.2rem 0 0.5rem', fontSize: '1.2rem' }}>{room.name}</h3>

                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  {formatPrice(room.price)}
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 400 }}> / night</span>
                </div>
                <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>
                  ✓ 10% Service Charge &amp; 7% VAT included
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <Link
                    href={`/book?room=${room.slug}`}
                    className="btn btn-accent btn-block"
                    style={{ justifyContent: 'center', fontSize: '1rem', padding: '0.85rem 1rem', fontWeight: 700 }}
                    prefetch={true}
                  >
                    Reserve &amp; Pay Online <ArrowRight size={18} />
                  </Link>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem', color: '#64748B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Clock size={15} style={{ color: '#D97706' }} />
                    <span>Check-out time: 12:00 Noon</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Shield size={15} style={{ color: '#16A34A' }} />
                    <span>24/7 Power, Hot Water &amp; Front Desk</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Phone size={15} style={{ color: '#1E3A8A' }} />
                    <a href={generatePhoneURL(HOTEL_INFO.hotlines[0])} style={{ color: '#1E3A8A', fontWeight: 600 }}>
                      Hotline: {HOTEL_INFO.hotlines[0]}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Other Accommodations */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontSize: '1.3rem' }}>
              Other Rooms &amp; Suites
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {otherRooms.map((other) => (
                <div key={other.slug} className="card" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ height: '160px', position: 'relative' }}>
                    <Image src={other.image} alt={other.name} fill style={{ objectFit: 'cover' }} sizes="300px" />
                  </div>
                  <div style={{ padding: '0.85rem' }}>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem' }}>{other.name}</h3>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      {formatPrice(other.price)} / night
                    </div>
                    <Link
                      href={`/rooms/${other.slug}`}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', justifyContent: 'center' }}
                      prefetch={true}
                    >
                      View Details
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
