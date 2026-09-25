'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users, Bed, Maximize, ChevronRight, Check, ShieldCheck,
  Clock, AlertCircle, Sparkles
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import {
  RoomCategoryData, HOTEL_INFO,
  getStoredRoomsData
} from '@/lib/hotel-data';
import { RoomImageCarousel } from '@/components/rooms/RoomImageCarousel';
import { HotelPoliciesModal } from '@/components/common/HotelPoliciesModal';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomCategoryData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showPolicies, setShowPolicies] = useState<boolean>(false);

  useEffect(() => {
    setRooms(getStoredRoomsData());

    const handleUpdate = () => {
      setRooms(getStoredRoomsData());
    };
    window.addEventListener('super_e_rooms_updated', handleUpdate);
    return () => window.removeEventListener('super_e_rooms_updated', handleUpdate);
  }, []);

  const categories = [
    { slug: 'all', name: 'All Rooms (8)' },
    { slug: 'standard', name: 'Standard' },
    { slug: 'deluxe', name: 'Deluxe Series' },
    { slug: 'luxury', name: 'Luxury' },
    { slug: 'executive', name: 'Executive Series' },
    { slug: 'presidential', name: 'Presidential' },
  ];

  const filteredRooms = rooms.filter((r) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'deluxe') return r.slug.startsWith('deluxe');
    if (activeCategory === 'executive') return r.slug.startsWith('executive');
    return r.category.toLowerCase().includes(activeCategory);
  });

  return (
    <>
      {/* Page Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          paddingTop: 'calc(65px + var(--space-xl))',
          paddingBottom: 'var(--space-2xl)',
          color: '#FFFFFF',
        }}
      >
        <div className="section-container" style={{ textAlign: 'center', padding: '0 1rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(202, 138, 4, 0.2)',
              border: '1px solid rgba(202, 138, 4, 0.4)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              color: 'var(--color-accent-light)',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={14} /> Official Rates &amp; Room Types
          </div>

          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', margin: '0.25rem 0 0.5rem' }}>
            Rooms &amp; Luxury Suites
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: '560px',
              margin: '0 auto',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            {HOTEL_INFO.name} — All rates are fully inclusive of 10% Service Charge and 7% VAT. Check-out time: 12 Noon.
          </p>

          {/* Policy quick banner */}
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setShowPolicies(true)}
              type="button"
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '9999px',
                padding: '0.35rem 0.9rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
              }}
            >
              <ShieldCheck size={14} style={{ color: '#FDE047' }} />
              View Hotel Policies (Check-out, Surcharges &amp; Security)
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter Bar (Mobile Horizontal Swipe) */}
      <section
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: '56px',
          zIndex: 25,
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div className="section-container" style={{ padding: '0 1rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              padding: '0.65rem 0',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                type="button"
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: activeCategory === cat.slug ? 'none' : '1px solid #CBD5E1',
                  backgroundColor: activeCategory === cat.slug ? 'var(--color-primary)' : '#FFFFFF',
                  color: activeCategory === cat.slug ? '#FFFFFF' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Listing Grid (Mobile Priority) */}
      <section style={{ padding: 'var(--space-xl) 0', minHeight: '60vh' }}>
        <div className="section-container" style={{ padding: '0 1rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredRooms.map((room) => {
              const availableUnits = room.units.filter((u) => u.status === 'available').length;
              const isAvailable = availableUnits > 0;

              return (
                <div
                  key={room.slug}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Interactive Room Image Carousel */}
                  <RoomImageCarousel
                    images={room.images && room.images.length > 0 ? room.images : [room.image]}
                    fallbackImage={room.image}
                    roomName={room.name}
                    facilities={room.facilities}
                    height="230px"
                    priority={room.isFeatured}
                    badge={
                      <>
                        <span
                          style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.85)',
                            color: '#FFFFFF',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {room.category}
                        </span>

                        {room.isFeatured && (
                          <span
                            style={{
                              backgroundColor: '#CA8A04',
                              color: '#FFFFFF',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                            }}
                          >
                            Featured
                          </span>
                        )}

                        <span
                          style={{
                            backgroundColor: isAvailable ? 'rgba(22, 163, 74, 0.9)' : 'rgba(220, 38, 38, 0.9)',
                            color: '#FFFFFF',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backdropFilter: 'blur(4px)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                            }}
                          />
                          {isAvailable ? `${availableUnits} Available` : 'Fully Occupied'}
                        </span>
                      </>
                    }
                  />

                  {/* Room Details Body */}
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                        {room.name}
                      </h3>
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                          ₦{room.price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}> / night</span>
                      </div>
                    </div>

                    {/* Meta specs */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.85rem',
                        fontSize: '0.78rem',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Bed size={14} style={{ color: 'var(--color-accent)' }} />
                        {room.bedType}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Maximize size={14} style={{ color: 'var(--color-accent)' }} />
                        {room.roomSize}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={14} style={{ color: 'var(--color-accent)' }} />
                        Max {room.maxGuests}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 0.85rem 0', flex: 1 }}>
                      {room.description}
                    </p>

                    {/* Amenities pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {room.facilities.slice(0, 4).map((f) => (
                        <span
                          key={f}
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            fontWeight: 500,
                          }}
                        >
                          {f}
                        </span>
                      ))}
                      {room.facilities.length > 4 && (
                        <span style={{ fontSize: '0.7rem', color: '#64748B', alignSelf: 'center' }}>
                          +{room.facilities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                      <Link
                        href={`/rooms/${room.slug}`}
                        className="btn btn-secondary btn-sm"
                        style={{ textAlign: 'center', justifyContent: 'center', fontSize: '0.8rem' }}
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/book?room=${room.slug}`}
                        className="btn btn-primary btn-sm"
                        style={{ textAlign: 'center', justifyContent: 'center', fontSize: '0.8rem' }}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hotel Policy Bottom Sheet */}
      <HotelPoliciesModal isOpen={showPolicies} onClose={() => setShowPolicies(false)} />
    </>
  );
}
