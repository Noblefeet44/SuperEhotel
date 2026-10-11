import { renderBaseEmailLayout } from './base-layout';

export interface CheckInWelcomeData {
  ref: string;
  guestName: string;
  roomName: string;
  roomNumber?: string;
  checkOut: string;
}

export function renderCheckInWelcomeEmail(data: CheckInWelcomeData): { subject: string; html: string } {
  const subject = `Welcome to Super E Luxury Hotel — Your In-Stay Guide & Room Service`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid #fde68a; margin-bottom: 12px;">
        🏨 WELCOME TO SUPER E LUXURY HOTEL
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">
        Welcome Home, ${escapeHtml(data.guestName)}!
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        It is our utmost pleasure to host you. We trust your stay with us will be serene, relaxing, and unforgettable.
      </p>
    </div>

    <!-- Room Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; border-radius: 12px; margin-bottom: 24px; padding: 20px 24px;">
      <tr>
        <td>
          <div style="font-size: 12px; color: #fde047; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
            YOUR STAY DETAILS
          </div>
          <div style="font-size: 20px; font-weight: 700; margin: 6px 0 2px 0;">
            ${escapeHtml(data.roomName)}
            ${data.roomNumber ? ` &bull; Room ${escapeHtml(data.roomNumber)}` : ''}
          </div>
          <div style="font-size: 13px; color: #cbd5e1;">
            Scheduled Check-Out: <strong>${escapeHtml(data.checkOut)} at 12:00 PM</strong> &bull; Ref: ${escapeHtml(data.ref)}
          </div>
        </td>
      </tr>
    </table>

    <!-- In-Stay Perks & Amenities Grid -->
    <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <div style="background-color: #f8fafc; padding: 12px 20px; font-weight: 700; font-size: 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
        ⚡ Essential In-House Services
      </div>
      
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #334155;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 14px 20px; width: 35%; color: #64748b; font-weight: 600;">📶 High-Speed Wi-Fi</td>
          <td style="padding: 14px 20px;">
            Select <strong>SuperE_Guest_WiFi</strong> on your device. Ask reception for the current daily access code.
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 14px 20px; color: #64748b; font-weight: 600;">🍽️ Room Service & Dining</td>
          <td style="padding: 14px 20px;">
            Breakfast, Lunch &amp; Dinner prepared fresh from <strong>7:00 AM – 10:00 PM</strong>. Dial extension 0 or message our WhatsApp kitchen line.
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 14px 20px; color: #64748b; font-weight: 600;">🏊 Pool &amp; Fitness Gym</td>
          <td style="padding: 14px 20px;">
            Complimentary access for registered hotel guests. Open daily from 6:30 AM to 9:00 PM.
          </td>
        </tr>
        <tr style="background-color: #fafaf9;">
          <td style="padding: 14px 20px; color: #64748b; font-weight: 600;">👔 Laundry &amp; Pressing</td>
          <td style="padding: 14px 20px;">
            Same-day laundry and express pressing service available upon request with housekeeping.
          </td>
        </tr>
      </table>
    </div>

    <!-- House Rules Reminder -->
    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px; font-size: 12px; color: #991b1b; line-height: 1.6;">
      <strong>Guest Safety &amp; Comfort:</strong> All rooms are strictly non-smoking. Please keep room volume considerate after 10:00 PM. Visitors must be registered at the reception desk.
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Welcome to Super E Luxury Hotel. Here is your in-stay guide and room service details.`,
    contentHtml,
    actionButton: {
      label: 'Explore Restaurant & Room Service Menu',
      url: 'https://supereluxuryhotel.com/restaurant',
    },
    footerNote: 'Need towels, extra pillows, or immediate room service? Message our 24/7 concierge anytime.',
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
