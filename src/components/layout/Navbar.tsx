'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : 'at-top'}`}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            Super E<br />
            <span style={{ fontSize: '0.65em', fontWeight: 500, letterSpacing: '0.05em' }}>
              LUXURY HOTEL & SUITES
            </span>
          </Link>

          <div className="navbar-links">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/book" className="btn btn-accent btn-sm">
              Book Now
            </Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="mobile-menu">
            <button
              className="mobile-menu-close"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: '1.5rem' }}>
              <Link
                href="/book"
                className="btn btn-accent"
                style={{ width: '100%' }}
                onClick={() => setIsMobileOpen(false)}
              >
                Book a Room
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
