import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_ROOMS_DATA, RoomCategoryData } from '@/lib/hotel-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

function ensureRoomsFile(): RoomCategoryData[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_ROOMS_DATA, null, 2), 'utf8');
      return INITIAL_ROOMS_DATA;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ROOMS_DATA;
  } catch (err) {
    console.error('Error reading rooms file:', err);
    return INITIAL_ROOMS_DATA;
  }
}

function saveRooms(rooms: RoomCategoryData[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(rooms, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving rooms file:', err);
    return false;
  }
}

// GET /api/rooms: Fetch live rooms from server file and Supabase
export async function GET() {
  const localRooms = ensureRoomsFile();
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

          const localMatch = localRooms.find((lr) => lr.slug === r.slug || lr.id === r.id);

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
            units: localMatch?.units || [],
          };
        });

        return NextResponse.json({ success: true, rooms: mappedRooms });
      }
    } catch (err) {
      console.warn('Supabase rooms query warning:', err);
    }
  }

  return NextResponse.json({ success: true, rooms: localRooms });
}

// POST /api/rooms: Update or insert room tier (saves to data/rooms.json and Supabase)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, slug, name, price, maxGuests, bedType, roomSize, images, image, description, facilities, isFeatured, units } = body;

    const currentRooms = ensureRoomsFile();
    const photos = images && Array.isArray(images) && images.length > 0
      ? images
      : (image ? [image] : ['/images/standard-room.jpg']);

    const targetRoomIndex = currentRooms.findIndex((r) => r.slug === slug || r.id === id);

    const roomPayload: RoomCategoryData = {
      id: id || slug || `room_${Date.now()}`,
      slug: slug || id || 'standard',
      name: name || 'Standard Room',
      category: body.category || 'Standard',
      price: Number(price) || 36000,
      maxGuests: Number(maxGuests) || 2,
      bedType: bedType || 'Queen Bed',
      roomSize: roomSize || '25 sqm',
      image: photos[0],
      images: photos,
      description: description || '',
      facilities: Array.isArray(facilities) ? facilities : [],
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      units: Array.isArray(units) ? units : (targetRoomIndex >= 0 ? currentRooms[targetRoomIndex].units : []),
    };

    let updatedRooms: RoomCategoryData[];
    if (targetRoomIndex >= 0) {
      updatedRooms = currentRooms.map((r, i) => (i === targetRoomIndex ? roomPayload : r));
    } else {
      updatedRooms = [...currentRooms, roomPayload];
    }

    saveRooms(updatedRooms);

    // Sync to Supabase in background if configured
    const supabase = getSupabase();
    if (supabase) {
      try {
        const updateData: any = {
          name: roomPayload.name,
          price_per_night: roomPayload.price,
          max_guests: roomPayload.maxGuests,
          bed_type: roomPayload.bedType,
          room_size: roomPayload.roomSize,
          description: roomPayload.description,
          facilities: roomPayload.facilities,
          photos: roomPayload.images,
          updated_at: new Date().toISOString(),
        };

        if (isFeatured !== undefined) {
          updateData.is_featured = Boolean(isFeatured);
        }

        if (slug) {
          await supabase.from('rooms').update(updateData).eq('slug', slug);
        } else if (id) {
          await supabase.from('rooms').update(updateData).eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase room update notice:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Room and photos saved successfully',
      room: roomPayload,
      rooms: updatedRooms,
    });
  } catch (error: any) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update room' },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms: Delete a specific photo from a room carousel or delete an entire room
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId') || searchParams.get('id');
    const photoUrl = searchParams.get('photoUrl');
    const photoIndex = searchParams.get('photoIndex');

    if (!roomId) {
      return NextResponse.json({ success: false, error: 'Missing roomId parameter' }, { status: 400 });
    }

    const currentRooms = ensureRoomsFile();
    const roomIndex = currentRooms.findIndex((r) => r.id === roomId || r.slug === roomId);

    if (roomIndex === -1) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    const room = currentRooms[roomIndex];
    let updatedImages = [...(room.images || [room.image])];

    if (photoUrl) {
      updatedImages = updatedImages.filter((img) => img !== photoUrl);
    } else if (photoIndex !== null && photoIndex !== undefined) {
      const idx = parseInt(photoIndex, 10);
      if (!isNaN(idx) && idx >= 0 && idx < updatedImages.length) {
        updatedImages.splice(idx, 1);
      }
    }

    if (updatedImages.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Each room category must have at least one photo.',
      }, { status: 400 });
    }

    const updatedRoom: RoomCategoryData = {
      ...room,
      image: updatedImages[0],
      images: updatedImages,
    };

    const updatedRooms = currentRooms.map((r, i) => (i === roomIndex ? updatedRoom : r));
    saveRooms(updatedRooms);

    // Sync to Supabase
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('rooms')
          .update({ photos: updatedImages, updated_at: new Date().toISOString() })
          .eq('slug', room.slug);
      } catch (err) {
        console.warn('Supabase delete photo notice:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted from carousel successfully',
      room: updatedRoom,
      rooms: updatedRooms,
    });
  } catch (error: any) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
