import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendHallInquiryEmail, sendAdminNotificationEmail } from '@/lib/email';

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
    const {
      ref,
      fullName,
      phone,
      whatsapp,
      email,
      eventType,
      eventDate,
      timeSlot,
      guestCount,
      packageName,
      packagePrice,
      selectedAddons,
      specialNotes,
    } = body;

    if (!fullName || !phone || !eventDate || !eventType) {
      return NextResponse.json(
        { success: false, error: 'Full name, phone, event date, and event type are required' },
        { status: 400 }
      );
    }

    const reference = ref || `HALL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Save to Supabase hall_bookings table
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('hall_bookings').insert({
          reference_number: reference,
          organizer_name: fullName.trim(),
          phone: phone.trim(),
          whatsapp: (whatsapp || phone).trim(),
          email: email?.trim() || null,
          event_type: eventType,
          event_date: eventDate,
          time_slot: timeSlot || 'Full Day (8 AM - 10 PM)',
          expected_guests: Number(guestCount) || 100,
          package_name: packageName || 'Royal Banquet Hall',
          package_price: Number(packagePrice) || 350000,
          add_ons: selectedAddons || [],
          special_notes: specialNotes?.trim() || null,
          status: 'pending',
        });
      } catch (dbErr) {
        console.warn('[Hall DB Insert Notice]:', dbErr);
      }
    }

    // 2. Send Acknowledgment Email to Organizer via Resend
    if (email && email.includes('@')) {
      sendHallInquiryEmail({
        ref: reference,
        organizerName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        eventType,
        eventDate,
        timeSlot: timeSlot || 'Full Day',
        guestCount: guestCount || '100',
        packageName: packageName || 'Royal Banquet Hall',
        packagePrice: Number(packagePrice) || 350000,
        selectedAddons: selectedAddons || [],
        specialNotes: specialNotes?.trim(),
      }).catch((e) => console.warn('[Resend Hall Inquiry Email Error]:', e));
    }

    // 3. Send Alert to Hotel Admin
    sendAdminNotificationEmail({
      alertType: 'hall_inquiry',
      title: `New Event Hall Inquiry: ${eventType}`,
      summary: `${fullName.trim()} (${phone.trim()}) requested the banquet hall for ${eventDate}.`,
      reference,
      details: [
        { label: 'Organizer', value: fullName.trim() },
        { label: 'Event Type', value: eventType },
        { label: 'Event Date', value: eventDate },
        { label: 'Phone', value: phone.trim() },
        { label: 'Email', value: email?.trim() || 'Not provided' },
        { label: 'Package', value: packageName || 'Royal Banquet Hall' },
        { label: 'Guest Capacity', value: `${guestCount} guests` },
      ],
      actionUrl: 'https://supereluxuryhotel.com/admin/hall',
    }).catch((e) => console.warn('[Resend Admin Hall Alert Error]:', e));

    return NextResponse.json({
      success: true,
      reference,
      message: 'Hall inquiry submitted successfully. Our events coordinator will contact you.',
    });
  } catch (error: any) {
    console.error('Hall booking submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit hall booking' },
      { status: 500 }
    );
  }
}
