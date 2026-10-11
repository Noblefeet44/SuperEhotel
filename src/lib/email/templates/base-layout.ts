import { HOTEL_INFO } from '@/lib/hotel-data';

export interface BaseLayoutOptions {
  title: string;
  preheader?: string;
  contentHtml: string;
  actionButton?: {
    label: string;
    url: string;
  };
  footerNote?: string;
}

export function renderBaseEmailLayout(options: BaseLayoutOptions): string {
  const { title, preheader, contentHtml, actionButton, footerNote } = options;
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #0b1120;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #334155;
    }
    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      vertical-align: top;
    }
    a {
      color: #1e3a8a;
      text-decoration: underline;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .responsive-padding {
        padding: 24px 18px !important;
      }
      .two-col {
        display: block !important;
        width: 100% !important;
      }
      .mobile-block {
        display: block !important;
        width: 100% !important;
        margin-bottom: 8px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-width: 0px; opacity: 0;">${escapeHtml(preheader)} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>` : ''}

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b1120; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Royal Gold Accent Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #b45309 0%, #ca8a04 50%, #eab308 100%); height: 5px; font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 32px 32px 28px 32px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 6px; background-color: rgba(255, 255, 255, 0.08); border-radius: 12px; border: 1px solid rgba(202, 138, 4, 0.4); margin-bottom: 12px;">
                      <img src="https://supereluxuryhotel.com/images/super-e-logo.png" alt="Super E Luxury Hotel" width="48" height="48" style="display: block; border-radius: 8px; border: 0;" onerror="this.style.display='none'" />
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                      ${HOTEL_INFO.name}
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #fde047; font-size: 12px; font-style: italic; letter-spacing: 0.5px;">
                      ${HOTEL_INFO.tagline} &bull; Keffi, Nasarawa State
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td class="responsive-padding" style="padding: 36px 32px; background-color: #ffffff;">
              ${contentHtml}

              ${actionButton ? `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${actionButton.url}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 14px 28px; border-radius: 8px; border: 1px solid #ca8a04; letter-spacing: 0.5px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                      ${escapeHtml(actionButton.label)}
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}

              ${footerNote ? `
              <p style="margin: 28px 0 0 0; padding-top: 20px; border-top: 1px dashed #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6; text-align: center;">
                ${footerNote}
              </p>
              ` : ''}
            </td>
          </tr>

          <!-- Concierge & Quick Contact Bar -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: center; font-size: 13px; color: #475569; line-height: 1.7;">
                    <strong style="color: #0f172a;">Need Immediate Concierge Assistance?</strong><br>
                    <span>📞 Phone: <a href="tel:${HOTEL_INFO.hotlines[0]}" style="color: #1e3a8a; text-decoration: none; font-weight: 600;">${HOTEL_INFO.hotlines[0]}</a></span>
                    &nbsp;&bull;&nbsp;
                    <span>💬 WhatsApp: <a href="https://wa.me/234${HOTEL_INFO.whatsappNumber.replace(/^0/, '')}" style="color: #16a34a; text-decoration: none; font-weight: 600;">${HOTEL_INFO.whatsappNumber}</a></span>
                    <br>
                    <span>📍 Location: Keffi, Nasarawa State, Nigeria</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Copyright -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0;">
                &copy; ${currentYear} <strong>${HOTEL_INFO.name}</strong>. All rights reserved.
              </p>
              <p style="margin: 0; color: #64748b;">
                You received this transactional email because of an active reservation, order, or inquiry on our official portal.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
