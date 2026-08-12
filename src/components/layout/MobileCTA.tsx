'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Utensils, Dumbbell, Phone } from 'lucide-react';
import { generatePhoneURL } from '@/lib/utils';

export function MobileCTA() {
  const phoneNumber = '09131964939';
  const pathname = usePathname();

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mobile-cta-bar">
      <Link href="/book" onClick={(e) => handleNavClick('/book', e)} className="cta-book" prefetch={true}>
        <Calendar size={18} />
        <span>Book Room</span>
      </Link>
      <Link href="/restaurant" onClick={(e) => handleNavClick('/restaurant', e)} className="cta-restaurant" prefetch={true}>
        <Utensils size={18} />
        <span>Restaurant</span>
      </Link>
      <Link href="/gym" onClick={(e) => handleNavClick('/gym', e)} className="cta-fitness" prefetch={true}>
        <Dumbbell size={18} />
        <span>Fitness</span>
      </Link>
      <a href={generatePhoneURL(phoneNumber)} className="cta-call">
        <Phone size={18} />
        <span>Call Desk</span>
      </a>
    </div>
  );
}

