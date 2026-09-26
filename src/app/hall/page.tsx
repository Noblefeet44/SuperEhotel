'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar, Clock, Users, Zap, Snowflake, Mic, Shield,
  Car, Utensils, Sparkles, Check, ArrowRight, Phone,
  MessageCircle, HelpCircle, ChevronDown, CheckCircle2,
  CalendarCheck, Award, MapPin
} from 'lucide-react';
import {
  HALL_INFO, HALL_AMENITIES, HALL_LAYOUTS,
  HALL_PACKAGES, HALL_FAQS, HallPackage
} from '@/lib/hall-data';
import { formatPrice, generateWhatsAppURL } from '@/lib/utils';

export default function HallPage() {
  const [selectedPackage, setSelectedPackage] = useState<HallPackage>(HALL_PACKAGES[1]);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>(HALL_INFO.images[0]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('Wedding Reception');
  const [eventDate, setEventDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Full Day (8:00 AM – 8:00 PM)');
  const [guestCount, setGuestCount] = useState('200 – 300 Guests');
  const [specialNotes, setSpecialNotes] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'High-Output PA Sound System & Wireless Mics',
    'Industrial Air Conditioning Guarantee',
  ]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const handleSelectPackage = (pkg: HallPackage) => {
    setSelectedPackage(pkg);
    const formElement = document.getElementById('hall-reservation-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !eventDate) {
      alert('Please fill in your name, contact phone, and desired event date.');
      return;
    }

    const ref = `SE-HALL-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(ref);

    const bookingPayload = {
      id: ref,
      createdAt: new Date().toISOString(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim(),
      eventType,
      eventDate,
      timeSlot,
      guestCount,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      packagePrice: selectedPackage.price,
      addons: selectedAddons,
      specialNotes: specialNotes.trim(),
      status: 'pending', // 'pending' | 'confirmed' | 'completed' | 'cancelled'
    };

    // Store in localStorage for admin panel to read
    try {
      const existing = localStorage.getItem('super_e_hall_bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(bookingPayload);
      localStorage.setItem('super_e_hall_bookings', JSON.stringify(list));
      window.dispatchEvent(new Event('super_e_hall_booking_created'));
    } catch (err) {
      console.error('Failed to store hall booking:', err);
    }

    // Format WhatsApp Message
    const waText = `🏛️ *NEW EVENT HALL RESERVATION INQUIRY*
🏨 *Super E Luxury Hotel & Suites (Keffi)*
━━━━━━━━━━━━━━━━━━━━
📌 *Reference:* ${ref}
👤 *Organizer:* ${fullName.trim()}
📞 *Phone:* ${phone.trim()}
📱 *WhatsApp:* ${whatsapp.trim() || phone.trim()}
✉️ *Email:* ${email.trim() || 'Not specified'}

🎉 *Event Type:* ${eventType}
📅 *Event Date:* ${eventDate}
⏰ *Time Slot:* ${timeSlot}
👥 *Expected Guests:* ${guestCount}

📦 *Selected Package:* ${selectedPackage.name} (${formatPrice(selectedPackage.price)})
✨ *Add-ons Requested:*
${selectedAddons.length > 0 ? selectedAddons.map((a) => ` • ${a}`).join('\n') : ' • Standard Package Inclusions'}

📝 *Special Requests / Notes:*
${specialNotes.trim() || 'None'}
━━━━━━━━━━━━━━━━━━━━
*Sent via supereluxuryhotel.com/hall*`;

    const waUrl = generateWhatsAppURL('07066472533', waText);
    setFormSubmitted(true);

    // Open WhatsApp
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap size={24} />;
      case 'snowflake': return <Snowflake size={24} />;
      case 'mic': return <Mic size={24} />;
      case 'users': return <Users size={24} />;
      case 'shield': return <Shield size={24} />;
      case 'car': return <Car size={24} />;
      case 'utensils': return <Utensils size={24} />;
      case 'sparkles': return <Sparkles size={24} />;
      default: return <Sparkles size={24} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          paddingTop: 'calc(80px + 3.5rem)',
          paddingBottom: '4.5rem',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 58, 138, 0.94) 100%), url(/images/event-hall-banquet.jpg) center/cover no-repeat',
          color: '#FFFFFF',
        }}
      >
        <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(217, 119, 6, 0.25)',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                color: '#FDE68A',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Award size={16} /> Keffi’s Premier Event &amp; Banquet Center
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                marginBottom: '1.2rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              Grand Event &amp; Banquet Hall in Keffi
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.02rem, 2vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '740px',
                marginInline: 'auto',
              }}
            >
              The premier venue for wedding receptions, corporate conferences, AGMs, seminars, and celebratory banquets. Accommodating up to <strong>500 guests</strong> with guaranteed 24/7 power, industrial climate control, acoustic stage, and secure VIP parking.
            </p>

            {/* Quick Guarantees Chips */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.75rem',
                marginBottom: '2.25rem',
              }}
            >
              {[
                { icon: <Users size={16} />, text: 'Up to 500 Guests' },
                { icon: <Zap size={16} />, text: 'Guaranteed 24/7 Standby Power' },
                { icon: <Snowflake size={16} />, text: 'Commercial AC Climate Control' },
                { icon: <Mic size={16} />, text: 'Acoustic Stage & Pro PA Sound' },
                { icon: <Car size={16} />, text: 'Gated Secure VIP Parking' },
              ].map((chip, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  {chip.icon} {chip.text}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="#hall-reservation-form"
                className="btn btn-accent btn-lg"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 800,
                  boxShadow: '0 8px 25px rgba(217, 119, 6, 0.4)',
                }}
              >
                <CalendarCheck size={20} />
                Reserve Hall Online
              </a>

              <a
                href={generateWhatsAppURL('07066472533', 'Hello Super E Hotel! I would like to inquire about booking your Event Hall for an upcoming event.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>

              <a
                href="tel:07066472533"
                className="btn btn-outline-white btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Phone size={18} />
                Call Hotline
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PHOTO GALLERY & HIGHLIGHTS
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="section-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">State-of-the-Art Venue</p>
            <h2 className="section-title">An Elegant Atmosphere for Memorable Events</h2>
            <div className="divider" />
            <p className="section-description" style={{ maxWidth: '700px', margin: '0 auto' }}>
              From lavish wedding banquets with ambient mood lighting to high-level corporate symposiums and government summits in Keffi, Nasarawa State.
            </p>
          </div>

          {/* Main Visual Showcase */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {/* Featured Big Image */}
            <div
              style={{
                position: 'relative',
                height: '420px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                border: '1px solid #E2E8F0',
              }}
            >
              <Image
                src={selectedGalleryImg}
                alt="Super E Event Hall Keffi"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  insetInline: 0,
                  padding: '1.5rem',
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 100%)',
                  color: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#FCD34D', fontWeight: 700 }}>
                  <MapPin size={16} /> 11 Hassan Chiroma Street, G.R.A, Keffi
                </div>
                <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 800 }}>
                  {HALL_INFO.name}
                </h3>
              </div>
            </div>

            {/* Thumbnail Pickers & Venue Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                Venue Perspectives
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {HALL_INFO.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedGalleryImg(img)}
                    style={{
                      position: 'relative',
                      height: '80px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: selectedGalleryImg === img ? '3px solid #D97706' : '1px solid #CBD5E1',
                      cursor: 'pointer',
                      padding: 0,
                      outline: 'none',
                    }}
                  >
                    <Image src={img} alt={`Perspective ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>

              {/* Seating Capacities Grid */}
              <div
                style={{
                  marginTop: '0.5rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                  Customizable Seating Capacities
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  {HALL_LAYOUTS.map((layout, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', display: 'block' }}>
                        {layout.capacity}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: '#1E293B', display: 'block', margin: '0.15rem 0' }}>
                        {layout.name}
                      </strong>
                      <span style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.3, display: 'block' }}>
                        {layout.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HALL AMENITIES & SPECIFICATIONS
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="section-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Unrivaled Infrastructure</p>
            <h2 className="section-title">Built for Flawless Ceremonies &amp; Summits</h2>
            <div className="divider" />
            <p className="section-description" style={{ maxWidth: '680px', margin: '0 auto' }}>
              We eliminate the common event headaches in Nigeria: guaranteed constant electricity, arctic air cooling, clear acoustic sound, and tight security.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {HALL_AMENITIES.map((amenity, idx) => (
              <div
                key={idx}
                className="card-static"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.1rem',
                  alignItems: 'flex-start',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(30, 58, 138, 0.08)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getAmenityIcon(amenity.iconName)}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                    {amenity.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>
                    {amenity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OFFICIAL HALL PACKAGES & PRICING
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="section-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label">Transparent Rates</p>
            <h2 className="section-title">Hall Rental Packages &amp; Rates</h2>
            <div className="divider" />
            <p className="section-description" style={{ maxWidth: '650px', margin: '0 auto' }}>
              Select a tailored package for your corporate lecture, full-day wedding reception, or executive night gala.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '2rem',
              alignItems: 'stretch',
            }}
          >
            {HALL_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  style={{
                    backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                    borderRadius: '18px',
                    border: isSelected ? '2px solid #D97706' : '1px solid #E2E8F0',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: isSelected ? '0 15px 35px rgba(217, 119, 6, 0.12)' : '0 4px 15px rgba(0,0,0,0.04)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {pkg.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: pkg.popular ? '#D97706' : '#1E3A8A',
                        color: '#FFFFFF',
                        padding: '0.25rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                      {pkg.name}
                    </h3>
                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4 }}>
                      {pkg.tagline}
                    </p>

                    <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1E3A8A' }}>
                        {formatPrice(pkg.price)}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
                        ⏱ {pkg.duration}
                      </span>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Package Inclusions:
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {pkg.features.map((feat, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                            <Check size={16} style={{ color: '#16A34A', marginTop: '2px', flexShrink: 0 }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg)}
                      className={isSelected ? 'btn btn-accent' : 'btn btn-outline'}
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 size={18} /> Selected Package
                        </>
                      ) : (
                        'Select This Package'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INTERACTIVE RESERVATION INQUIRY FORM
          ═══════════════════════════════════════════ */}
      <section id="hall-reservation-form" className="section-padding" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="section-container" style={{ maxWidth: '920px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">Reserve Your Date</p>
            <h2 className="section-title">Hall Booking &amp; Date Reservation Inquiry</h2>
            <div className="divider" />
            <p className="section-description" style={{ margin: '0 auto' }}>
              Fill out this instant inquiry form. Our event team will immediately check date availability, generate your reservation quote, and connect with you on WhatsApp.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: 'clamp(1.25rem, 3vw, 2.5rem)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
            }}
          >
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  Reservation Request Submitted!
                </h3>
                <p style={{ fontSize: '0.98rem', color: '#475569', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
                  Your inquiry reference code is <strong style={{ color: '#D97706' }}>{bookingRef}</strong>. We are opening WhatsApp so you can instantly send this booking request to our front desk event manager.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="btn btn-secondary"
                  >
                    Submit Another Inquiry
                  </button>
                  <a
                    href="tel:07066472533"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Phone size={16} /> Call 07066472533
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                {/* Selected Package Banner */}
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '12px',
                    padding: '0.85rem 1.15rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>
                      Selected Package
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1E3A8A' }}>
                      {selectedPackage.name}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#D97706' }}>
                      {formatPrice(selectedPackage.price)}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B' }}>
                      {selectedPackage.duration}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  {/* Full Name */}
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Your Full Name / Organization *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Barr. Emmanuel Audu / Apex Consult"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="e.g. 08012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  {/* WhatsApp */}
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      WhatsApp Number (For Instant Confirmation)
                    </label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="e.g. 07066472533"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      className="input"
                      placeholder="e.g. emmanuel@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  {/* Event Type */}
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Event Type *
                    </label>
                    <select
                      className="input"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Conference / Seminar / Workshop">Conference / Seminar / Workshop</option>
                      <option value="Annual General Meeting (AGM)">Annual General Meeting (AGM)</option>
                      <option value="Birthday Banquet / Anniversary">Birthday Banquet / Anniversary</option>
                      <option value="Gala Dinner & Award Night">Gala Dinner &amp; Award Night</option>
                      <option value="Church Summit / Religious Program">Church Summit / Religious Program</option>
                      <option value="Political / Civic Reception">Political / Civic Reception</option>
                      <option value="Other Social Gathering">Other Social Gathering</option>
                    </select>
                  </div>

                  {/* Event Date */}
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Target Event Date *
                    </label>
                    <input
                      type="date"
                      className="input"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
                  {/* Time Slot */}
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Time Slot
                    </label>
                    <select
                      className="input"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    >
                      <option value="Morning Session (8:00 AM – 1:00 PM)">Morning Session (8:00 AM – 1:00 PM)</option>
                      <option value="Afternoon / Evening (2:00 PM – 8:00 PM)">Afternoon / Evening (2:00 PM – 8:00 PM)</option>
                      <option value="Full Day (8:00 AM – 8:00 PM)">Full Day (8:00 AM – 8:00 PM)</option>
                      <option value="Executive Gala & Late Night (8:00 AM – 11:30 PM)">Executive Gala &amp; Late Night (8:00 AM – 11:30 PM)</option>
                      <option value="Multi-Day Summit / Conference">Multi-Day Summit / Conference</option>
                    </select>
                  </div>

                  {/* Estimated Guests */}
                  <div>
                    <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                      Estimated Guest Count
                    </label>
                    <select
                      className="input"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                    >
                      <option value="50 – 100 Guests">50 – 100 Guests</option>
                      <option value="100 – 200 Guests">100 – 200 Guests</option>
                      <option value="200 – 300 Guests">200 – 300 Guests (Banquet Fit)</option>
                      <option value="300 – 500 Guests">300 – 500 Guests (Auditorium Fit)</option>
                      <option value="500+ Guests">500+ Guests (Requires Overflow Planning)</option>
                    </select>
                  </div>
                </div>

                {/* Add-ons Checklist */}
                <div style={{ marginBottom: '1.5rem', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '0.75rem' }}>
                    Select Add-on Services Needed:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.65rem' }}>
                    {[
                      'High-Output PA Sound System & Wireless Mics',
                      'Industrial Air Conditioning Guarantee',
                      'Projector & Large Presentation Screen',
                      'Stage Mood & Event Lighting Package',
                      'Banquet Linen & Chiavari Chair Arrangement',
                      'In-House Nigerian Buffet Catering',
                      'Stocked Bar Drinks & Chilled Beverages Package',
                      'VIP Bridal / Speaker Dressing Room',
                      'Discounted Overnight Hotel Room Block',
                    ].map((addon, i) => (
                      <label
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.84rem',
                          color: '#334155',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon)}
                          onChange={() => toggleAddon(addon)}
                          style={{ width: '16px', height: '16px', accentColor: '#D97706' }}
                        />
                        <span>{addon}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="label" style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>
                    Special Requests, Floor Plan or Decor Details
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Tell us any specific requirements, external caterers, stage dimensions, or VIP protocol needs..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                  />
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    className="btn btn-accent btn-lg"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '1.05rem',
                      padding: '1rem',
                      boxShadow: '0 8px 25px rgba(217, 119, 6, 0.35)',
                    }}
                  >
                    <MessageCircle size={20} />
                    Send Reservation Inquiry via WhatsApp
                  </button>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B', textAlign: 'center' }}>
                    🔒 We do not charge online payment immediately. An event coordinator will confirm date lock upon physical inspection or bank transfer deposit.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FREQUENTLY ASKED QUESTIONS
          ═══════════════════════════════════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="section-container" style={{ maxWidth: '800px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">Questions &amp; Answers</p>
            <h2 className="section-title">Hall Booking FAQs</h2>
            <div className="divider" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {HALL_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.15rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#0F172A',
                    }}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={20}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        color: '#64748B',
                        flexShrink: 0,
                        marginLeft: '1rem',
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INSPECTION & CONTACT BANNER
          ═══════════════════════════════════════════ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '3rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="section-container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Ready to Inspect the Hall in Person?
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '1.75rem' }}>
            Visit us today at 11 Hassan Chiroma Street, Adjacent Alvari Hotel G.R.A, Keffi, Nasarawa State. Our banquet manager will personally walk you through the hall and audio-visual setups.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="tel:07066472533"
              className="btn btn-accent btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
            >
              <Phone size={18} /> Call Event Desk: 07066472533
            </a>
            <a
              href={generateWhatsAppURL('07066472533', 'Hello, I want to book an on-site physical inspection of the Super E Event Hall.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <MessageCircle size={18} /> Schedule Inspection on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
