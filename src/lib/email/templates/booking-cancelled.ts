import { renderBaseEmailLayout } from './base-layout';

export interface BookingCancelledData {
  ref: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  reason?: string;
}

export function renderBookingCancelledEmail(data: BookingCancelledData): { subject: string; html: string } {
  const subject = `Booking Cancellation Notice — Ref: #${data.ref}`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid #fecaca; margin-bottom: 12px;">
        ✕ RESERVATION CANCELLED
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 700;">
        Reservation Cancelled, ${escapeHtml(data.guestName)}
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        This email confirms that your room reservation with reference <strong>#${escapeHtml(data.ref)}</strong> has been cancelled.
      </p>
    </div>

    <!-- Cancellation Details Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 16px 20px; font-size: 14px; color: #64748b; width: 40%; border-bottom: 1px solid #f1f5f9;">Booking Reference</td>
        <td style="padding: 16px 20px; font-size: 15px; font-weight: 700; color: #0f172a; font-family: monospace; border-bottom: 1px solid #f1f5f9;">
          ${escapeHtml(data.ref)}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 20px; font-size: 14px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Room Type</td>
        <td style="padding: 14px 20px; font-size: 14px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
          ${escapeHtml(data.roomName)}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 20px; font-size: 14px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Scheduled Dates</td>
        <td style="padding: 14px 20px; font-size: 14px; border-bottom: 1px solid #f1f5f9;">
          ${escapeHtml(data.checkIn)} to ${escapeHtml(data.checkOut)}
        </td>
      </tr>
      ${data.reason ? `
      <tr>
        <td style="padding: 14px 20px; font-size: 14px; color: #64748b;">Cancellation Reason</td>
        <td style="padding: 14px 20px; font-size: 14px; color: #b91c1c; font-style: italic;">
          ${escapeHtml(data.reason)}
        </td>
      </tr>
      ` : ''}
    </table>

    <!-- Refund & Support Policy -->
    <div style="background-color: #f1f5f9; border-left: 4px solid #64748b; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px; font-size: 13px; color: #334155; line-height: 1.6;">
      <h4 style="margin: 0 0 6px 0; color: #0f172a; font-size: 14px; font-weight: 700;">Refund &amp; Credit Voucher Terms:</h4>
      If you made a payment or bank transfer towards this reservation, our accounts department will process eligible refunds or credit notes in line with hotel cancellation policy within 3–5 business days. Please contact our front desk if you require immediate assistance.
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Your room reservation #${data.ref} has been cancelled.`,
    contentHtml,
    actionButton: {
      label: 'Contact Reception Desk on WhatsApp',
      url: `https://wa.me/2347066472533?text=${encodeURIComponent(`Hello Super E Hotel, I am inquiring regarding the cancellation of booking Ref ${data.ref}.`)}`,
    },
    footerNote: 'If you did not request this cancellation or believe this was done in error, please contact our management team immediately.',
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
