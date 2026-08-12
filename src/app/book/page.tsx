'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Bed, Calendar, Users, User, Phone, Mail,
  MessageCircle, ArrowRight, ArrowLeft, Check,
  Copy, ChevronRight
} from 'lucide-react';
import {
  formatPrice, formatDate, calculateNights,
  generateBookingReference, generateWhatsAppBookingMessage,
  generateWhatsAppURL, getTodayString, getTomorrowString, cn
} from '@/lib/utils';

const rooms = [
  { slug: 'standard-room', name: 'Standard Room', price: 25000, maxGuests: 2, bedType: 'Queen', image: '/images/standard-room.jpg' },
  { slug: 'deluxe-room', name: 'Deluxe Room', price: 40000, maxGuests: 2, bedType: 'King', image: '/images/deluxe-room.jpg' },
  { slug: 'executive-room', name: 'Executive Room', price: 60000, maxGuests: 2, bedType: 'King', image: '/images/executive-room.jpg' },
  { slug: 'vip-luxury-suite', name: 'VIP Luxury Suite', price: 100000, maxGuests: 4, bedType: 'King (Premium)', image: '/images/vip-suite.jpg' },
];

const STEPS = [
  { id: 1, label: 'Select Room', icon: <Bed size={18} /> },
  { id: 2, label: 'Dates & Guests', icon: <Calendar size={18} /> },
  { id: 3, label: 'Your Details', icon: <User size={18} /> },
  { id: 4, label: 'Review', icon: <Check size={18} /> },
];

