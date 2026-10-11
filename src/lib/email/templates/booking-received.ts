import { renderBaseEmailLayout } from './base-layout';

export interface BookingReceivedData {
  ref: string;
  guestName: string;
  email: string;
  phone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  numGuests: number;
  totalAmount: number;
  amountPaid?: number;
  balanceDue?: number;
  paymentBank?: string;
  paymentMethod?: string;
  hasReceipt?: boolean;
  specialRequests?: string;
}

export function renderBookingReceivedEmail(data: BookingReceivedData): { subject: string; html: string } {
  const subject = `Booking Received: Ref #${data.ref} — Super E Luxury Hotel`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; border: 1px solid #fde68a; margin-bottom: 12px;">
        ⏳ Payment Receipt Under Verification
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 700;">
        Thank You, ${escapeHtml(data.guestName)}!
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.5;">
        We have received your room booking request and payment transfer submission. Our front desk audit team is currently verifying your bank payment.
      </p>
    </div>

    <!-- Reference Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; padding: 16px 20px;">
      <tr>
        <td style="font-size: 13px; color: #64748b; padding-bottom: 4px;">Booking Reference Number</td>
      </tr>
      <tr>
        <td style="font-size: 20px; font-weight: 700; color: #1e3a8a; letter-spacing: 1px; font-family: monospace;">
          ${escapeHtml(data.ref)}
        </td>
      </tr>
    </table>

    <!-- Reservation Summary Card -->
    <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 12px 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Reservation Summary
      </div>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b; width: 40%;">Accommodation</td>
          <td style="padding: 12px 20px; font-weight: 600; color: #0f172a;">${escapeHtml(data.roomName)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
          <td style="padding: 12px 20px; color: #64748b;">Check-In Date</td>
          <td style="padding: 12px 20px; font-weight: 600;">${escapeHtml(data.checkIn)} (from 2:00 PM)</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Check-Out Date</td>
          <td style="padding: 12px 20px; font-weight: 600;">${escapeHtml(data.checkOut)} (by 12:00 PM)</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
          <td style="padding: 12px 20px; color: #64748b;">Duration & Guests</td>
          <td style="padding: 12px 20px;">${data.nights} Night${data.nights > 1 ? 's' : ''} &bull; ${data.numGuests} Guest${data.numGuests > 1 ? 's' : ''}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Total Amount</td>
          <td style="padding: 12px 20px; font-weight: 700; color: #1e3a8a; font-size: 16px;">
            ₦${Number(data.totalAmount).toLocaleString()}
          </td>
        </tr>
        ${data.amountPaid !== undefined ? `
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
          <td style="padding: 12px 20px; color: #64748b;">Amount Reported Paid</td>
          <td style="padding: 12px 20px; font-weight: 600; color: #16a34a;">
            ₦${Number(data.amountPaid).toLocaleString()}
          </td>
        </tr>
        ` : ''}
        ${data.balanceDue && data.balanceDue > 0 ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Balance Due at Desk</td>
          <td style="padding: 12px 20px; font-weight: 600; color: #dc2626;">
            ₦${Number(data.balanceDue).toLocaleString()}
          </td>
        </tr>
        ` : ''}
        <tr style="background-color: #f8fafc;">
          <td style="padding: 12px 20px; color: #64748b;">Proof of Payment</td>
          <td style="padding: 12px 20px;">
            ${data.hasReceipt ? '<span style="color: #16a34a; font-weight: 600;">✓ Bank Transfer Receipt Uploaded</span>' : '<span style="color: #64748b;">Pending upload</span>'}
          </td>
        </tr>
        ${data.specialRequests ? `
        <tr>
          <td style="padding: 12px 20px; color: #64748b;">Special Requests</td>
          <td style="padding: 12px 20px; font-style: italic;">${escapeHtml(data.specialRequests)}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Next Steps Alert -->
    <div style="background-color: #eff6ff; border-left: 4px solid #1e3a8a; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
      <h4 style="margin: 0 0 6px 0; color: #1e3a8a; font-size: 14px; font-weight: 700;">What happens next?</h4>
      <p style="margin: 0; color: #3b82f6; font-size: 13px; line-height: 1.6; color: #1e40af;">
        1. Our accounts desk verifies the incoming credit with Moniepoint Microfinance Bank.<br>
        2. Once verified, you will receive your <strong>Official Confirmed Booking Voucher</strong> via email.<br>
        3. You may also contact our Front Desk via WhatsApp with your reference number for express confirmation.
      </p>
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Your booking for ${data.roomName} (Ref: ${data.ref}) is currently being processed.`,
    contentHtml,
    actionButton: {
      label: 'Message Front Desk on WhatsApp',
      url: `https://wa.me/2347066472533?text=${encodeURIComponent(`Hello Super E Hotel, I have submitted booking Ref ${data.ref} for ${data.roomName}. Kindly verify my payment receipt.`)}`,
    },
    footerNote: 'Please keep this email and reference number handy when arriving at our reception desk in Keffi.',
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
