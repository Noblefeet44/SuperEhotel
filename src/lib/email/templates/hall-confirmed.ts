import { renderBaseEmailLayout } from './base-layout';

export interface HallConfirmedData {
  ref: string;
  organizerName: string;
  eventType: string;
  eventDate: string;
  timeSlot: string;
  packageName: string;
  packagePrice: number;
  depositPaid?: number;
  balanceDue?: number;
}

export function renderHallConfirmedEmail(data: HallConfirmedData): { subject: string; html: string } {
  const subject = `Event Hall Booking Confirmed — Super E Luxury Banquet Hall (Ref: #${data.ref})`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid #bbf7d0; margin-bottom: 12px;">
        🎉 EVENT DATE OFFICIALLY SECURED
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">
        Event Hall Reservation Confirmed!
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        Dear ${escapeHtml(data.organizerName)}, your event date has been locked on the Super E Luxury Hotel hall schedule.
      </p>
    </div>

    <!-- Details Card -->
    <div style="border: 2px solid #ca8a04; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 14px 20px; font-size: 13px; font-weight: 700; text-transform: uppercase;">
        Confirmed Event Specification (Ref: ${escapeHtml(data.ref)})
      </div>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b; width: 40%;">Event Type</td>
          <td style="padding: 12px 20px; font-weight: 600; color: #0f172a;">${escapeHtml(data.eventType)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 20px; color: #64748b;">Confirmed Date</td>
          <td style="padding: 12px 20px; font-weight: 700; color: #166534;">${escapeHtml(data.eventDate)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Time Slot &amp; Access</td>
          <td style="padding: 12px 20px; font-weight: 600;">${escapeHtml(data.timeSlot)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 20px; color: #64748b;">Hall Package</td>
          <td style="padding: 12px 20px; font-weight: 600;">${escapeHtml(data.packageName)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Total Hall Fee</td>
          <td style="padding: 12px 20px; font-weight: 700; color: #0f172a;">
            ₦${Number(data.packagePrice).toLocaleString()}
          </td>
        </tr>
        ${data.depositPaid !== undefined ? `
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 20px; color: #64748b;">Deposit Received</td>
          <td style="padding: 12px 20px; font-weight: 600; color: #16a34a;">
            ₦${Number(data.depositPaid).toLocaleString()}
          </td>
        </tr>
        ` : ''}
        ${data.balanceDue && data.balanceDue > 0 ? `
        <tr style="background-color: #fef2f2;">
          <td style="padding: 12px 20px; color: #991b1b; font-weight: 600;">Balance Due Prior to Event</td>
          <td style="padding: 12px 20px; font-weight: 700; color: #dc2626;">
            ₦${Number(data.balanceDue).toLocaleString()}
          </td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Hall Setup Reminders -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; font-size: 13px; color: #475569; line-height: 1.7;">
      <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 15px; font-weight: 700;">Hall Setup Guidelines:</h4>
      <ul>
        <li>Decorators and sound crew may access the hall 2 hours prior to the official event start time.</li>
        <li>Backup standby power generator (500kVA) is guaranteed throughout the duration of your ceremony.</li>
        <li>On-site security detail will coordinate guest parking and hall access.</li>
      </ul>
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Your event hall reservation on ${data.eventDate} is confirmed.`,
    contentHtml,
    actionButton: {
      label: 'Download Hall Directions for Guests',
      url: 'https://supereluxuryhotel.com/hall',
    },
    footerNote: 'Please coordinate with our events officer for specific stage lighting and seating configurations.',
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
