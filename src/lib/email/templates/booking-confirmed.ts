import { renderBaseEmailLayout } from './base-layout';

export interface BookingConfirmedData {
  ref: string;
  guestName: string;
  email: string;
  phone: string;
  roomName: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  numGuests: number;
  totalAmount: number;
  amountPaid?: number;
  balanceDue?: number;
  paymentMethod?: string;
  specialRequests?: string;
  adminNotes?: string;
}

export function renderBookingConfirmedEmail(data: BookingConfirmedData): { subject: string; html: string } {
  const subject = `Booking Confirmed: Your Stay at Super E Luxury Hotel (Ref: #${data.ref})`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid #bbf7d0; margin-bottom: 12px; letter-spacing: 0.5px;">
        ✓ RESERVATION OFFICIALLY CONFIRMED
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">
        We Look Forward to Welcoming You, ${escapeHtml(data.guestName)}!
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        Your payment has been verified and your room reservation is fully secured at Super E Luxury Hotel &amp; Suites, Keffi.
      </p>
    </div>

    <!-- Official Voucher Card -->
    <div style="border: 2px solid #ca8a04; border-radius: 14px; overflow: hidden; margin-bottom: 26px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="color: #fde047; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
              OFFICIAL GUEST VOUCHER
            </td>
            <td align="right" style="color: #ffffff; font-family: monospace; font-size: 16px; font-weight: 700;">
              REF: ${escapeHtml(data.ref)}
            </td>
          </tr>
        </table>
      </div>

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 14px 20px; color: #64748b; width: 40%;">Reserved Room</td>
          <td style="padding: 14px 20px; font-weight: 700; color: #0f172a; font-size: 15px;">
            ${escapeHtml(data.roomName)}
            ${data.roomNumber ? ` <span style="color: #ca8a04; font-size: 13px;">(Assigned Room: ${escapeHtml(data.roomNumber)})</span>` : ''}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Check-In Date</td>
          <td style="padding: 12px 20px; font-weight: 600; color: #166534;">
            ${escapeHtml(data.checkIn)} <span style="font-weight: normal; color: #64748b; font-size: 12px;">(Check-in from 2:00 PM)</span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 20px; color: #64748b;">Check-Out Date</td>
          <td style="padding: 12px 20px; font-weight: 600;">
            ${escapeHtml(data.checkOut)} <span style="font-weight: normal; color: #64748b; font-size: 12px;">(Check-out by 12:00 PM)</span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Stay Duration & Guests</td>
          <td style="padding: 12px 20px;">${data.nights} Night${data.nights > 1 ? 's' : ''} &bull; ${data.numGuests} Guest${data.numGuests > 1 ? 's' : ''}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 20px; color: #64748b;">Total Package Rate</td>
          <td style="padding: 12px 20px; font-weight: 700; color: #0f172a; font-size: 15px;">
            ₦${Number(data.totalAmount).toLocaleString()}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Payment Status</td>
          <td style="padding: 12px 20px; font-weight: 700; color: #16a34a;">
            ✓ VERIFIED &amp; CONFIRMED
          </td>
        </tr>
        ${data.balanceDue && data.balanceDue > 0 ? `
        <tr style="background-color: #fef2f2;">
          <td style="padding: 12px 20px; color: #991b1b; font-weight: 600;">Remaining Balance Due</td>
          <td style="padding: 12px 20px; font-weight: 700; color: #dc2626;">
            ₦${Number(data.balanceDue).toLocaleString()} (Payable on Arrival)
          </td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Essential Check-In Guide -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px; font-weight: 700;">
        🛎️ Check-In Instructions & Amenities
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.8;">
        <li><strong>Valid Identification:</strong> Please present a government-issued photo ID (National ID, Driver&apos;s License, or Voters Card) at the reception.</li>
        <li><strong>Arrival Presentation:</strong> Show this confirmation email or quote Ref <strong>${escapeHtml(data.ref)}</strong> upon arrival.</li>
        <li><strong>Complimentary Inclusions:</strong> High-speed Wi-Fi, 24/7 uninterrupted power, swimming pool access, and secure on-site parking.</li>
        <li><strong>Fine Dining &amp; Bar:</strong> Room service and our executive restaurant are open daily from 7:00 AM to 10:00 PM.</li>
      </ul>
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Your room reservation #${data.ref} is officially confirmed at Super E Luxury Hotel.`,
    contentHtml,
    actionButton: {
      label: 'View Hotel Location & Directions',
      url: 'https://maps.google.com/?q=Super+E+Luxury+Hotel+Keffi+Nasarawa',
    },
    footerNote: 'Should your travel schedule change, please notify our reception team at least 24 hours in advance.',
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
