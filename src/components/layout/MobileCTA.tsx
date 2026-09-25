'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Utensils, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { HOTEL_INFO } from '@/lib/hotel-data';
import { generatePhoneURL, generateWhatsAppURL } from '@/lib/utils';
import { HotelPoliciesModal } from '@/components/common/HotelPoliciesModal';

export function MobileCTA() {
  const pathname = usePathname();
  const [showPolicies, setShowPolicies] = useState(false);

  // Do not render mobile public bottom bar inside admin dashboard
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="mobile-cta-bar">
        <Link
          href="/book"
          onClick={(e) => handleNavClick('/book', e)}
          className={`cta-item ${pathname === '/book' ? 'active' : ''}`}
          prefetch={true}
        >
          <Calendar size={18} />
          <span>Book</span>
        </Link>

        <Link
          href="/rooms"
          onClick={(e) => handleNavClick('/rooms', e)}
          className={`cta-item ${pathname.startsWith('/rooms') ? 'active' : ''}`}
          prefetch={true}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>🛏️</span>
          <span>Rooms</span>
        </Link>

        <a
          href={generateWhatsAppURL(HOTEL_INFO.whatsappNumber, 'Hello Super E Hotel! I would like to book a room.')}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-item whatsapp"
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </a>

        <a
          href={generatePhoneURL(HOTEL_INFO.hotlines[0])}
          className="cta-item call"
        >
          <Phone size={18} />
          <span>Call Desk</span>
        </a>

        <button
          type="button"
          onClick={() => setShowPolicies(true)}
          className="cta-item policy"
          aria-label="View Hotel Policies"
        >
          <ShieldCheck size={18} />
          <span>Policies</span>
        </button>
      </div>

      <HotelPoliciesModal isOpen={showPolicies} onClose={() => setShowPolicies(false)} />
    </>
  );
}
