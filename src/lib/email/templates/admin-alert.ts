import { renderBaseEmailLayout } from './base-layout';

export interface AdminAlertData {
  alertType: 'new_booking' | 'receipt_uploaded' | 'hall_inquiry' | 'dining_order' | 'contact_message';
  title: string;
  summary: string;
  reference?: string;
  details: { label: string; value: string }[];
  actionUrl?: string;
}

export function renderAdminAlertEmail(data: AdminAlertData): { subject: string; html: string } {
  const subject = `[HOTEL ALERT] ${data.title}${data.reference ? ` — Ref: #${data.reference}` : ''}`;

  const contentHtml = `
    <div style="margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #fef2f2; color: #991b1b; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; border: 1px solid #fecaca; margin-bottom: 12px;">
        🚨 FRONT DESK MANAGEMENT ALERT
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 700;">
        ${escapeHtml(data.title)}
      </h2>
      <p style="margin: 8px 0 0 0; color: #475569; font-size: 14px; line-height: 1.5;">
        ${escapeHtml(data.summary)}
      </p>
    </div>

    <!-- Details Table -->
    <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 24px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #334155;">
        ${data.details.map((d, i) => `
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 12px 18px; width: 38%; color: #64748b; font-weight: 600;">${escapeHtml(d.label)}</td>
          <td style="padding: 12px 18px; font-weight: 600; color: #0f172a;">${escapeHtml(d.value)}</td>
        </tr>
        `).join('')}
      </table>
    </div>

    <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 14px 18px; font-size: 12px; color: #64748b; line-height: 1.5;">
      <strong>Action Required:</strong> Log in to the Super E Hotel Admin Portal to review receipts, assign room keys, or contact the guest.
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Front Desk Alert: ${data.title}`,
    contentHtml,
    actionButton: {
      label: 'Open Admin Management Portal',
      url: data.actionUrl || 'https://supereluxuryhotel.com/admin/bookings',
    },
    footerNote: 'Internal Hotel System Notification &bull; Confidential',
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
