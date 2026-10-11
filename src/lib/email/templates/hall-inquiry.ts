import { renderBaseEmailLayout } from './base-layout';

export interface HallInquiryData {
  ref: string;
  organizerName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  timeSlot: string;
  guestCount: string | number;
  packageName: string;
  packagePrice: number;
  selectedAddons?: string[];
  specialNotes?: string;
}

export function renderHallInquiryEmail(data: HallInquiryData): { subject: string; html: string } {
  const subject = `Event Hall Reservation Inquiry Received — Ref: #${data.ref}`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid #fde68a; margin-bottom: 12px;">
        🏛️ EVENT HALL INQUIRY RECEIVED
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">
        Thank You, ${escapeHtml(data.organizerName)}!
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        We have received your event reservation inquiry for the <strong>Super E Grand Royal Event &amp; Banquet Hall</strong> in Keffi.
      </p>
    </div>

    <!-- Reference & Event Spec Card -->
    <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 12px 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
        Event Reservation Details (Ref: ${escapeHtml(data.ref)})
      </div>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b; width: 40%;">Event Type</td>
          <td style="padding: 12px 20px; font-weight: 600; color: #0f172a;">${escapeHtml(data.eventType)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 20px; color: #64748b;">Scheduled Date</td>
          <td style="padding: 12px 20px; font-weight: 600; color: #1e3a8a;">${escapeHtml(data.eventDate)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Time Slot</td>
          <td style="padding: 12px 20px; font-weight: 600;">${escapeHtml(data.timeSlot)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 20px; color: #64748b;">Expected Guests</td>
          <td style="padding: 12px 20px;">${escapeHtml(String(data.guestCount))} Attendees</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 20px; color: #64748b;">Selected Package</td>
          <td style="padding: 12px 20px; font-weight: 700; color: #0f172a;">
            ${escapeHtml(data.packageName)} &bull; ₦${Number(data.packagePrice).toLocaleString()}
          </td>
        </tr>
        ${data.selectedAddons && data.selectedAddons.length > 0 ? `
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fafaf9;">
          <td style="padding: 12px 20px; color: #64748b;">Requested Add-ons</td>
          <td style="padding: 12px 20px;">
            ${data.selectedAddons.map(a => `<span style="display: inline-block; background-color: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin: 2px;">${escapeHtml(a)}</span>`).join(' ')}
          </td>
        </tr>
        ` : ''}
        ${data.specialNotes ? `
        <tr>
          <td style="padding: 12px 20px; color: #64748b;">Special Notes</td>
          <td style="padding: 12px 20px; font-style: italic;">${escapeHtml(data.specialNotes)}</td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- What Happens Next -->
    <div style="background-color: #eff6ff; border-left: 4px solid #1e3a8a; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px; font-size: 13px; color: #1e40af; line-height: 1.6;">
      <h4 style="margin: 0 0 6px 0; color: #1e3a8a; font-size: 14px; font-weight: 700;">What happens next?</h4>
      Our dedicated Events &amp; Banquet Director is reviewing the hall calendar for your requested date. A formal contract proposal and date reservation invoice will be sent to your email and WhatsApp shortly.
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `We have received your event inquiry (Ref: ${data.ref}) for Super E Banquet Hall.`,
    contentHtml,
    actionButton: {
      label: 'Chat with Events Director on WhatsApp',
      url: `https://wa.me/2347066472533?text=${encodeURIComponent(`Hello Super E Events Director, I submitted hall booking inquiry Ref ${data.ref} for ${data.eventDate}. Kindly provide date confirmation.`)}`,
    },
    footerNote: 'Hall bookings require a deposit to guarantee reservation on the requested date.',
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
