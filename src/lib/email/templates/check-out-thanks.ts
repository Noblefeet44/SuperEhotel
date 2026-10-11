import { renderBaseEmailLayout } from './base-layout';

export interface CheckOutThanksData {
  ref: string;
  guestName: string;
  roomName: string;
  nights: number;
}

export function renderCheckOutThanksEmail(data: CheckOutThanksData): { subject: string; html: string } {
  const subject = `Thank You for Staying with Us — Super E Luxury Hotel`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #f1f5f9; color: #334155; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid #e2e8f0; margin-bottom: 12px;">
        🌟 STAY COMPLETED &bull; THANK YOU
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">
        We Hope You Had a Wonderful Stay, ${escapeHtml(data.guestName)}!
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        On behalf of the entire management and hospitality team at Super E Luxury Hotel &amp; Suites, thank you for choosing us for your stay in Keffi.
      </p>
    </div>

    <!-- Review & Feedback Card -->
    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 24px;">
      <div style="font-size: 24px; margin-bottom: 8px;">⭐⭐⭐⭐⭐</div>
      <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px; font-weight: 700;">
        How was your experience?
      </h3>
      <p style="margin: 0 auto 16px auto; color: #64748b; font-size: 13px; max-width: 440px; line-height: 1.5;">
        Your feedback helps us continuously elevate our service standards. We would truly appreciate 60 seconds of your time to share a review.
      </p>
      <a href="https://maps.google.com/?q=Super+E+Luxury+Hotel+Keffi" target="_blank" style="display: inline-block; background-color: #ca8a04; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 22px; border-radius: 6px;">
        Leave Us a Google Review
      </a>
    </div>

    <!-- VIP Returning Guest Note -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 6px 0; color: #fde047; font-size: 14px; font-weight: 700;">
        🎁 VIP Returning Guest Privileges
      </h4>
      <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6;">
        Whenever you plan your next trip to Keffi or Nasarawa State, book directly through our official website to enjoy complimentary early check-in, late check-out priority, and dedicated concierge assistance.
      </p>
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Thank you for choosing Super E Luxury Hotel. We hope to see you again soon!`,
    contentHtml,
    actionButton: {
      label: 'Book Your Next Stay Direct',
      url: 'https://supereluxuryhotel.com/book',
    },
    footerNote: 'Lost any personal property in your room? Call our reception hotline immediately with your booking reference.',
  });

  return { subject, html };
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
