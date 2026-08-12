import Link from 'next/link';
import { Calendar, MessageCircle, Phone } from 'lucide-react';
import { generateWhatsAppURL, generatePhoneURL } from '@/lib/utils';

export function MobileCTA() {
  const whatsappNumber = '09131964939';
  const phoneNumber = '09131964939';

  return (
    <div className="mobile-cta-bar">
      <Link href="/book" className="cta-book">
        <Calendar size={20} />
        <span>Book Now</span>
      </Link>
      <a
        href={generateWhatsAppURL(whatsappNumber, 'Hello! I would like to book a room at Super E Luxury Hotel.')}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-whatsapp"
      >
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </a>
      <a href={generatePhoneURL(phoneNumber)} className="cta-call">
        <Phone size={20} />
        <span>Call</span>
      </a>
    </div>
  );
}
