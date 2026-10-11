import { renderBaseEmailLayout } from './base-layout';

export interface ContactAcknowledgementData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function renderContactAcknowledgementEmail(data: ContactAcknowledgementData): { subject: string; html: string } {
  const subject = `We Received Your Message — Super E Luxury Hotel & Suites`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid #bfdbfe; margin-bottom: 12px;">
        ✉️ MESSAGE RECEIVED
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 700;">
        Hello ${escapeHtml(data.name)},
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        Thank you for contacting Super E Luxury Hotel &amp; Suites, Keffi. Our guest services team has received your inquiry and is reviewing it.
      </p>
    </div>

    <!-- Message Copy Box -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
        Summary of Your Message:
      </div>
      <div style="font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap; font-style: italic;">
        "${escapeHtml(data.message)}"
      </div>
    </div>

    <!-- Response Commitment -->
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px; font-size: 13px; color: #166534; line-height: 1.6;">
      <strong>Fast Response Commitment:</strong> We aim to reply to all web inquiries within 1 to 2 business hours. If your request is urgent, please connect directly with our front desk through WhatsApp or direct phone call.
    </div>
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Thank you for reaching out to Super E Luxury Hotel. We will get back to you shortly.`,
    contentHtml,
    actionButton: {
      label: 'Chat with Reception on WhatsApp',
      url: `https://wa.me/2347066472533?text=${encodeURIComponent(`Hello Super E Hotel, I recently sent an inquiry regarding: ${data.message.slice(0, 80)}`)}`,
    },
    footerNote: 'Front desk reception is manned 24 hours daily at our Keffi, Nasarawa State location.',
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
