// Utility functions for Super E Luxury Hotel

/**
 * Format price in Nigerian Naira
 */
export function formatPrice(amount: number, symbol: string = '₦'): string {
  return `${symbol}${amount.toLocaleString('en-NG')}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate number of nights between two dates
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generate booking reference number
 * Format: SE-YYYYMMDD-XXXX
 */
export function generateBookingReference(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `SE-${dateStr}-${random}`;
}

/**
 * Generate WhatsApp message URL for booking
 */
export function generateWhatsAppBookingMessage(
  whatsappNumber: string,
  booking: {
    reference: string;
    guestName: string;
    phone: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    numGuests: number;
    totalAmount: number;
    specialRequests?: string;
    currencySymbol?: string;
  }
): string {
  const currency = booking.currencySymbol || '₦';
  const nights = calculateNights(booking.checkIn, booking.checkOut);
  
  const message = `🏨 *NEW BOOKING — SUPER E LUXURY HOTEL*

📋 *Ref:* ${booking.reference}
👤 *Guest:* ${booking.guestName}
📱 *Phone:* ${booking.phone}
🛏️ *Room:* ${booking.roomName}
📅 *Check-in:* ${formatDate(booking.checkIn)}
📅 *Check-out:* ${formatDate(booking.checkOut)}
🌙 *Nights:* ${nights}
👥 *Guests:* ${booking.numGuests}
💰 *Total:* ${currency}${booking.totalAmount.toLocaleString('en-NG')}
${booking.specialRequests ? `\n💬 *Requests:* ${booking.specialRequests}` : ''}

📌 *Status:* Awaiting Confirmation`;

  // Format Nigerian number for WhatsApp (add 234 country code)
  const formattedNumber = formatWhatsAppNumber(whatsappNumber);
  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate simple WhatsApp contact URL
 */
export function generateWhatsAppURL(
  whatsappNumber: string,
  message?: string
): string {
  const formattedNumber = formatWhatsAppNumber(whatsappNumber);
  if (message) {
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${formattedNumber}`;
}

/**
 * Format Nigerian phone number for WhatsApp (international format)
 */
export function formatWhatsAppNumber(phone: string): string {
  // Remove spaces, dashes, and brackets
  let cleaned = phone.replace(/[\s\-()]/g, '');
  
  // If starts with 0, replace with 234 (Nigeria)
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.substring(1);
  }
  // If starts with +, remove the +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Generate tel: link for phone calls
 */
export function generatePhoneURL(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('0')) {
    return `tel:+234${cleaned.substring(1)}`;
  }
  return `tel:${cleaned}`;
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get tomorrow's date as YYYY-MM-DD string
 */
export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if a date is in the past
 */
export function isDatePast(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * cn utility for conditional classnames
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
