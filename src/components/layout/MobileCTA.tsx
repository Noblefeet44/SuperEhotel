'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Utensils, Phone } from 'lucide-react';
import { generatePhoneURL } from '@/lib/utils';

export function MobileCTA() {
  const phoneNumber = '09131964939';
  const pathname = usePathname();

  const handleRestaurantClick = (e: React.MouseEvent) => {
    if (pathname === '/restaurant') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    if (pathname === '/book') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mobile-cta-bar">
      <Link href="/book" onClick={handleBookClick} className="cta-book" prefetch={true}>
        <Calendar size={20} />
        <span>Book Room</span>
      </Link>
      <Link href="/restaurant" onClick={handleRestaurantClick} className="cta-restaurant" prefetch={true}>
        <Utensils size={20} />
        <span>Restaurant</span>
      </Link>
      <a href={generatePhoneURL(phoneNumber)} className="cta-call">
        <Phone size={20} />
        <span>Call Desk</span>
      </a>
    </div>
  );
}

