import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDiningOrderEmail, sendAdminNotificationEmail } from '@/lib/email';

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
      email,
      orderType,
      locationDetails,
      servingTime,
      items,
      totalAmount,
      specialNotes,
    } = body;

    if (!fullName || !phone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Full name, phone, and at least one item are required' },
        { status: 400 }
      );
    }

    const reference = ref || `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Save to Supabase restaurant_orders table
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('restaurant_orders').insert({
          reference_number: reference,
          customer_name: fullName.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          order_type: orderType || 'room-service',
          location_details: locationDetails?.trim() || null,
          serving_time: servingTime || 'ASAP',
          items: items,
          total_amount: Number(totalAmount) || 0,
          special_notes: specialNotes?.trim() || null,
          status: 'received',
        });
      } catch (dbErr) {
        console.warn('[Restaurant DB Insert Notice]:', dbErr);
      }
    }

    // 2. Send Order Confirmation Email to Diner via Resend
    if (email && email.includes('@')) {
      sendDiningOrderEmail({
        ref: reference,
        customerName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        orderType: orderType || 'room-service',
        locationDetails: locationDetails?.trim(),
        servingTime: servingTime || 'ASAP',
        items: items,
        totalAmount: Number(totalAmount) || 0,
        specialNotes: specialNotes?.trim(),
      }).catch((e) => console.warn('[Resend Diner Order Email Error]:', e));
    }

    // 3. Send Alert to Kitchen / Hotel Admin
    sendAdminNotificationEmail({
      alertType: 'dining_order',
      title: `New Food & Beverage Order (₦${Number(totalAmount).toLocaleString()})`,
      summary: `${fullName.trim()} (${orderType}) placed a dining order for ${locationDetails || 'Restaurant'}.`,
      reference,
      details: [
        { label: 'Customer', value: fullName.trim() },
        { label: 'Phone', value: phone.trim() },
        { label: 'Order Type', value: orderType },
        { label: 'Delivery / Table', value: locationDetails || 'Not specified' },
        { label: 'Serving Time', value: servingTime || 'ASAP' },
        { label: 'Total', value: `₦${Number(totalAmount).toLocaleString()}` },
        { label: 'Items Count', value: `${items.length} unique dish(es)` },
      ],
      actionUrl: 'https://supereluxuryhotel.com/admin/restaurant',
    }).catch((e) => console.warn('[Resend Admin Kitchen Alert Error]:', e));

    return NextResponse.json({
      success: true,
      reference,
      message: 'Dining order submitted successfully.',
    });
  } catch (error: any) {
    console.error('Restaurant order submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit dining order' },
      { status: 500 }
    );
  }
}
