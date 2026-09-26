'use client';

import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import {
  ChevronLeft, ChevronRight, Maximize2, X,
  Sparkles, Check, Image as ImageIcon
} from 'lucide-react';

interface RoomImageCarouselProps {
  images: string[];
  fallbackImage?: string;
  roomName: string;
  facilities?: string[];
  height?: string;
  showThumbnails?: boolean;
  showFeatureOverlay?: boolean;
  badge?: React.ReactNode;
  priority?: boolean;
}

export function RoomImageCarousel({
  images = [],
  fallbackImage = '/images/standard-room.jpg',
  roomName,
  facilities = [],
  height = '230px',
  showThumbnails = false,
  showFeatureOverlay = true,
  badge,
  priority = false,
}: RoomImageCarouselProps) {
  // Ensure we always have at least one image
  const validImages = images && images.length > 0 ? images : [fallbackImage];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(index);
  };

  // Touch Swipe Handlers for Mobile Phones
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40; // in px
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev Image
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const safeIndex = currentIndex >= validImages.length ? Math.max(0, validImages.length - 1) : currentIndex;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Main Carousel Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          height: height,
          width: '100%',
          backgroundColor: '#0F172A',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Render Current Slide with smooth transition */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={validImages[safeIndex] || fallbackImage}
            alt={`${roomName} - Photo ${safeIndex + 1}`}
            fill
            style={{ objectFit: 'cover', transition: 'opacity 0.25s ease' }}
            sizes="(max-width: 768px) 100vw, 600px"
            priority={priority && safeIndex === 0}
          />
        </div>

        {/* Ambient Dark Gradient for readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.15) 30%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges / Room Tier */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            gap: '0.4rem',
            zIndex: 10,
          }}
        >
          {badge}
        </div>

        {/* Top-Right Tools: Image Counter & Lightbox Button */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            zIndex: 10,
          }}
        >
          {/* Photo Counter Pill (e.g. "1 / 4") */}
          <span
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#FFFFFF',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.68rem',
              fontWeight: 700,
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ImageIcon size={12} style={{ color: '#FCD34D' }} />
            {safeIndex + 1}/{validImages.length}
          </span>

          {/* Fullscreen Lightbox Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            aria-label="View full room photos"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {/* Left Arrow Button (Only if > 1 image) */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous room photo"
            style={{
              position: 'absolute',
              top: '50%',
              left: '8px',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Right Arrow Button (Only if > 1 image) */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next room photo"
            style={{
              position: 'absolute',
              top: '50%',
              right: '8px',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Bottom Feature Pill Overlay: highlights room features right on the slide */}
        {showFeatureOverlay && facilities.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: validImages.length > 1 ? '24px' : '10px',
              left: '10px',
              right: '10px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: '2px',
            }}
          >
            {facilities.slice(0, 3).map((f) => (
              <span
                key={f}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.82)',
                  color: '#F8FAFC',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Check size={10} style={{ color: '#4ADE80' }} />
                {f}
              </span>
            ))}
            {facilities.length > 3 && (
              <span
                style={{
                  backgroundColor: 'rgba(202, 138, 4, 0.85)',
                  color: '#FFFFFF',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.4rem',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}
              >
                +{facilities.length - 3} More
              </span>
            )}
          </div>
        )}

        {/* Bottom Indicator Dots (If > 1 image) */}
        {validImages.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              zIndex: 10,
            }}
          >
            {validImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => goToSlide(idx, e)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === safeIndex ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  backgroundColor: idx === safeIndex ? '#FCD34D' : 'rgba(255, 255, 255, 0.5)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Optional Thumbnail Strip (Ideal for Room Detail Page) */}
      {showThumbnails && validImages.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            padding: '0.65rem 0 0.25rem',
            scrollbarWidth: 'none',
          }}
        >
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              style={{
                position: 'relative',
                width: '64px',
                height: '48px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                border: idx === safeIndex ? '2px solid #2563EB' : '1px solid #CBD5E1',
                padding: 0,
                cursor: 'pointer',
                opacity: idx === safeIndex ? 1 : 0.65,
                transition: 'all 0.15s ease',
                backgroundColor: '#0F172A',
              }}
            >
              <Image
                src={img}
                alt={`${roomName} thumb ${idx + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Top Bar with title & close button */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              padding: '0.5rem 0.5rem 1rem',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 800 }}>
                {roomName}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Photo {safeIndex + 1} of {validImages.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close photo viewer"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Large Image View */}
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              position: 'relative',
              flex: 1,
              width: '100%',
              maxHeight: '75vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={validImages[safeIndex] || fallbackImage}
                alt={`${roomName} Full Photo`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="100vw"
                priority
              />
            </div>

            {/* Nav Arrows inside Lightbox */}
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails inside Lightbox */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              padding: '1rem 0 0.5rem',
            }}
          >
            {validImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                style={{
                  position: 'relative',
                  width: '60px',
                  height: '42px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: idx === currentIndex ? '2px solid #FCD34D' : '1px solid rgba(255,255,255,0.2)',
                  padding: 0,
                  cursor: 'pointer',
                  opacity: idx === currentIndex ? 1 : 0.5,
                  flexShrink: 0,
                  backgroundColor: '#0F172A',
                }}
              >
                <Image
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="60px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
