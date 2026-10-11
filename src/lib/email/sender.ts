import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { renderBookingReceivedEmail, BookingReceivedData } from './templates/booking-received';
import { renderBookingConfirmedEmail, BookingConfirmedData } from './templates/booking-confirmed';
import { renderCheckInWelcomeEmail, CheckInWelcomeData } from './templates/check-in-welcome';
import { renderCheckOutThanksEmail, CheckOutThanksData } from './templates/check-out-thanks';
import { renderBookingCancelledEmail, BookingCancelledData } from './templates/booking-cancelled';
import { renderHallInquiryEmail, HallInquiryData } from './templates/hall-inquiry';
import { renderHallConfirmedEmail, HallConfirmedData } from './templates/hall-confirmed';
import { renderDiningOrderEmail, DiningOrderData } from './templates/dining-order';
import { renderContactAcknowledgementEmail, ContactAcknowledgementData } from './templates/contact-acknowledgement';
import { renderAdminAlertEmail, AdminAlertData } from './templates/admin-alert';

const DEFAULT_SUPABASE_URL = 'https://abiavsgmbokwyxlahhyt.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWF2c2dtYm9rd3l4bGFoaHl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTAwODA4MSwiZXhwIjoyMTA2NTg0MDgxfQ.aE1ghNEm3xN_I0cOpcE7opJLiiX9mlE7P0y3zRDuuMk';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const PRIMARY_FROM = process.env.RESEND_FROM_EMAIL || 'Super E Luxury Hotel <reservations@mail.supereluxuryhotel.com>';
const ONBOARDING_FALLBACK_FROM = 'Super E Luxury Hotel <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL || 'admin@superehotel.com';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  templateType: string;
  reference?: string;
  recipientName?: string;
}

export async function sendEmailWithLogging(params: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const { to, subject, html, templateType, reference, recipientName } = params;
  const resend = getResendClient();

  if (!resend) {
    console.warn(`[Resend Email Skipped] RESEND_API_KEY is not configured.`);
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients.filter((e) => e && typeof e === 'string' && e.includes('@'));

  if (validRecipients.length === 0) {
    return { success: false, error: 'No valid recipient email address provided' };
  }

  let sendResult: any = null;
  let usedFrom = PRIMARY_FROM;

  try {
    // 1. Try sending with primary verified domain
    const response = await resend.emails.send({
      from: usedFrom,
      to: validRecipients,
      subject,
      html,
    });

    if (response.error) {
      // If domain verification issue, fallback gracefully to onboarding@resend.dev
      console.warn(`[Resend Notice] Primary sender error (${response.error.message}), trying fallback onboarding sender...`);
      usedFrom = ONBOARDING_FALLBACK_FROM;
      const retryResponse = await resend.emails.send({
        from: usedFrom,
        to: validRecipients,
        subject,
        html,
      });

      if (retryResponse.error) {
        throw new Error(retryResponse.error.message);
      }
      sendResult = retryResponse.data;
    } else {
      sendResult = response.data;
    }
  } catch (err: any) {
    console.error(`[Resend Error] Failed sending ${templateType} email:`, err);
    await logEmailToSupabase({
      recipientEmail: validRecipients.join(', '),
      recipientName,
      templateType,
      subject,
      reference,
      status: 'failed',
      errorMessage: err.message || String(err),
    });
    return { success: false, error: err.message || 'Failed to send email' };
  }

  const resendId = sendResult?.id;

  // Log successful delivery to Supabase
  await logEmailToSupabase({
    recipientEmail: validRecipients.join(', '),
    recipientName,
    templateType,
    subject,
    reference,
    resendId,
    status: 'sent',
  });

  return { success: true, id: resendId };
}

async function logEmailToSupabase(logData: {
  recipientEmail: string;
  recipientName?: string;
  templateType: string;
  subject: string;
  reference?: string;
  resendId?: string;
  status: 'sent' | 'failed';
  errorMessage?: string;
}) {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    await supabase.from('email_logs').insert({
      recipient_email: logData.recipientEmail,
      recipient_name: logData.recipientName || null,
      template_type: logData.templateType,
      subject: logData.subject,
      reference_number: logData.reference || null,
      resend_id: logData.resendId || null,
      status: logData.status,
      error_message: logData.errorMessage || null,
    });
  } catch (e) {
    // Non-blocking log warning (table might be newly created or migrating)
    console.warn('[Supabase email_logs notice]:', e);
  }
}

