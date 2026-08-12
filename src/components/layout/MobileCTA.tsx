import Link from 'next/link';
import { Calendar, Utensils, Phone } from 'lucide-react';
import { generatePhoneURL } from '@/lib/utils';

export function MobileCTA() {
  const phoneNumber = '09131964939';

  return (
    <div className="mobile-cta-bar">
      <Link href="/book" className="cta-book" prefetch={true}>
        <Calendar size={20} />
        <span>Book Room</span>
      </Link>
      <Link href="/restaurant#order-meal" className="cta-restaurant" prefetch={true}>
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

