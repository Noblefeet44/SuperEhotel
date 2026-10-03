'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlide {
  url: string;
  alt: string;
  caption?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    url: '/images/hotel-entrance-facade.jpg',
    alt: 'Super E Luxury Hotel & Suites Grand Entrance with Chandelier and Marble Facade',
    caption: 'Grand Entrance & Chandelier Reception',
  },
  {
    url: '/images/hotel-glass-architecture.jpg',
    alt: 'Super E Luxury Hotel Modern Reflective Glass Architecture and Fountain',
    caption: 'Contemporary Glass Architecture & Water Fountain',
  },
  {
    url: '/images/hotel-compound-carport.jpg',
    alt: 'Super E Luxury Hotel VIP Courtyard, Diamond Architecture & Secure Carport',
    caption: 'Executive VIP Courtyard & Secure Carport',
  },
  {
    url: '/images/hotel-exterior.jpg',
    alt: 'Super E Luxury Hotel & Suites Aerial Drone View of the Entire Estate',
    caption: 'Aerial Estate View — Keffi, Nasarawa State',
  },
];

const SLIDE_DURATION_MS = 15000; // 15 seconds per slide
const TRANSITION_DURATION_MS = 1200; // 1.2s smooth crossfade

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION_MS);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION_MS);
  }, []);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(idx);
    setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION_MS);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Slides Stack with Crossfade & Cinematic Ken Burns Zoom Effect */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        const isEven = idx % 2 === 0;
        const zoomAnim = isActive
          ? isEven
            ? `kenBurnsZoomIn ${SLIDE_DURATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1) forwards`
            : `kenBurnsZoomOut ${SLIDE_DURATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1) forwards`
          : 'none';

        return (
          <div
            key={slide.url}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: `opacity ${TRANSITION_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 1 : 0,
            }}
          >
            <div
              key={`zoom-${slide.url}-${isActive}`}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                animation: zoomAnim,
                willChange: 'transform, opacity',
              }}
            >
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                priority={idx === 0}
                quality={90}
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center 40%',
                }}
                sizes="100vw"
              />
            </div>
          </div>
        );
      })}

      {/* Manual Slide Navigation Controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#FFFFFF',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease',
          opacity: 0.75,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.75';
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.45)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#FFFFFF',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease',
          opacity: 0.75,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.75';
          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.45)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide Indicators & 30s Progress Bar at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
          padding: '6px 14px',
          borderRadius: '9999px',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.url}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.caption}`}
              title={slide.caption}
              style={{
                position: 'relative',
                width: isActive ? '28px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: isActive ? 'var(--color-accent, #EAB308)' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                overflow: 'hidden',
                padding: 0,
              }}
            >
              {isActive && (
                <div
                  key={`progress-${currentIndex}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    animation: `heroProgressAnim ${SLIDE_DURATION_MS}ms linear forwards`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes heroProgressAnim {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes kenBurnsZoomIn {
          0% {
            transform: scale(1.0);
          }
          100% {
            transform: scale(1.14);
          }
        }

        @keyframes kenBurnsZoomOut {
          0% {
            transform: scale(1.14);
          }
          100% {
            transform: scale(1.01);
          }
        }
      `}</style>
    </div>
  );
}
