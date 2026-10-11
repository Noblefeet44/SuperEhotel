import { renderBaseEmailLayout } from './base-layout';

export interface DiningOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface DiningOrderData {
  ref: string;
  customerName: string;
  phone: string;
  email: string;
  orderType: 'room-service' | 'table-reservation' | string;
  locationDetails?: string;
  servingTime?: string;
  items: DiningOrderItem[];
  totalAmount: number;
  specialNotes?: string;
}

export function renderDiningOrderEmail(data: DiningOrderData): { subject: string; html: string } {
  const subject = `Order Confirmation: Super E Fine Dining (Order #${data.ref})`;

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 6px 18px; border-radius: 9999px; font-size: 13px; font-weight: 700; border: 1px solid #fde68a; margin-bottom: 12px;">
        🥘 KITCHEN ORDER RECEIVED
      </div>
      <h2 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 700;">
        Order Received, ${escapeHtml(data.customerName)}!
      </h2>
      <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
        Our executive kitchen chefs have received your dining order. We are preparing your freshly cooked dishes with the finest local ingredients.
      </p>
    </div>

    <!-- Order Metadata -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px; font-size: 13px; color: #334155;">
      <tr>
        <td style="padding: 12px 18px; width: 40%; color: #64748b; border-bottom: 1px solid #f1f5f9;">Order Reference</td>
        <td style="padding: 12px 18px; font-weight: 700; font-family: monospace; color: #1e3a8a; border-bottom: 1px solid #f1f5f9;">
          ${escapeHtml(data.ref)}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 18px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Service Type</td>
        <td style="padding: 12px 18px; font-weight: 600; text-transform: capitalize; border-bottom: 1px solid #f1f5f9;">
          ${escapeHtml(data.orderType.replace(/-/g, ' '))}
        </td>
      </tr>
      ${data.locationDetails ? `
      <tr>
        <td style="padding: 12px 18px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Delivery / Table Location</td>
        <td style="padding: 12px 18px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
          ${escapeHtml(data.locationDetails)}
        </td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 12px 18px; color: #64748b;">Preferred Serving Time</td>
        <td style="padding: 12px 18px; font-weight: 600; color: #166534;">
          ${escapeHtml(data.servingTime || 'ASAP')}
        </td>
      </tr>
    </table>

    <!-- Itemized Meal Cart Table -->
    <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 12px 18px; font-size: 13px; font-weight: 700; text-transform: uppercase;">
        Ordered Dishes &amp; Beverages
      </div>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #334155;">
        ${data.items.map((item, idx) => `
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: ${idx % 2 === 0 ? '#ffffff' : '#fafaf9'};">
          <td style="padding: 12px 18px;">
            <strong>${escapeHtml(item.name)}</strong>
            <span style="color: #64748b; font-size: 12px;"> &times; ${item.quantity}</span>
          </td>
          <td align="right" style="padding: 12px 18px; font-weight: 600; color: #0f172a;">
            ₦${Number(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
        `).join('')}
        <tr style="background-color: #eff6ff;">
          <td style="padding: 14px 18px; font-size: 14px; font-weight: 700; color: #1e3a8a;">
            Estimated Total
          </td>
          <td align="right" style="padding: 14px 18px; font-size: 16px; font-weight: 700; color: #1e3a8a;">
            ₦${Number(data.totalAmount).toLocaleString()}
          </td>
        </tr>
      </table>
    </div>

    ${data.specialNotes ? `
    <div style="background-color: #f8fafc; border-left: 3px solid #ca8a04; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px; font-size: 13px; color: #475569;">
      <strong>Chef Note:</strong> <em>"${escapeHtml(data.specialNotes)}"</em>
    </div>
    ` : ''}
  `;

  const html = renderBaseEmailLayout({
    title: subject,
    preheader: `Your dining order #${data.ref} is being processed by the kitchen.`,
    contentHtml,
    actionButton: {
      label: 'Kitchen Hotline on WhatsApp',
      url: `https://wa.me/2349131964939?text=${encodeURIComponent(`Hello Super E Kitchen, I am checking on order Ref ${data.ref}.`)}`,
    },
    footerNote: 'Payments can be charged to your room bill or paid via POS debit card on food arrival.',
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
