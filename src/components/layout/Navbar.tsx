'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { HOTEL_INFO } from '@/lib/hotel-data';
import { generateWhatsAppURL, generatePhoneURL } from '@/lib/utils';
import { HotelPoliciesModal } from '@/components/common/HotelPoliciesModal';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms & Rates' },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/gym', label: 'Gym & Fitness' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (href: string) => {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : 'at-top'}`}>
        <div className="navbar-inner">
          {/* Logo & Brand Identity */}
          <Link href="/" className="navbar-brand-link" prefetch={true}>
            <div className="navbar-logo-badge">
              <Image
                src={HOTEL_INFO.logoUrl}
                alt="Super E Hotel Logo"
                width={38}
                height={38}
                priority
                className="hotel-logo-img"
              />
            </div>
            <div className="navbar-text">
              <span className="brand-title">Super E</span>
              <span className="brand-subtitle">LUXURY HOTEL &amp; SUITES</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-links desktop-only">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`nav-pill ${isActive ? 'active' : ''}`}
                  prefetch={true}
                >
                  {link.label}
                </Link>
              );
            })}

            <button
              onClick={() => setShowPolicies(true)}
              className="nav-pill policies-btn"
              type="button"
            >
              Policies
            </button>

            <Link
              href="/book"
              onClick={() => handleNavClick('/book')}
              className="btn btn-accent btn-sm nav-book-btn"
              prefetch={true}
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Right Controls: Book button + Hamburger */}
          <div className="navbar-mobile-controls mobile-only">
            <Link
              href="/book"
              className="mobile-quick-book-btn"
              prefetch={true}
            >
              Book Now
            </Link>
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              type="button"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Image
                  src={HOTEL_INFO.logoUrl}
                  alt="Super E Hotel Logo"
                  width={34}
                  height={34}
                  className="hotel-logo-img rounded"
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                    Super E Luxury Hotel
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748B' }}>
                    Where comfort meets luxury...
                  </p>
                </div>
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={16} style={{ color: '#94A3B8' }} />
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowPolicies(true);
                }}
                className="mobile-nav-link policy-link"
                type="button"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} style={{ color: '#D97706' }} />
                  <span>Hotel Rules &amp; Policies</span>
                </div>
                <ChevronRight size={16} style={{ color: '#94A3B8' }} />
              </button>
            </nav>

            <div className="mobile-drawer-footer">
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary btn-block"
                style={{ textAlign: 'center', marginBottom: '0.65rem' }}
              >
                Reserve a Room Now
              </Link>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <a
                  href={generateWhatsAppURL(HOTEL_INFO.whatsappNumber, 'Hello Super E Hotel! I would like to make an inquiry.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                  style={{ justifyContent: 'center' }}
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a
                  href={generatePhoneURL(HOTEL_INFO.hotlines[0])}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'center' }}
                >
                  <Phone size={15} /> Call Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policies Modal */}
      <HotelPoliciesModal isOpen={showPolicies} onClose={() => setShowPolicies(false)} />
    </>
  );
}
