import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_ROOMS_DATA, RoomCategoryData } from '@/lib/hotel-data';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

// GET /api/rooms: Fetch live rooms from Supabase, fallback to INITIAL_ROOMS_DATA
export async function GET() {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*, room_categories(name, slug)')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const mappedRooms: RoomCategoryData[] = data.map((r: any) => {
          const photos = Array.isArray(r.photos) && r.photos.length > 0
            ? r.photos
            : ['/images/standard-room.jpg'];

          return {
            id: r.id,
            slug: r.slug,
            name: r.name,
            category: r.room_categories?.name || 'Standard',
            price: Number(r.price_per_night) || 40000,
            maxGuests: r.max_guests || 2,
            bedType: r.bed_type || 'King Bed',
            roomSize: r.room_size || '30 sqm',
            image: photos[0],
            images: photos,
            description: r.description || '',
            facilities: Array.isArray(r.facilities) ? r.facilities : [],
            isFeatured: Boolean(r.is_featured),
            units: [],
          };
        });

        return NextResponse.json({ success: true, rooms: mappedRooms });
      }
    } catch (err) {
      console.warn('Supabase rooms query warning:', err);
    }
  }

  return NextResponse.json({ success: true, rooms: INITIAL_ROOMS_DATA });
}

// POST /api/rooms: Update or insert room tier in Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, slug, name, price, maxGuests, bedType, roomSize, images, image, description, facilities, isFeatured } = body;

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ success: true, message: 'Saved locally' });
    }

    const photos = images && images.length > 0 ? images : (image ? [image] : ['/images/standard-room.jpg']);

    const updateData: any = {
      name,
      price_per_night: Number(price) || 40000,
      max_guests: Number(maxGuests) || 2,
      bed_type: bedType || 'King Bed',
      room_size: roomSize || '30 sqm',
      description: description || '',
      facilities: Array.isArray(facilities) ? facilities : [],
      photos,
      updated_at: new Date().toISOString(),
    };

    if (isFeatured !== undefined) {
      updateData.is_featured = Boolean(isFeatured);
    }

    // Try updating by slug or id
    let result = null;
    if (slug) {
      const { data } = await supabase.from('rooms').update(updateData).eq('slug', slug).select();
      result = data;
    }
    if ((!result || result.length === 0) && id) {
      const { data } = await supabase.from('rooms').update(updateData).eq('id', id).select();
      result = data;
    }

    return NextResponse.json({
      success: true,
      message: 'Room updated in Supabase database',
      data: result,
    });
  } catch (error: any) {
    console.error('Error updating room in Supabase:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update room in Supabase' },
      { status: 500 }
    );
  }
}
