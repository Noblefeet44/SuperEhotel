'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '@/components/common/SocialIcons';
import { HOTEL_INFO, INITIAL_ROOMS_DATA } from '@/lib/hotel-data';
import { generateWhatsAppURL, generatePhoneURL } from '@/lib/utils';
import { HotelPoliciesModal } from '@/components/common/HotelPoliciesModal';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [showPolicies, setShowPolicies] = useState(false);

  // Do not render public footer inside admin dashboard
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
  });

  // Fetch social links from settings
  useEffect(() => {
    async function fetchSocial() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSocialLinks({
            facebook: data.settings.facebook_url || '',
            instagram: data.settings.instagram_url || '',
            twitter: data.settings.twitter_url || '',
          });
        }
      } catch {
        // Silently fail — social links are optional
      }
    }
    fetchSocial();
  }, []);

  const hasSocialLinks = socialLinks.facebook || socialLinks.instagram || socialLinks.twitter;

  return (
    <>
      <footer className="footer" style={{ paddingBottom: 'calc(var(--space-3xl) + 60px)' }}>
        <div className="section-container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <Image
                  src={HOTEL_INFO.logoUrl}
                  alt="Super E Logo"
                  width={46}
                  height={46}
                  className="hotel-logo-img rounded"
                  style={{ border: '1px solid rgba(202, 138, 4, 0.4)' }}
                />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', margin: 0, color: '#FFFFFF' }}>
                    {HOTEL_INFO.name}
                  </h4>
                  <p style={{
                    fontFamily: 'var(--font-heading)',
                    fontStyle: 'italic',
                    color: 'var(--color-accent-light)',
                    margin: 0,
                    fontSize: '0.85rem'
                  }}>
                    {HOTEL_INFO.tagline}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                Experience unparalleled hospitality, modern comfort, and executive serenity in Keffi, Nasarawa State. 
                All rates include 10% Service Charge &amp; 7% VAT.
              </p>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <a
                  href={generateWhatsAppURL(HOTEL_INFO.whatsappNumber, 'Hello! I would like to make an inquiry at Super E Luxury Hotel.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  WhatsApp Front Desk
                </a>
                <button
                  type="button"
                  onClick={() => setShowPolicies(true)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <ShieldCheck size={15} style={{ color: '#FDE047' }} />
                  Hotel Policies
                </button>
              </div>

              {/* Social Media Icons */}
              {hasSocialLinks && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(24, 119, 242, 0.15)',
                        border: '1px solid rgba(24, 119, 242, 0.3)',
                        color: '#60A5FA',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <FacebookIcon size={20} />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(228, 64, 95, 0.15)',
                        border: '1px solid rgba(228, 64, 95, 0.3)',
                        color: '#F472B6',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <InstagramIcon size={20} />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow us on Twitter"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(29, 161, 242, 0.15)',
                        border: '1px solid rgba(29, 161, 242, 0.3)',
                        color: '#38BDF8',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <TwitterIcon size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h4>Quick Navigation</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <Link href="/rooms">Rooms &amp; Rates (8 Categories)</Link>
                <Link href="/hall">Event &amp; Banquet Hall</Link>
                <Link href="/restaurant">Restaurant &amp; Dining</Link>
                <Link href="/bar-lounge">VIP Lounge &amp; Bar</Link>
                <Link href="/facilities">Hotel Facilities</Link>
                <Link href="/about">About Super E</Link>
                <Link href="/contact">Location &amp; Contact</Link>
                <Link href="/book">Reserve a Room</Link>
              </div>
            </div>

            {/* Room Categories */}
            <div>
              <h4>Our 8 Room Types</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                {INITIAL_ROOMS_DATA.map((room) => (
                  <Link
                    key={room.slug}
                    href={`/rooms?category=${room.category.toLowerCase()}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.8)' }}
                  >
                    <span>{room.name}</span>
                    <span style={{ color: 'var(--color-accent-light)', fontWeight: 600 }}>₦{room.price.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4>Contact &amp; Location</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                  <MapPin size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-accent-light)' }} />
                  <span style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {HOTEL_INFO.address}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {HOTEL_INFO.hotlines.map((num) => (
                    <a
                      key={num}
                      href={generatePhoneURL(num)}
                      style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', fontSize: '0.875rem' }}
                    >
                      <Phone size={16} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                      <span>{num}</span>
                    </a>
                  ))}
                </div>

                <a
                  href={`mailto:${HOTEL_INFO.email}`}
                  style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', fontSize: '0.85rem', wordBreak: 'break-all' }}
                >
                  <Mail size={16} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                  <span>{HOTEL_INFO.email}</span>
                </a>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <Clock size={16} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                  <span>24/7 Front Desk Reception</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {currentYear} {HOTEL_INFO.name} All rights reserved. Check-out: 12 Noon.</p>
          </div>
        </div>
      </footer>

      <HotelPoliciesModal isOpen={showPolicies} onClose={() => setShowPolicies(false)} />
    </>
  );
}