// ========================================================
// Specific Trigger Functions
// ========================================================

/**
 * Triggered on room booking creation on /book
 */
export async function sendBookingReceivedEmail(data: BookingReceivedData) {
  if (!data.email) return { success: false, error: 'No guest email' };
  const { subject, html } = renderBookingReceivedEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'booking_received',
    reference: data.ref,
    recipientName: data.guestName,
  });
}

/**
 * Triggered when Admin marks room booking confirmed
 */
export async function sendBookingConfirmedEmail(data: BookingConfirmedData) {
  if (!data.email) return { success: false, error: 'No guest email' };
  const { subject, html } = renderBookingConfirmedEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'booking_confirmed',
    reference: data.ref,
    recipientName: data.guestName,
  });
}

/**
 * Triggered when Admin checks in the guest
 */
export async function sendCheckInWelcomeEmail(data: CheckInWelcomeData & { email: string }) {
  if (!data.email) return { success: false, error: 'No guest email' };
  const { subject, html } = renderCheckInWelcomeEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'check_in_welcome',
    reference: data.ref,
    recipientName: data.guestName,
  });
}

/**
 * Triggered when Admin checks out the guest
 */
export async function sendCheckOutThanksEmail(data: CheckOutThanksData & { email: string }) {
  if (!data.email) return { success: false, error: 'No guest email' };
  const { subject, html } = renderCheckOutThanksEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'check_out_thanks',
    reference: data.ref,
    recipientName: data.guestName,
  });
}

/**
 * Triggered when Admin cancels booking
 */
export async function sendBookingCancelledEmail(data: BookingCancelledData & { email: string }) {
  if (!data.email) return { success: false, error: 'No guest email' };
  const { subject, html } = renderBookingCancelledEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'booking_cancelled',
    reference: data.ref,
    recipientName: data.guestName,
  });
}

/**
 * Triggered on Hall reservation inquiry (/hall)
 */
export async function sendHallInquiryEmail(data: HallInquiryData) {
  if (!data.email) return { success: false, error: 'No organizer email' };
  const { subject, html } = renderHallInquiryEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'hall_inquiry',
    reference: data.ref,
    recipientName: data.organizerName,
  });
}

/**
 * Triggered when Hall booking is officially secured
 */
export async function sendHallConfirmedEmail(data: HallConfirmedData & { email: string }) {
  if (!data.email) return { success: false, error: 'No organizer email' };
  const { subject, html } = renderHallConfirmedEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'hall_confirmed',
    reference: data.ref,
    recipientName: data.organizerName,
  });
}

/**
 * Triggered on Restaurant / Dining order (/restaurant)
 */
export async function sendDiningOrderEmail(data: DiningOrderData) {
  if (!data.email) return { success: false, error: 'No diner email' };
  const { subject, html } = renderDiningOrderEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'dining_order',
    reference: data.ref,
    recipientName: data.customerName,
  });
}

/**
 * Triggered when visitor submits contact form (/contact)
 */
export async function sendContactFormEmail(data: ContactAcknowledgementData) {
  if (!data.email) return { success: false, error: 'No visitor email' };
  const { subject, html } = renderContactAcknowledgementEmail(data);
  return sendEmailWithLogging({
    to: data.email,
    subject,
    html,
    templateType: 'contact_acknowledgement',
    recipientName: data.name,
  });
}

/**
 * Triggered to alert Hotel Front Desk / Management
 */
export async function sendAdminNotificationEmail(data: AdminAlertData) {
  const { subject, html } = renderAdminAlertEmail(data);
  return sendEmailWithLogging({
    to: ADMIN_EMAIL,
    subject,
    html,
    templateType: 'admin_alert',
    reference: data.reference,
    recipientName: 'Hotel Front Desk',
  });
}