interface BookingData {
  selectedRoom: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  fullName: string;
  phone: string;
  whatsapp: string;
  email: string;
  specialRequests: string;
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: 'var(--space-4xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading booking form...</p>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}

function BookPageContent() {
  const searchParams = useSearchParams();
  const preselectedRoom = searchParams.get('room') || '';

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedRoom: preselectedRoom,
    checkIn: getTodayString(),
    checkOut: getTomorrowString(),
    numGuests: 1,
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});
  const [bookingRef, setBookingRef] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-advance if room pre-selected
  useEffect(() => {
    if (preselectedRoom && rooms.find((r) => r.slug === preselectedRoom)) {
      setStep(2);
    }
  }, [preselectedRoom]);

  const selectedRoomData = rooms.find((r) => r.slug === bookingData.selectedRoom);
  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const totalAmount = selectedRoomData ? selectedRoomData.price * nights : 0;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof BookingData, string>> = {};

    if (currentStep === 1) {
      if (!bookingData.selectedRoom) {
        newErrors.selectedRoom = 'Please select a room';
      }
    }

    if (currentStep === 2) {
      if (!bookingData.checkIn) newErrors.checkIn = 'Please select a check-in date';
      if (!bookingData.checkOut) newErrors.checkOut = 'Please select a check-out date';
      if (bookingData.checkIn && bookingData.checkOut && bookingData.checkIn >= bookingData.checkOut) {
        newErrors.checkOut = 'Check-out must be after check-in';
      }
      if (bookingData.checkIn && bookingData.checkIn < getTodayString()) {
        newErrors.checkIn = 'Check-in cannot be in the past';
      }
      if (bookingData.numGuests < 1) {
        newErrors.numGuests = 'At least 1 guest required';
      }
      if (selectedRoomData && bookingData.numGuests > selectedRoomData.maxGuests) {
        newErrors.numGuests = `Maximum ${selectedRoomData.maxGuests} guests for this room`;
      }
    }

    if (currentStep === 3) {
      if (!bookingData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!bookingData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
      if (bookingData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectRoom = (roomSlug: string) => {
    updateField('selectedRoom', roomSlug);
    setStep(2);
    setTimeout(() => {
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }, 50);
  };

  const handleConfirmBooking = () => {
    const ref = generateBookingReference();
    setBookingRef(ref);
    setIsConfirmed(true);
    setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Automatically send details to WhatsApp
    const room = rooms.find((r) => r.slug === bookingData.selectedRoom);
    const n = calculateNights(bookingData.checkIn, bookingData.checkOut);
    const total = room ? room.price * n : 0;

    const whatsappUrl = generateWhatsAppBookingMessage('09131964939', {
      reference: ref,
      guestName: bookingData.fullName,
      phone: bookingData.phone,
      roomName: room ? room.name : bookingData.selectedRoom,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      numGuests: bookingData.numGuests,
      totalAmount: total,
      specialRequests: bookingData.specialRequests,
    });

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  const getWhatsAppBookingURL = () => {
    if (!selectedRoomData) return '#';
    return generateWhatsAppBookingMessage('09131964939', {
      reference: bookingRef,
      guestName: bookingData.fullName,
      phone: bookingData.phone,
      roomName: selectedRoomData.name,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      numGuests: bookingData.numGuests,
      totalAmount: totalAmount,
      specialRequests: bookingData.specialRequests,
    });
  };


  const copyReference = () => {
    navigator.clipboard.writeText(bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateField = (field: keyof BookingData, value: string | number) => {
    setBookingData({ ...bookingData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <>
      {/* Page Header */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        paddingTop: 'calc(80px + var(--space-2xl))',
        paddingBottom: 'var(--space-2xl)',
      }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 'var(--space-sm)' }}>
            {isConfirmed ? 'Booking Confirmed!' : 'Book Your Stay'}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {isConfirmed ? 'Your booking has been submitted successfully' : 'Complete the form below to reserve your room'}
          </p>
        </div>
      </section>



      {/* Progress Steps */}
      {!isConfirmed && (
        <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)', position: 'sticky', top: '64px', zIndex: 30 }}>
          <div className="section-container">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-xs)',
              padding: 'var(--space-md) 0',
              overflowX: 'auto',
            }}>
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: step >= s.id ? 'var(--color-primary)' : 'var(--color-muted)',
                    color: step >= s.id ? '#FFFFFF' : 'var(--color-text-muted)',
                    fontSize: '0.8125rem',
                    fontWeight: step === s.id ? 600 : 400,
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)',
                  }}>
                    {step > s.id ? <Check size={14} /> : s.icon}
                    <span className="hidden-mobile" style={{ display: 'none' }}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div className="section-container" style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* STEP 1: Room Selection */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-xl)' }}>Select Your Room</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                {rooms.map((room) => (
                  <button
                    key={room.slug}
                    type="button"
                    onClick={() => handleSelectRoom(room.slug)}
                    className={cn('card-static')}

                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr',
                      gap: 'var(--space-lg)',
                      padding: 'var(--space-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: bookingData.selectedRoom === room.slug
                        ? '2px solid var(--color-primary)'
                        : '1px solid var(--color-border-light)',
                      transition: 'border-color var(--transition-fast)',
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      height: '90px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                    }}>
                      <Image src={room.image} alt={room.name} fill style={{ objectFit: 'cover' }} sizes="120px" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '1.0625rem', marginBottom: '0.25rem' }}>{room.name}</h3>
                      <div style={{ display: 'flex', gap: 'var(--space-md)', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                        <span>{room.bedType}</span>
                        <span>Up to {room.maxGuests} guests</span>
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                        {formatPrice(room.price)}<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/night</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.selectedRoom && <p className="error-text" style={{ marginTop: 'var(--space-sm)' }}>{errors.selectedRoom}</p>}
              <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={nextStep} className="btn btn-primary btn-lg">
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dates & Guests */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-xl)' }}>Choose Your Dates</h2>
              
              {selectedRoomData && (
                <div className="card-static" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                  <div style={{ position: 'relative', width: '80px', height: '60px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={selectedRoomData.image} alt={selectedRoomData.name} fill style={{ objectFit: 'cover' }} sizes="80px" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem' }}>{selectedRoomData.name}</h4>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{formatPrice(selectedRoomData.price)}/night</p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
                  <div>
                    <label htmlFor="check-in" className="label">Check-in Date *</label>
                    <input
                      id="check-in"
                      type="date"
                      className={cn('input', errors.checkIn && 'input-error')}
                      value={bookingData.checkIn}
                      min={getTodayString()}
                      onChange={(e) => updateField('checkIn', e.target.value)}
                    />
                    {errors.checkIn && <p className="error-text">{errors.checkIn}</p>}
                  </div>
                  <div>
                    <label htmlFor="check-out" className="label">Check-out Date *</label>
                    <input
                      id="check-out"
                      type="date"
                      className={cn('input', errors.checkOut && 'input-error')}
                      value={bookingData.checkOut}
                      min={bookingData.checkIn || getTodayString()}
                      onChange={(e) => updateField('checkOut', e.target.value)}
                    />
                    {errors.checkOut && <p className="error-text">{errors.checkOut}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="num-guests" className="label">Number of Guests *</label>
                  <select
                    id="num-guests"
                    className={cn('input', errors.numGuests && 'input-error')}
                    value={bookingData.numGuests}
                    onChange={(e) => updateField('numGuests', parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n} disabled={selectedRoomData ? n > selectedRoomData.maxGuests : false}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                  {errors.numGuests && <p className="error-text">{errors.numGuests}</p>}
                </div>

                {/* Stay Summary */}
                {nights > 0 && selectedRoomData && (
                  <div className="card-static" style={{
                    padding: 'var(--space-lg)',
                    background: 'rgba(30, 58, 138, 0.04)',
                    border: '1px solid rgba(30, 58, 138, 0.1)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{nights} {nights === 1 ? 'night' : 'nights'} × {formatPrice(selectedRoomData.price)}</span>
                      <span style={{ fontWeight: 600 }}>{formatPrice(totalAmount)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)', display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Total</strong>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                        {formatPrice(totalAmount)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={prevStep} className="btn btn-ghost">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={nextStep} className="btn btn-primary btn-lg">
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Guest Details */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-xl)' }}>Your Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div>
                  <label htmlFor="full-name" className="label">Full Name *</label>
                  <input
                    id="full-name"
                    type="text"
                    className={cn('input', errors.fullName && 'input-error')}
                    placeholder="Enter your full name"
                    value={bookingData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                  />
                  {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
                  <div>
                    <label htmlFor="phone-number" className="label">Phone Number *</label>
                    <input
                      id="phone-number"
                      type="tel"
                      className={cn('input', errors.phone && 'input-error')}
                      placeholder="e.g. 08012345678"
                      value={bookingData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="whatsapp-number" className="label">WhatsApp Number *</label>
                    <input
                      id="whatsapp-number"
                      type="tel"
                      className={cn('input', errors.whatsapp && 'input-error')}
                      placeholder="e.g. 08012345678"
                      value={bookingData.whatsapp}
                      onChange={(e) => updateField('whatsapp', e.target.value)}
                    />
                    {errors.whatsapp && <p className="error-text">{errors.whatsapp}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="label">Email (Optional)</label>
                  <input
                    id="email"
                    type="email"
                    className={cn('input', errors.email && 'input-error')}
                    placeholder="Your email address"
                    value={bookingData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="special-requests" className="label">Special Requests (Optional)</label>
                  <textarea
                    id="special-requests"
                    className="input"
                    placeholder="Any special requests? (e.g. late check-in, extra pillows, etc.)"
                    rows={4}
                    value={bookingData.specialRequests}
                    onChange={(e) => updateField('specialRequests', e.target.value)}
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <input type="checkbox" id="same-whatsapp" onChange={(e) => {
                    if (e.target.checked) updateField('whatsapp', bookingData.phone);
                  }} />
                  <label htmlFor="same-whatsapp" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                    WhatsApp number is same as phone number
                  </label>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={prevStep} className="btn btn-ghost">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={nextStep} className="btn btn-primary btn-lg">
                  Review Booking <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && selectedRoomData && (
            <div className="animate-fade-in-up">
              <h2 style={{ marginBottom: 'var(--space-xl)' }}>Review Your Booking</h2>

              <div className="card-static" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
                {/* Room */}
                <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', marginBottom: 'var(--space-xl)', paddingBottom: 'var(--space-xl)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ position: 'relative', width: '100px', height: '75px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={selectedRoomData.image} alt={selectedRoomData.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem' }}>{selectedRoomData.name}</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{selectedRoomData.bedType} Bed</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Check-in</p>
                    <p style={{ fontWeight: 600 }}>{formatDate(bookingData.checkIn)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Check-out</p>
                    <p style={{ fontWeight: 600 }}>{formatDate(bookingData.checkOut)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Guests</p>
                    <p style={{ fontWeight: 600 }}>{bookingData.numGuests}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Nights</p>
                    <p style={{ fontWeight: 600 }}>{nights}</p>
                  </div>
                </div>

                {/* Guest Info */}
                <div style={{ marginBottom: 'var(--space-xl)', paddingBottom: 'var(--space-xl)', borderBottom: '1px solid var(--color-border-light)' }}>
                  <h4 style={{ marginBottom: 'var(--space-md)', fontSize: '0.9375rem' }}>Guest Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Name</p>
                      <p>{bookingData.fullName}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Phone</p>
                      <p>{bookingData.phone}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>WhatsApp</p>
                      <p>{bookingData.whatsapp}</p>
                    </div>
                    {bookingData.email && (
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Email</p>
                        <p>{bookingData.email}</p>
                      </div>
                    )}
                  </div>
                  {bookingData.specialRequests && (
                    <div style={{ marginTop: 'var(--space-md)' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.125rem' }}>Special Requests</p>
                      <p>{bookingData.specialRequests}</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{selectedRoomData.name} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1.125rem' }}>Total Amount</strong>
                    <strong style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                      {formatPrice(totalAmount)}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{
                padding: 'var(--space-lg)',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(37, 211, 102, 0.06)',
                border: '1px solid rgba(37, 211, 102, 0.2)',
                marginBottom: 'var(--space-xl)',
              }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                  <strong>Payment:</strong> After submitting your booking, the hotel will contact you on WhatsApp 
                  to confirm availability and arrange payment. No payment is required at this stage.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <button onClick={prevStep} className="btn btn-ghost">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={handleConfirmBooking} className="btn btn-accent btn-lg">
                  <Check size={18} /> Confirm Booking
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && isConfirmed && selectedRoomData && (
            <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '80px', height: '80px', borderRadius: 'var(--radius-full)',
                background: 'rgba(22, 163, 74, 0.1)', color: 'var(--color-success)',
                marginBottom: 'var(--space-xl)',
              }}>
                <Check size={40} />
              </div>
              
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>Booking Submitted Successfully!</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
                Your booking has been submitted. Please send the details to our WhatsApp to complete the process.
              </p>

              {/* Reference Number */}
              <div className="card-static" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-xl)', display: 'inline-block' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-sm)' }}>
                  Booking Reference
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                    {bookingRef}
                  </span>
                  <button onClick={copyReference} className="btn btn-ghost btn-icon" title="Copy reference">
                    <Copy size={18} />
                  </button>
                </div>
                {copied && <p style={{ fontSize: '0.8125rem', color: 'var(--color-success)', marginTop: '0.25rem' }}>Copied!</p>}
              </div>

              {/* Summary */}
              <div className="card-static" style={{ padding: 'var(--space-xl)', textAlign: 'left', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-lg)' }}>Booking Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Room</span>
                    <span style={{ fontWeight: 500 }}>{selectedRoomData.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Check-in</span>
                    <span style={{ fontWeight: 500 }}>{formatDate(bookingData.checkIn)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Check-out</span>
                    <span style={{ fontWeight: 500 }}>{formatDate(bookingData.checkOut)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Guests</span>
                    <span style={{ fontWeight: 500 }}>{bookingData.numGuests}</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-sm)', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Total</strong>
                    <strong style={{ color: 'var(--color-primary)' }}>{formatPrice(totalAmount)}</strong>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div style={{
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(37, 211, 102, 0.06)',
                border: '1px solid rgba(37, 211, 102, 0.2)',
                marginBottom: 'var(--space-xl)',
                maxWidth: '500px',
                margin: '0 auto var(--space-xl)',
                textAlign: 'left',
              }}>
                <h4 style={{ marginBottom: 'var(--space-md)' }}>Next Steps</h4>
                <ol style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', color: 'var(--color-text-secondary)' }}>
                  <li>Click the button below to send your booking details via WhatsApp</li>
                  <li>Our team will confirm room availability</li>
                  <li>Payment arrangements will be made after confirmation</li>
                  <li>You&apos;ll receive a final confirmation on WhatsApp</li>
                </ol>
              </div>

              {/* WhatsApp CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', alignItems: 'center' }}>
                <a
                  href={getWhatsAppBookingURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                  style={{ minWidth: '280px' }}
                >
                  <MessageCircle size={22} />
                  Send Booking to WhatsApp
                </a>
                <Link href="/" className="btn btn-ghost">
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
