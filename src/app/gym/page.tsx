import Image from 'next/image';
import Link from 'next/link';
import {
  Dumbbell, Check, Flame, Award, Shield, Sparkles, ArrowRight
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface GymPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

const GYM_PACKAGES: GymPackage[] = [
  {
    id: 'day-pass',
    name: 'Day Pass',
    price: 2000,
    duration: 'Single Day Access',
    badge: 'Flexible',
    features: [
      'Full Gym & Fitness Hall Access',
      'Cardio & Free Weights Area',
      'Locker & Shower Access',
      'Clean Workout Towel Provided',
    ],
  },
  {
    id: 'weekly-flex',
    name: 'Weekly Flex',
    price: 8000,
    duration: '7 Days Access',
    features: [
      '7 Days Unlimited Gym Access',
      'Full Fitness & Aerobics Zone',
      '1 Complimentary Protein Shake',
      'Locker & Shower Facilities',
    ],
  },
  {
    id: 'monthly-standard',
    name: 'Monthly Standard',
    price: 25000,
    duration: '30 Days Access',
    popular: true,
    badge: 'Most Popular',
    features: [
      '30 Days Unlimited Full Gym Access',
      'Dedicated Ladies & Group Fitness Zone',
      '1-on-1 Fitness Assessment Session',
      'Locker Room & Shower Access',
      '10% Discount at Restaurant Juice Bar',
    ],
  },
  {
    id: 'vip-quarterly',
    name: 'VIP Quarterly',
    price: 65000,
    duration: '90 Days Access',
    badge: 'Best Value',
    features: [
      '90 Days Unlimited VIP Gym Access',
      'Dedicated Personal Trainer (3 Sessions)',
      'Aerobics, Zumba & Dance Fitness Classes',
      'Free Protein Shake Weekly',
      '15% Discount on Hotel Room Bookings',
    ],
  },
  {
    id: 'annual-elite',
    name: 'Annual Elite',
    price: 220000,
    duration: '365 Days Access',
    badge: 'VIP Membership',
    features: [
      '365 Days Priority VIP Access',
      'Dedicated Personal Trainer (Monthly)',
      'Exclusive Access to VIP Fitness Lounge',
      'Free Daily Workout Towel & Hydration',
      '20% Discount across Hotel & Restaurant',
    ],
  },
];

export default function GymPage() {
  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #0284C7 100%)',
        color: '#FFFFFF',
        padding: 'var(--space-3xl) 0 var(--space-2xl)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '750px' }}>
            <span style={{
              background: 'rgba(234, 179, 8, 0.2)',
              color: '#FACC15',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <Dumbbell size={16} /> World-Class Gym & Fitness Hall
            </span>

            <h1 style={{ color: '#FFFFFF', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Elevate Your Fitness at Super E Gym Hall & Studio
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Experience Keffi&apos;s premier state-of-the-art fitness center. Featuring top-tier cardio machinery, heavy-duty free weights, climate-controlled workout zones, certified trainers, and dedicated ladies&apos; aerobics & group fitness classes.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/gym/subscribe?package=monthly-standard"
                className="btn btn-accent btn-lg"
              >
                <Flame size={20} /> Subscribe to Gym Package
              </Link>
              <a
                href="#packages"
                className="btn btn-outline btn-lg"
                style={{ borderColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF' }}
              >
                View All Packages
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness Showcase Gallery */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto var(--space-2xl)' }}>
            <h2 className="section-title">Well-Equipped Fitness Hall & Studio</h2>
            <p className="section-subtitle">
              Designed for serious fitness enthusiasts, beginners, and group fitness classes in an empowering, vibrant environment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ position: 'relative', height: '260px' }}>
                <Image
                  src="/images/gym-hall.png"
                  alt="Super E Gym Fitness Hall"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--color-surface)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>State-of-the-Art Cardio & Strength Zone</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Equipped with high-performance treadmills, stationary bikes, cable extension stations, and comprehensive dumbbell racks.
                </p>
              </div>
            </div>

            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ position: 'relative', height: '260px' }}>
                <Image
                  src="/images/gym-studio.png"
                  alt="Super E Aerobics & Ladies Fitness Studio"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--color-surface)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ladies & Group Fitness Studio</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Spacious, well-lit studio area for aerobics, body conditioning, Zumba dance, kettlebell workouts, and personal coaching sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gym Highlights */}
      <section className="section-padding" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-light)' }}>
        <div className="section-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <Dumbbell size={28} style={{ color: 'var(--color-accent)', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>Premium Equipment</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Modern treadmills, smith machines, power racks, kettlebells, and free weights for all strength levels.
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <Sparkles size={28} style={{ color: 'var(--color-accent)', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>Dedicated Ladies Zone</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Comfortable, supportive atmosphere for female members with dedicated group aerobics and fitness routines.
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <Award size={28} style={{ color: 'var(--color-accent)', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>Certified Trainers</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Experienced fitness coaches to guide your form, create workout plans, and help achieve body goals safely.
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--color-background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <Shield size={28} style={{ color: 'var(--color-accent)', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.4rem' }}>Clean & Air-Conditioned</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Full climate control, spotless locker rooms, hot water showers, and continuous hygiene maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gym Subscription Packages */}
      <section id="packages" className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto var(--space-2xl)' }}>
            <h2 className="section-title">Gym Membership Subscription Packages</h2>
            <p className="section-subtitle">
              Choose your preferred fitness package below to open the dedicated subscription checkout page.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.5rem',
          }}>
            {GYM_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.75rem',
                  border: pkg.popular ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  boxShadow: pkg.popular ? '0 10px 25px -5px rgba(234, 179, 8, 0.25)' : 'var(--shadow-sm)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {pkg.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: pkg.popular ? 'var(--color-accent)' : 'var(--color-primary)',
                    color: pkg.popular ? '#0F172A' : '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '50px',
                    textTransform: 'uppercase',
                  }}>
                    {pkg.badge}
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{pkg.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{pkg.duration}</p>

                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-accent)', marginBottom: '1.25rem' }}>
                    {formatPrice(pkg.price)}
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/gym/subscribe?package=${pkg.id}`}
                  className={pkg.popular ? 'btn btn-accent' : 'btn btn-outline'}
                  style={{ width: '100%', justifyContent: 'center' }}
                  prefetch={true}
                >
                  Subscribe Now <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
