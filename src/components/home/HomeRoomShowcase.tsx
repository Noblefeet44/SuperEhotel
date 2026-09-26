'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Bed, ChevronRight } from 'lucide-react';
import { RoomCategoryData, getStoredRoomsData, INITIAL_ROOMS_DATA } from '@/lib/hotel-data';
import { RoomImageCarousel } from '@/components/rooms/RoomImageCarousel';
import { formatPrice } from '@/lib/utils';

interface HomeRoomShowcaseProps {
  initialRooms?: RoomCategoryData[];
}

export function HomeRoomShowcase({ initialRooms }: HomeRoomShowcaseProps) {
  const [rooms, setRooms] = useState<RoomCategoryData[]>(() => {
    if (initialRooms && initialRooms.length > 0) return initialRooms;
    return INITIAL_ROOMS_DATA;
  });

  useEffect(() => {
    // 1. Load from client storage immediately
    const stored = getStoredRoomsData();
    if (stored && stored.length > 0) {
      setRooms(stored);
    }

    // 2. Fetch live from server API to guarantee cross-device sync
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        const live = Array.isArray(data) ? data : (data.rooms || []);
        if (live.length > 0) {
          setRooms(live);
        }
      })
      .catch((err) => console.warn('Could not fetch latest rooms:', err));

    // 3. Listen for immediate admin room/image edits
    const handleUpdate = () => {
      setRooms(getStoredRoomsData());
    };
    window.addEventListener('super_e_rooms_updated', handleUpdate);
    return () => window.removeEventListener('super_e_rooms_updated', handleUpdate);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'var(--space-xl)',
      }}
    >
      {rooms.map((room, index) => {
        const roomImages = room.images && room.images.length > 0 ? room.images : [room.image];
        return (
          <div
            key={room.slug || room.id}
            className={`room-card animate-fade-in-up animate-delay-${Math.min((index + 1) * 100, 800)}`}
          >
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <RoomImageCarousel
                images={roomImages}
                fallbackImage={room.image || '/images/standard-room.jpg'}
                roomName={room.name}
                facilities={room.facilities}
                height="210px"
                priority={index === 0}
                badge={
                  <div className="room-card-price" style={{ position: 'static' }}>
                    {formatPrice(room.price)}
                    <span style={{ fontWeight: 400, fontSize: '0.75rem' }}>/night</span>
                  </div>
                }
              />
            </div>
            <div className="room-card-body">
              <h3>{room.name}</h3>
              <div className="room-card-meta">
                <span>
                  <Users size={16} /> {room.maxGuests} Guests
                </span>
                <span>
                  <Bed size={16} /> {room.bedType}
                </span>
              </div>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9375rem',
                  marginBottom: 'var(--space-md)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {room.description}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <Link
                  href={`/rooms/${room.slug}`}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                  prefetch={true}
                >
                  View Details
                </Link>
                <Link
                  href={`/book?room=${room.slug}`}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  prefetch={true}
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
