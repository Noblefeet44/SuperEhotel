'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dumbbell, Check, Flame, Award, Shield, Sparkles, X,
  User, Phone, Calendar, Send
} from 'lucide-react';
import { formatPrice, generateWhatsAppURL, getTodayString } from '@/lib/utils';

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
  const [selectedPackage, setSelectedPackage] = useState<GymPackage | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openPackageModal = (pkg: GymPackage) => {
    setSelectedPackage(pkg);
    setIsSubmitted(false);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setIsSubmitted(false);
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    const message = `🏋️‍♂️ *NEW GYM MEMBERSHIP SUBSCRIPTION*
🏨 *Super E Fitness Hall & Gym Studio*

📋 *Selected Package:* ${selectedPackage.name} (${formatPrice(selectedPackage.price)} / ${selectedPackage.duration})
👤 *Member Name:* ${fullName.trim() || 'Valued Gym Member'}
📱 *Phone/WhatsApp:* ${phone.trim() || 'N/A'}
📅 *Preferred Start Date:* ${startDate}
🎯 *Fitness Goals / Notes:* ${fitnessGoals.trim() || 'General Fitness & Aerobics'}

📌 *Status:* Ready for Activation`;

    const whatsappUrl = generateWhatsAppURL('09131964939', message);
    window.open(whatsappUrl, '_blank');
    setIsSubmitted(true);
  };

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
              <button
                onClick={() => openPackageModal(GYM_PACKAGES[2])}
                className="btn btn-accent btn-lg"
                style={{ cursor: 'pointer' }}
              >
                <Flame size={20} /> Subscribe to Gym Package
              </button>
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
              Click on any package below to open the instant subscription form pop-up.
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
                onClick={() => openPackageModal(pkg)}
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
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPackageModal(pkg);
                  }}
                  className={pkg.popular ? 'btn btn-accent' : 'btn btn-outline'}
                  style={{ width: '100%', justifyContent: 'center', cursor: 'pointer' }}
                >
                  Subscribe Now
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SUBSCRIPTION POP-UP MODAL
          ═══════════════════════════════════════════ */}
      {selectedPackage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '580px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--color-accent)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            padding: '1.75rem',
            margin: 'auto',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '1rem', marginBottom: '1.25rem', paddingRight: '2rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Instant Gym Membership Subscription
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.2rem', color: 'var(--color-text)' }}>
                {selectedPackage.name}
              </h3>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-accent)', marginTop: '0.2rem' }}>
                {formatPrice(selectedPackage.price)} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>/ {selectedPackage.duration}</span>
              </div>
            </div>

            {isSubmitted && (
              <div style={{ padding: '1rem', background: '#10B981', color: '#FFFFFF', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 700, textAlign: 'center' }}>
                🎉 Launching WhatsApp! Your subscription request is ready to send.
              </div>
            )}

            <form onSubmit={handleSubscribeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
                  Select Package
                </label>
                <select
                  value={selectedPackage.id}
                  onChange={(e) => {
                    const p = GYM_PACKAGES.find(item => item.id === e.target.value);
                    if (p) setSelectedPackage(p);
                  }}
                  className="input"
                  style={{ background: 'var(--color-background)', cursor: 'pointer' }}
                >
                  {GYM_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — {formatPrice(pkg.price)} ({pkg.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
                  WhatsApp Phone Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
                  Preferred Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="label" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>
                  Fitness Goals / Special Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={fitnessGoals}
                  onChange={(e) => setFitnessGoals(e.target.value)}
                  placeholder="e.g. Weight loss, cardio, group aerobics, personal trainer..."
                  className="input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-outline"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-accent"
                  style={{ flex: 2, justifyContent: 'center', fontWeight: 800 }}
                >
                  <Send size={18} /> Subscribe on WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
