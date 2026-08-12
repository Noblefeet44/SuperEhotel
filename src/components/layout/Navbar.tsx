'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/restaurant', label: 'Restaurant' },
  { href: '/gym', label: 'Fitness' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : 'at-top'}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" prefetch={true}>
          Super E<br />
          <span style={{ fontSize: '0.65em', fontWeight: 500, letterSpacing: '0.05em' }}>
            LUXURY HOTEL & SUITES
          </span>
        </Link>

        {/* Perfectly aligned horizontal navigation bar */}
        <div className="navbar-links">
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
          <Link
            href="/book"
            onClick={() => handleNavClick('/book')}
            className="btn btn-accent btn-sm nav-book-btn"
            prefetch={true}
          >
            Book Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
