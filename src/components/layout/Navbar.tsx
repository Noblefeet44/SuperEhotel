'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/gym', label: 'Gym & Fitness' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
              <Link key={link.href} href={link.href} onClick={() => handleNavClick(link.href)} prefetch={true}>
                {link.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => handleNavClick('/book')} className="btn btn-accent btn-sm" prefetch={true}>
              Book Now
            </Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown from Top */}
      {isMobileOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="mobile-menu-top">
            <div className="mobile-menu-header">
              <Link href="/" className="navbar-logo" prefetch={true} onClick={() => handleNavClick('/')}>
                Super E<br />
                <span style={{ fontSize: '0.65em', fontWeight: 500, letterSpacing: '0.05em' }}>
                  LUXURY HOTEL & SUITES
                </span>
              </Link>
              <button
                className="mobile-menu-close-btn"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mobile-menu-nav">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-item"
                  prefetch={true}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mobile-nav-cta">
                <Link
                  href="/book"
                  className="btn btn-accent"
                  style={{ width: '100%', justifyContent: 'center' }}
                  prefetch={true}
                  onClick={() => setIsMobileOpen(false)}
                >
                  Book a Room
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

    </>
  );
}

