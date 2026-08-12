'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Dumbbell, Check, Calendar, User, Phone,
  ArrowLeft, Send, ShieldCheck, Flame, Sparkles
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

function GymSubscribeForm() {
  const searchParams = useSearchParams();
  const pkgParam = searchParams.get('package') || 'monthly-standard';

  const [selectedPackageId, setSelectedPackageId] = useState<string>(pkgParam);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState(getTodayString());
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activePackage = GYM_PACKAGES.find((p) => p.id === selectedPackageId) || GYM_PACKAGES[2];

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `🏋️‍♂️ *NEW GYM SUBSCRIPTION REGISTRATION*
🏨 *Super E Fitness Hall & Gym Studio*

📋 *Selected Package:* ${activePackage.name} (${formatPrice(activePackage.price)} / ${activePackage.duration})
👤 *Member Name:* ${fullName.trim() || 'Valued Gym Member'}
📱 *Phone/WhatsApp:* ${phone.trim() || 'N/A'}
📅 *Preferred Start Date:* ${startDate}
🎯 *Fitness Goals / Notes:* ${fitnessGoals.trim() || 'General Fitness & Aerobics'}

📌 *Status:* Pending Activation`;

    const whatsappUrl = generateWhatsAppURL('09131964939', message);
    window.open(whatsappUrl, '_blank');
    setIsSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/gym"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={18} /> Back to Gym & Fitness
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{
          background: 'rgba(234, 179, 8, 0.15)',
          color: 'var(--color-accent)',
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
        }}>
          <Dumbbell size={16} /> Gym Subscription Checkout
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.75rem' }}>
          Complete Gym Membership Subscription
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Confirm your package selection, enter your details, and submit directly to our desk on WhatsApp.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>

        {/* Selected Package Summary Card */}
        <div style={{
          background: 'var(--color-surface)',
          border: '2px solid var(--color-accent)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}>
          {activePackage.badge && (
            <span style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: activePackage.popular ? 'var(--color-accent)' : 'var(--color-primary)',
              color: activePackage.popular ? '#0F172A' : '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem',
              borderRadius: '50px',
              textTransform: 'uppercase',
            }}>
              {activePackage.badge}
            </span>
          )}

          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Package Selected
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text)', marginTop: '0.2rem' }}>
            {activePackage.name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            {activePackage.duration}
          </p>

          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-accent)', marginBottom: '1.25rem' }}>
            {formatPrice(activePackage.price)}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              Membership Benefits Included:
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {activePackage.features.map((feat, idx) => (
                <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subscriber Input Form */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Subscriber Details
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            Enter your details below to register your membership on WhatsApp.
          </p>

          {isSubmitted && (
            <div style={{
              padding: '1rem',
              background: '#10B981',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              textAlign: 'center',
            }}>
              🎉 Opening WhatsApp! Your gym subscription request is ready to send.
            </div>
          )}

          <form onSubmit={handleSubscribeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                Change Gym Package
              </label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
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
                rows={3}
                value={fitnessGoals}
                onChange={(e) => setFitnessGoals(e.target.value)}
                placeholder="e.g. Weight loss, cardio, ladies group fitness, personal trainer..."
                className="input"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-accent btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', fontWeight: 800 }}
            >
              <Send size={20} /> Subscribe & Send to WhatsApp
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function GymSubscribePage() {
  return (
    <section className="section-padding" style={{ background: 'var(--color-background)', minHeight: '80vh' }}>
      <div className="section-container">
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Loading subscription page...</div>}>
          <GymSubscribeForm />
        </Suspense>
      </div>
    </section>
  );
}
