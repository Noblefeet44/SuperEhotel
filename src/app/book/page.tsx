'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Bed, Calendar, Users, User, Phone, Mail,
  MessageCircle, ArrowRight, ArrowLeft, Check,
  Copy, ChevronRight, Upload, FileText, AlertTriangle,
  ShieldCheck, CheckCircle2, X, RefreshCw, CreditCard
} from 'lucide-react';
import {
  formatPrice, formatDate, calculateNights,
  generateBookingReference, generateWhatsAppBookingMessage,
  generateWhatsAppURL, getTodayString, getTomorrowString, cn
} from '@/lib/utils';
import {
  HOTEL_INFO,
  OFFICIAL_BANK_ACCOUNT,
  INITIAL_ROOMS_DATA,
  getStoredRoomsData,
  RoomCategoryData
} from '@/lib/hotel-data';

const STEPS = [
  { id: 1, label: 'Select Room', icon: <Bed size={18} /> },
  { id: 2, label: 'Dates & Guests', icon: <Calendar size={18} /> },
  { id: 3, label: 'Your Details', icon: <User size={18} /> },
  { id: 4, label: 'Payment & Transfer', icon: <CreditCard size={18} /> },
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
    <Suspense
      fallback={
        <div style={{ padding: 'var(--space-4xl)', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading booking system...</p>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}

function BookPageContent() {
  const searchParams = useSearchParams();
  const preselectedRoom = searchParams.get('room') || '';

  const [rooms, setRooms] = useState<RoomCategoryData[]>(INITIAL_ROOMS_DATA);
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
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData | 'receipt', string>>>({});
  const [bookingRef, setBookingRef] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Payment Receipt Upload State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load active rooms from local inventory
  useEffect(() => {
    try {
      const stored = getStoredRoomsData();
      if (stored && stored.length > 0) {
        setRooms(stored);
      }
    } catch {
      setRooms(INITIAL_ROOMS_DATA);
    }
  }, []);

  // Generate booking reference once
  useEffect(() => {
    if (!bookingRef) {
      setBookingRef(generateBookingReference());
    }
  }, [bookingRef]);

  // Auto-advance if room pre-selected in URL
  useEffect(() => {
    if (preselectedRoom && rooms.find((r) => r.slug === preselectedRoom)) {
      setBookingData((prev) => ({ ...prev, selectedRoom: preselectedRoom }));
      setStep(2);
    }
  }, [preselectedRoom, rooms]);

  const selectedRoomData = rooms.find((r) => r.slug === bookingData.selectedRoom) || rooms[0];
  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const totalAmount = selectedRoomData ? selectedRoomData.price * nights : 0;

  const copyToClipboard = (text: string, fieldId: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, receipt: 'File is too large (maximum 10MB)' }));
        return;
      }
      setReceiptFile(file);
      setErrors((prev) => ({ ...prev, receipt: undefined }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof BookingData | 'receipt', string>> = {};

    if (currentStep === 1) {
      if (!bookingData.selectedRoom) {
        newErrors.selectedRoom = 'Please select a room category';
      }
    }

    if (currentStep === 2) {
      if (!bookingData.checkIn) newErrors.checkIn = 'Please select a check-in date';
      if (!bookingData.checkOut) newErrors.checkOut = 'Please select a check-out date';
      if (bookingData.checkIn && bookingData.checkOut && bookingData.checkIn >= bookingData.checkOut) {
        newErrors.checkOut = 'Check-out date must be after check-in';
      }
      if (bookingData.checkIn && bookingData.checkIn < getTodayString()) {
        newErrors.checkIn = 'Check-in date cannot be in the past';
      }
      if (bookingData.numGuests < 1) {
        newErrors.numGuests = 'At least 1 guest required';
      }
      if (selectedRoomData && bookingData.numGuests > selectedRoomData.maxGuests) {
        newErrors.numGuests = `Maximum ${selectedRoomData.maxGuests} guests for ${selectedRoomData.name}`;
      }
    }

    if (currentStep === 3) {
      if (!bookingData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!bookingData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
      if (bookingData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (currentStep === 4) {
      if (!receiptFile && !receiptPreview) {
        newErrors.receipt = 'Please upload your payment transfer receipt screenshot as proof of payment';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSelectRoom = (roomSlug: string) => {
    updateField('selectedRoom', roomSlug);
    setStep(2);
    setTimeout(() => {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }, 50);
  };

  const handleSubmitBookingAndPayment = async () => {
    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);
    const ref = bookingRef || generateBookingReference();

    const bookingPayload = {
      ref,
      guestName: bookingData.fullName,
      phone: bookingData.phone,
      whatsapp: bookingData.whatsapp || bookingData.phone,
      email: bookingData.email,
      roomName: selectedRoomData?.name || 'Standard Room',
      roomSlug: bookingData.selectedRoom,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      nights,
      numGuests: bookingData.numGuests,
      totalAmount,
      specialRequests: bookingData.specialRequests,
      paymentBank: OFFICIAL_BANK_ACCOUNT.bankName,
      paymentAccountNumber: OFFICIAL_BANK_ACCOUNT.accountNumber,
      paymentAccountName: OFFICIAL_BANK_ACCOUNT.accountName,
      receiptImage: receiptPreview || '',
      receiptFileName: receiptFile?.name || 'payment-receipt.png',
      status: 'awaiting_confirmation',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to backend API
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
    } catch (err) {
      console.error('Error saving booking to API:', err);
    }

    // 2. Also save to guest localStorage for offline resilience
    try {
      const existing = JSON.parse(localStorage.getItem('super_e_guest_bookings') || '[]');
      existing.unshift(bookingPayload);
      localStorage.setItem('super_e_guest_bookings', JSON.stringify(existing));
    } catch (e) {
      console.warn('Could not store to localStorage:', e);
    }

    setIsSubmitting(false);
    setIsConfirmed(true);
    setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 3. Prepare and open prefilled WhatsApp message with all booking + payment information
    const whatsappUrl = generateWhatsAppBookingMessage(HOTEL_INFO.whatsappNumber, {
      reference: ref,
      guestName: bookingData.fullName,
      phone: bookingData.phone,
      whatsapp: bookingData.whatsapp,
      roomName: selectedRoomData?.name || 'Room',
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      numGuests: bookingData.numGuests,
      totalAmount,
      paymentBank: OFFICIAL_BANK_ACCOUNT.bankName,
      paymentAccountNumber: OFFICIAL_BANK_ACCOUNT.accountNumber,
      paymentAccountName: OFFICIAL_BANK_ACCOUNT.accountName,
      hasReceiptUploaded: Boolean(receiptPreview),
      specialRequests: bookingData.specialRequests,
    });

    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  const getWhatsAppBookingURL = () => {
    return generateWhatsAppBookingMessage(HOTEL_INFO.whatsappNumber, {
      reference: bookingRef,
      guestName: bookingData.fullName,
      phone: bookingData.phone,
      whatsapp: bookingData.whatsapp,
      roomName: selectedRoomData?.name || 'Room',
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      numGuests: bookingData.numGuests,
      totalAmount,
      paymentBank: OFFICIAL_BANK_ACCOUNT.bankName,
      paymentAccountNumber: OFFICIAL_BANK_ACCOUNT.accountNumber,
      paymentAccountName: OFFICIAL_BANK_ACCOUNT.accountName,
      hasReceiptUploaded: Boolean(receiptPreview),
      specialRequests: bookingData.specialRequests,
    });
  };

  const updateField = (field: keyof BookingData, value: string | number) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      {/* Page Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          paddingTop: 'calc(80px + var(--space-2xl))',
          paddingBottom: 'var(--space-2xl)',
          color: '#FFFFFF',
        }}
      >
        <div className="section-container" style={{ textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'var(--color-accent-light)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-xs)',
            }}
          >
            Direct Reservation
          </span>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: 'var(--space-xs)' }}>
            {isConfirmed ? 'Booking & Payment Submitted' : 'Reserve & Pay Online'}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            {isConfirmed
              ? 'Your booking is recorded. We are awaiting confirmation on WhatsApp.'
              : 'Official direct booking with secure transfer to company account.'}
          </p>
        </div>
      </section>

      {/* Progress Steps Header */}
      {!isConfirmed && (
        <section
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border-light)',
            position: 'sticky',
            top: '64px',
            zIndex: 30,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div className="section-container" style={{ padding: '0.75rem 1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                flexWrap: 'wrap',
              }}
            >
              {STEPS.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (s.id < step) setStep(s.id);
                    }}
                    disabled={s.id > step}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      background: step === s.id ? 'var(--color-primary)' : step > s.id ? 'rgba(22, 163, 74, 0.15)' : 'transparent',
                      color: step === s.id ? '#FFFFFF' : step > s.id ? 'var(--color-success)' : 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: step === s.id ? 600 : 500,
                      cursor: s.id < step ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {step > s.id ? <Check size={16} /> : s.icon}
                    <span>{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <ChevronRight size={14} style={{ color: 'var(--color-text-muted)', opacity: 0.6 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="section-padding" style={{ background: 'var(--color-background)', minHeight: '600px' }}>
        <div className="section-container" style={{ maxWidth: '840px', margin: '0 auto' }}>

          {/* STEP 1: Select Room */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Select Your Preferred Room</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
                  All published rates include 10% Service Charge &amp; 7% VAT. No hidden fees.
                </p>
              </div>

              {errors.selectedRoom && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    color: 'var(--color-destructive)',
                    marginBottom: 'var(--space-md)',
                    fontSize: '0.875rem',
                  }}
                >
                  {errors.selectedRoom}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-md)' }}>
                {rooms.map((room) => {
                  const isSelected = bookingData.selectedRoom === room.slug;
                  return (
                    <div
                      key={room.slug}
                      onClick={() => handleSelectRoom(room.slug)}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-lg)',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        boxShadow: isSelected ? '0 4px 16px rgba(30, 58, 138, 0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Room Photo */}
                      <div
                        style={{
                          position: 'relative',
                          width: '180px',
                          minHeight: '140px',
                          flexShrink: 0,
                          backgroundColor: '#E2E8F0',
                        }}
                      >
                        <Image
                          src={room.image}
                          alt={room.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="180px"
                        />
                      </div>

                      {/* Room Info */}
                      <div
                        style={{
                          padding: 'var(--space-md) var(--space-lg)',
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          gap: '0.35rem',
                          minWidth: '220px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--color-foreground)' }}>{room.name}</h3>
                          <span
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 700,
                              color: 'var(--color-primary)',
                              fontFamily: 'var(--font-heading)',
                            }}
                          >
                            {formatPrice(room.price)}
                            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-muted)' }}> /night</span>
                          </span>
                        </div>

                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>
                          {room.description}
                        </p>

                        <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                          <span>🛏️ {room.bedType}</span>
                          <span>👥 Max {room.maxGuests} Guests</span>
                          {room.roomSize && <span>📐 {room.roomSize}</span>}
                        </div>
                      </div>

                      {/* Select Action */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 var(--space-lg)',
                          background: isSelected ? 'rgba(30, 58, 138, 0.05)' : 'transparent',
                        }}
                      >
                        <button
                          type="button"
                          className={isSelected ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                          style={{ pointerEvents: 'none' }}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xl)' }}>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!bookingData.selectedRoom}
                  className="btn btn-primary btn-lg"
                >
                  Continue to Dates &amp; Guests <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dates & Guests */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Stay Dates &amp; Guests</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
                  Check-in starts at 2:00 PM. Check-out is strictly 12:00 Noon.
                </p>
              </div>

              {/* Selected Room Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  marginBottom: 'var(--space-xl)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div style={{ position: 'relative', width: '60px', height: '50px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <Image src={selectedRoomData.image} alt={selectedRoomData.name} fill style={{ objectFit: 'cover' }} sizes="60px" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{selectedRoomData.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      {formatPrice(selectedRoomData.price)} / night
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Change Room
                </button>
              </div>

              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: 'var(--space-xl)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 'var(--space-lg)',
                }}
              >
                {/* Check In */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    min={getTodayString()}
                    value={bookingData.checkIn}
                    onChange={(e) => updateField('checkIn', e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                  {errors.checkIn && (
                    <span style={{ color: 'var(--color-destructive)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {errors.checkIn}
                    </span>
                  )}
                </div>

                {/* Check Out */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    min={bookingData.checkIn || getTodayString()}
                    value={bookingData.checkOut}
                    onChange={(e) => updateField('checkOut', e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                  {errors.checkOut && (
                    <span style={{ color: 'var(--color-destructive)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {errors.checkOut}
                    </span>
                  )}
                </div>

                {/* Number of Guests */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                    Number of Guests (Max {selectedRoomData.maxGuests}) *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    {[1, 2, selectedRoomData.maxGuests > 2 ? selectedRoomData.maxGuests : null]
                      .filter(Boolean)
                      .map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => updateField('numGuests', num as number)}
                          style={{
                            padding: '0.6rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            border: bookingData.numGuests === num ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                            background: bookingData.numGuests === num ? 'rgba(30, 58, 138, 0.08)' : 'var(--color-surface)',
                            color: bookingData.numGuests === num ? 'var(--color-primary)' : 'var(--color-foreground)',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                  </div>
                  {errors.numGuests && (
                    <span style={{ color: 'var(--color-destructive)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {errors.numGuests}
                    </span>
                  )}
                </div>
              </div>

              {/* Price Calculation Card */}
              <div
                style={{
                  marginTop: 'var(--space-xl)',
                  padding: 'var(--space-lg)',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-md)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Calculated Duration</span>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '1.05rem' }}>
                    {nights} {nights === 1 ? 'Night' : 'Nights'} ({formatDate(bookingData.checkIn)} – {formatDate(bookingData.checkOut)})
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Total Payable</span>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                    {formatPrice(totalAmount)}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-xl)' }}>
                <button type="button" onClick={prevStep} className="btn btn-ghost">
                  <ArrowLeft size={18} /> Back
                </button>
                <button type="button" onClick={nextStep} className="btn btn-primary btn-lg">
                  Continue to Guest Info <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Guest Details */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Your Information</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>
                  Enter your official details. This will be used to generate your official hotel check-in registration.
                </p>
              </div>

              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: 'var(--space-xl)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 'var(--space-lg)',
                }}
              >
                {/* Full Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                    Full Name (As on Valid ID) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ibrahim Musa"
                    value={bookingData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                  {errors.fullName && (
                    <span style={{ color: 'var(--color-destructive)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="08012345678"
                    value={bookingData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                  {errors.phone && (
                    <span style={{ color: 'var(--color-destructive)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="08012345678"
                    value={bookingData.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                  {errors.whatsapp && (
                    <span style={{ color: 'var(--color-destructive)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {errors.whatsapp}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={bookingData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                  {errors.email && (
                    <span style={{ color: 'var(--color-destructive)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Special Requests */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                    Special Requests or Arrival Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Late check-in around 8 PM, extra pillow, quiet room preference..."
                    value={bookingData.specialRequests}
                    onChange={(e) => updateField('specialRequests', e.target.value)}
                    className="form-input"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-xl)' }}>
                <button type="button" onClick={prevStep} className="btn btn-ghost">
                  <ArrowLeft size={18} /> Back
                </button>
                <button type="button" onClick={nextStep} className="btn btn-accent btn-lg">
                  Proceed to Payment <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Bank Transfer & Payment Receipt Upload */}
          {step === 4 && (
            <div className="animate-fade-in-up">
              <div style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    background: 'rgba(0, 82, 255, 0.1)',
                    color: '#0052FF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                  }}
                >
                  <CreditCard size={15} /> Company Payment Gateway
                </span>
                <h2 style={{ fontSize: '1.65rem', marginBottom: '0.25rem' }}>Make Bank Transfer &amp; Upload Receipt</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', maxWidth: '580px', margin: '0 auto' }}>
                  Transfer the exact reservation amount into our official Moniepoint company account, then upload your transaction screenshot below.
                </p>
              </div>

              {/* CRITICAL VERIFICATION ALERT BOX */}
              <div
                style={{
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                  border: '2px solid #F59E0B',
                  marginBottom: 'var(--space-xl)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.12)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                  <div
                    style={{
                      background: '#F59E0B',
                      color: '#FFFFFF',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.35rem 0', color: '#92400E', fontSize: '1.05rem', fontWeight: 700 }}>
                      CRITICAL: Double-Check Recipient Name Before Transfer!
                    </h4>
                    <p style={{ margin: 0, color: '#78350F', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      Before approving this payment in your banking app, ensure the beneficiary name displayed matches:{' '}
                      <strong style={{ textDecoration: 'underline', color: '#B45309' }}>
                        {OFFICIAL_BANK_ACCOUNT.accountName}
                      </strong>
                      . This is the <strong>only official account</strong> authorized to receive hotel payments.
                    </p>
                  </div>
                </div>
              </div>

              {/* OFFICIAL MONIEPOINT BANK CARD */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0A2540 0%, #0052FF 100%)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-xl)',
                  marginBottom: 'var(--space-xl)',
                  boxShadow: '0 12px 30px rgba(0, 82, 255, 0.25)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative background glow */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Header with Bank Badge */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-md)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    paddingBottom: 'var(--space-md)',
                    marginBottom: 'var(--space-lg)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        color: '#0052FF',
                        fontWeight: 900,
                        fontSize: '1.25rem',
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}
                    >
                      M
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                        {OFFICIAL_BANK_ACCOUNT.bankName}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                        All Nigerian Banks &amp; Cards Accepted
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      background: 'rgba(22, 163, 74, 0.25)',
                      border: '1px solid rgba(74, 222, 128, 0.4)',
                      color: '#86EFAC',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <ShieldCheck size={14} /> Official Receiving Account
                  </span>
                </div>

                {/* Account Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
                  
                  {/* Account Number Box */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                      padding: 'var(--space-md) var(--space-lg)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '0.25rem' }}>
                      Account Number
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                      <span
                        style={{
                          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          fontFamily: 'monospace',
                          color: '#FFFFFF',
                        }}
                      >
                        {OFFICIAL_BANK_ACCOUNT.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(OFFICIAL_BANK_ACCOUNT.accountNumber, 'accNumber')}
                        className="btn btn-sm"
                        style={{
                          background: copiedField === 'accNumber' ? '#16A34A' : 'rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.4rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {copiedField === 'accNumber' ? <Check size={15} /> : <Copy size={15} />}
                        <span>{copiedField === 'accNumber' ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Account Name Box */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                      padding: 'var(--space-md) var(--space-lg)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.7)', display: 'block', marginBottom: '0.25rem' }}>
                      Account Name (Double-Check Before Transfer)
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
                        {OFFICIAL_BANK_ACCOUNT.accountName}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(OFFICIAL_BANK_ACCOUNT.accountName, 'accName')}
                        className="btn btn-sm"
                        style={{
                          background: copiedField === 'accName' ? '#16A34A' : 'rgba(255, 255, 255, 0.2)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.4rem 0.65rem',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        {copiedField === 'accName' ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Amount to Pay & Reference Row */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    marginTop: 'var(--space-lg)',
                    paddingTop: 'var(--space-md)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>
                      Exact Amount to Transfer
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FDE047', fontFamily: 'var(--font-heading)' }}>
                        {formatPrice(totalAmount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(totalAmount.toString(), 'amount')}
                        style={{
                          background: copiedField === 'amount' ? '#16A34A' : 'rgba(255, 255, 255, 0.15)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {copiedField === 'amount' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>
                      Payment Reference / Narration
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF' }}>
                        {bookingRef}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bookingRef, 'ref')}
                        style={{
                          background: copiedField === 'ref' ? '#16A34A' : 'rgba(255, 255, 255, 0.15)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {copiedField === 'ref' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOOKING SUMMARY RECAP */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: 'var(--space-lg)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  marginBottom: 'var(--space-xl)',
                }}
              >
                <h4 style={{ margin: '0 0 var(--space-md) 0', fontSize: '1.05rem' }}>Reservation Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-sm)', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Room</span>
                    <p style={{ margin: 0, fontWeight: 600 }}>{selectedRoomData.name}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Dates</span>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {formatDate(bookingData.checkIn)} – {formatDate(bookingData.checkOut)} ({nights} nights)
                    </p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Guest Name</span>
                    <p style={{ margin: 0, fontWeight: 600 }}>{bookingData.fullName}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Phone</span>
                    <p style={{ margin: 0, fontWeight: 600 }}>{bookingData.phone}</p>
                  </div>
                </div>
              </div>

              {/* UPLOAD RECEIPT PROOF SECTION */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: 'var(--space-xl)',
                  borderRadius: 'var(--radius-xl)',
                  border: errors.receipt ? '2px solid var(--color-destructive)' : '1px solid var(--color-border)',
                  marginBottom: 'var(--space-xl)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Upload size={20} style={{ color: 'var(--color-primary)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Upload Payment Receipt / Proof of Transfer *</h3>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
                  Take a screenshot or photo of your successful transfer / debit alert and upload it here so our front desk can confirm your booking instantly.
                </p>

                {errors.receipt && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      color: 'var(--color-destructive)',
                      marginBottom: 'var(--space-md)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <AlertTriangle size={16} />
                    <span>{errors.receipt}</span>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleReceiptChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: 'none' }}
                  id="receipt-file-input"
                />

                {!receiptPreview ? (
                  /* Empty Upload Dropzone */
                  <label
                    htmlFor="receipt-file-input"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-sm)',
                      padding: 'var(--space-2xl) var(--space-lg)',
                      borderRadius: 'var(--radius-lg)',
                      border: '2px dashed var(--color-border)',
                      backgroundColor: 'var(--color-background)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(30, 58, 138, 0.08)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Upload size={28} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>
                        Click here to upload payment screenshot
                      </strong>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                        Supports PNG, JPG, JPEG, WEBP (Max 10MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  /* Attached Receipt Preview */
                  <div
                    style={{
                      padding: 'var(--space-lg)',
                      borderRadius: 'var(--radius-lg)',
                      background: 'rgba(22, 163, 74, 0.05)',
                      border: '1px solid rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          color: 'var(--color-success)',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        <CheckCircle2 size={18} /> Receipt Attached Successfully
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveReceipt}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-destructive)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <X size={16} /> Remove
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                      <div
                        style={{
                          position: 'relative',
                          width: '120px',
                          height: '140px',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={receiptPreview}
                          alt="Payment Receipt Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '0.95rem' }}>
                          {receiptFile?.name || 'receipt-screenshot.png'}
                        </p>
                        <p style={{ margin: '0 0 var(--space-md) 0', fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                          Size: {receiptFile ? `${(receiptFile.size / 1024).toFixed(1)} KB` : 'Verified image'}
                        </p>
                        <label
                          htmlFor="receipt-file-input"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            background: '#FFFFFF',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <RefreshCw size={14} /> Replace File
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <button type="button" onClick={prevStep} className="btn btn-ghost">
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitBookingAndPayment}
                  disabled={isSubmitting}
                  className="btn btn-accent btn-lg"
                  style={{
                    minWidth: '280px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '1rem',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Saving &amp; Processing...</span>
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      <span>Submit Booking &amp; Send to WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation Success Screen */}
          {step === 5 && isConfirmed && (
            <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '84px',
                  height: '84px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(22, 163, 74, 0.1)',
                  color: 'var(--color-success)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <CheckCircle2 size={48} />
              </div>

              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Booking &amp; Payment Submitted!</h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  maxWidth: '520px',
                  margin: '0 auto var(--space-xl)',
                  fontSize: '0.95rem',
                }}
              >
                Your reservation and payment transfer proof have been saved to our hotel system. Send the prefilled details to our reception on WhatsApp to finalize check-in.
              </p>

              {/* Reference Card */}
              <div
                style={{
                  display: 'inline-block',
                  background: 'var(--color-surface)',
                  padding: 'var(--space-lg) var(--space-2xl)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  marginBottom: 'var(--space-xl)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Booking Reference
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)', marginTop: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      color: 'var(--color-primary)',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {bookingRef}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bookingRef, 'finalRef')}
                    className="btn btn-ghost btn-sm"
                    title="Copy reference"
                  >
                    {copiedField === 'finalRef' ? <Check size={18} style={{ color: 'var(--color-success)' }} /> : <Copy size={18} />}
                  </button>
                </div>
                {copiedField === 'finalRef' && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', display: 'block', marginTop: '0.25rem' }}>
                    Reference Copied!
                  </span>
                )}
              </div>

              {/* Summary Details Box */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: 'var(--space-xl)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  maxWidth: '560px',
                  margin: '0 auto var(--space-xl)',
                  textAlign: 'left',
                }}
              >
                <h4 style={{ margin: '0 0 var(--space-md) 0', fontSize: '1.05rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
                  Booking Summary
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Guest Name:</span>
                    <strong>{bookingData.fullName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Room Category:</span>
                    <strong>{selectedRoomData.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Check-in:</span>
                    <strong>{formatDate(bookingData.checkIn)} (from 2:00 PM)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Check-out:</span>
                    <strong>{formatDate(bookingData.checkOut)} (strictly 12:00 Noon)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Duration &amp; Guests:</span>
                    <strong>{nights} {nights === 1 ? 'Night' : 'Nights'} • {bookingData.numGuests} Guests</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Payment Method:</span>
                    <strong>Bank Transfer ({OFFICIAL_BANK_ACCOUNT.bankName})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    <strong style={{ fontSize: '1rem' }}>Total Paid:</strong>
                    <strong style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>{formatPrice(totalAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Proof of Payment:</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={16} /> Attached &amp; Saved
                    </span>
                  </div>
                </div>
              </div>

              {/* WHATSAPP CONFIRMATION CTA */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-md)',
                  alignItems: 'center',
                  maxWidth: '560px',
                  margin: '0 auto',
                }}
              >
                <a
                  href={getWhatsAppBookingURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '1.05rem',
                    padding: '0.9rem 1.5rem',
                    boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
                  }}
                >
                  <MessageCircle size={22} />
                  Open WhatsApp to Confirm Booking
                </a>

                <Link href="/" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
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
