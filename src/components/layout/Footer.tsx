import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { generateWhatsAppURL, generatePhoneURL } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = '09131964939';
  const phoneNumber = '09131964939';

  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}>
              Super E Luxury Hotel & Suites
            </h4>
            <p style={{ 
              fontFamily: 'var(--font-heading)', 
              fontStyle: 'italic', 
              color: 'var(--color-accent-light)',
              marginBottom: '1rem',
              fontSize: '0.9375rem'
            }}>
              Luxury at Its Peak
            </p>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Experience unparalleled luxury and comfort in the heart of Keffi, Nigeria. 
              Your perfect stay awaits.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={generateWhatsAppURL(whatsappNumber, 'Hello! I would like to learn more about Super E Luxury Hotel.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/rooms">Our Rooms</Link>
              <Link href="/restaurant">Restaurant</Link>
              <Link href="/gym">Gym & Fitness</Link>
              <Link href="/facilities">Facilities</Link>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/book">Book a Room</Link>
            </div>
          </div>

          {/* Room Types */}
          <div>
            <h4>Accommodation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <Link href="/rooms?category=standard">Standard Rooms</Link>
              <Link href="/rooms?category=deluxe">Deluxe Rooms</Link>
              <Link href="/rooms?category=executive">Executive Rooms</Link>
              <Link href="/rooms?category=vip-luxury-suite">VIP / Luxury Suites</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-accent-light)' }} />
                <span>Keffi, Nasarawa State, Nigeria</span>
              </div>
              <a
                href={generatePhoneURL(phoneNumber)}
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
              >
                <Phone size={18} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:info@superehotel.com`}
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
              >
                <Mail size={18} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                <span>info@superehotel.com</span>
              </a>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-accent-light)' }} />
                <span>24/7 — Always Open</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Super E Luxury Hotel & Suites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
