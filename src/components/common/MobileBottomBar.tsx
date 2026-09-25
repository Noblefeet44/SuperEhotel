'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Phone, MessageCircle, FileText } from 'lucide-react';
import { HOTEL_INFO } from '@/lib/hotel-data';
import { generateWhatsAppURL, generatePhoneURL } from '@/lib/utils';
import { HotelPoliciesModal } from './HotelPoliciesModal';

export function MobileBottomBar() {
  const pathname = usePathname();
  const [showPolicies, setShowPolicies] = useState(false);

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const whatsappLink = generateWhatsAppURL(
    HOTEL_INFO.whatsappNumber,
    'Hello! I would like to inquire about room availability and reservations at Super E Luxury Hotel.'
  );

  return (
    <>
      <div className="mobile-bottom-bar">
        <Link href="/book" className="mobile-bar-action primary">
          <Calendar size={18} />
          <span>Book Room</span>
        </Link>

        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mobile-bar-action whatsapp">
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </a>

        <a href={generatePhoneURL(HOTEL_INFO.hotlines[0])} className="mobile-bar-action phone">
          <Phone size={18} />
          <span>Call Desk</span>
        </a>

        <button
          type="button"
          onClick={() => setShowPolicies(true)}
          className="mobile-bar-action policy"
          aria-label="View hotel policies"
        >
          <FileText size={18} />
          <span>Policies</span>
        </button>
      </div>

      <HotelPoliciesModal isOpen={showPolicies} onClose={() => setShowPolicies(false)} />
    </>
  );
}
