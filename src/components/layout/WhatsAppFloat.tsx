import { MessageCircle } from 'lucide-react';
import { generateWhatsAppURL } from '@/lib/utils';

export function WhatsAppFloat() {
  const whatsappNumber = '09131964939';

  return (
    <a
      href={generateWhatsAppURL(whatsappNumber, 'Hello! I would like to learn more about Super E Luxury Hotel.')}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
