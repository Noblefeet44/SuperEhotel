import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '@/lib/auth';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

// GET /api/admin/settings — fetch hotel settings (public for footer/navbar)
export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from('hotel_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Settings not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings — update hotel settings (admin only)
export async function PUT(request: NextRequest) {
  // Verify admin authentication
  const auth = await verifyAdminRequest(request);
  if (!auth) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();

    // Map frontend keys to database columns
    const updateData: Record<string, any> = {};
    if (body.hotelName !== undefined) updateData.hotel_name = body.hotelName;
    if (body.tagline !== undefined) updateData.tagline = body.tagline;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.whatsapp !== undefined) updateData.whatsapp = body.whatsapp;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.googleMapsEmbed !== undefined) updateData.map_embed_url = body.googleMapsEmbed;
    if (body.currencySymbol !== undefined) updateData.currency_symbol = body.currencySymbol;
    if (body.socialFacebook !== undefined) updateData.facebook_url = body.socialFacebook;
    if (body.socialInstagram !== undefined) updateData.instagram_url = body.socialInstagram;
    if (body.socialTwitter !== undefined) updateData.twitter_url = body.socialTwitter;
    if (body.metaDescription !== undefined) updateData.description = body.metaDescription;

    // Get the first (and only) settings row
    const { data: existing } = await supabase
      .from('hotel_settings')
      .select('id')
      .limit(1)
      .single();

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Settings record not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('hotel_settings')
      .update(updateData)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully', settings: data });
  } catch (err) {
    console.error('Error saving settings:', err);
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}
