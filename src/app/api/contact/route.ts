import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendContactFormEmail, sendAdminNotificationEmail } from '@/lib/email';

const DEFAULT_SUPABASE_URL = 'https://abiavsgmbokwyxlahhyt.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWF2c2dtYm9rd3l4bGFoaHl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTAwODA4MSwiZXhwIjoyMTA2NTg0MDgxfQ.aE1ghNEm3xN_I0cOpcE7opJLiiX9mlE7P0y3zRDuuMk';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and message are required' },
        { status: 400 }
      );
    }

    // 1. Save to Supabase contact_messages table
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contact_messages').insert({
          name: name.trim(),
          email: email?.trim() || null,
          phone: phone.trim(),
          message: message.trim(),
          status: 'new',
        });
      } catch (dbErr) {
        console.warn('[Contact DB Insert Notice]:', dbErr);
      }
    }

    // 2. Send Auto-Acknowledgement to Visitor via Resend
    if (email && email.includes('@')) {
      sendContactFormEmail({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      }).catch((e) => console.warn('[Resend Visitor Contact Email Error]:', e));
    }

    // 3. Send Alert to Hotel Admin
    sendAdminNotificationEmail({
      alertType: 'contact_message',
      title: `New Inquiry from ${name.trim()}`,
      summary: `A visitor sent an inquiry through the website contact form.`,
      details: [
        { label: 'Sender Name', value: name.trim() },
        { label: 'Phone', value: phone.trim() },
        { label: 'Email', value: email?.trim() || 'Not provided' },
        { label: 'Message Preview', value: message.trim().slice(0, 160) },
      ],
      actionUrl: 'https://supereluxuryhotel.com/admin',
    }).catch((e) => console.warn('[Resend Admin Contact Alert Error]:', e));

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. Our team will get back to you shortly.',
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit contact message' },
      { status: 500 }
    );
  }
}
