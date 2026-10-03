import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_ROOMS_DATA, RoomCategoryData } from '@/lib/hotel-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');
const TMP_FILE = path.join(os.tmpdir(), 'super_e_rooms_v5.json');

// In-memory cache to guarantee persistence across requests in serverless runtime
let serverMemoryRooms: RoomCategoryData[] | null = null;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abiavsgmbokwyxlahhyt.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWF2c2dtYm9rd3l4bGFoaHl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTAwODA4MSwiZXhwIjoyMTA2NTg0MDgxfQ.aE1ghNEm3xN_I0cOpcE7opJLiiX9mlE7P0y3zRDuuMk';
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

function parseAndMergeRooms(parsed: any[]): RoomCategoryData[] {
  const merged: RoomCategoryData[] = INITIAL_ROOMS_DATA.map((def) => {
    const found = parsed.find(
      (p: any) => p.id === def.id || p.slug === def.slug || `${p.slug}-room` === def.slug
    );
    if (!found) return def;

    const units = Array.isArray(found.units) && found.units.length > 0 ? found.units : def.units;
    const price = (found.price && found.price >= def.price * 0.7) ? found.price : def.price;
    const images = (Array.isArray(found.images) && found.images.length > 0)
      ? found.images
      : (found.image ? [found.image] : def.images);

    return {
      ...def,
      ...found,
      price,
      images,
      image: images[0] || def.image,
      status: found.status || def.status || 'available',
      units,
    };
  });

  // Preserve any custom user-added rooms
  const custom = parsed.filter(
    (p: any) => !INITIAL_ROOMS_DATA.some((def) => def.id === p.id || def.slug === p.slug)
  );

  return [...merged, ...custom];
}

function ensureRoomsFile(): RoomCategoryData[] {
  // 1. Return in-memory cache if available
  if (serverMemoryRooms && serverMemoryRooms.length > 0) {
    return serverMemoryRooms;
  }

  // 2. Check writable TMP_FILE (for serverless environments)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const enriched = parseAndMergeRooms(parsed);
        serverMemoryRooms = enriched;
        return enriched;
      }
    }
  } catch (tmpErr) {
    console.warn('Notice: TMP_FILE read warning:', tmpErr);
  }

  // 3. Check repo DATA_FILE
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const enriched = parseAndMergeRooms(parsed);
        serverMemoryRooms = enriched;
        return enriched;
      }
    }
  } catch (fsErr) {
    console.warn('Notice: DATA_FILE read warning:', fsErr);
  }

  serverMemoryRooms = INITIAL_ROOMS_DATA;
  return INITIAL_ROOMS_DATA;
}

function saveRooms(rooms: RoomCategoryData[]): boolean {
  serverMemoryRooms = rooms;

  // Always write to writable /tmp directory (works on Vercel and local)
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(rooms, null, 2), 'utf8');
  } catch (tmpErr) {
    console.warn('Error saving to TMP_FILE:', tmpErr);
  }

  // Try writing to repo DATA_FILE (works on local development)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(rooms, null, 2), 'utf8');
  } catch (fsErr) {
    // Expected on read-only serverless filesystems
  }

  return true;
}

// GET /api/rooms: Fetch live rooms from server file and Supabase
export async function GET() {
  const localRooms = ensureRoomsFile();
  const supabase = getSupabase();

  if (supabase) {
    try {
      const supabasePromise = supabase
        .from('rooms')
        .select('*, room_categories(name, slug)')
        .order('display_order', { ascending: true });

      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('Supabase timeout') }), 1000)
      );

      const { data, error } = await Promise.race([supabasePromise, timeoutPromise]);

      if (!error && data && data.length > 0) {
        // Merge Supabase data — Supabase is the source of truth for photos.
        // Use priority match: exact slug wins over -room suffix variant (seed data).
        const mergedRooms = localRooms.map((local) => {
          const match =
            data.find((r: any) => r.slug === local.slug) ||
            data.find((r: any) => (r.name || '').toLowerCase() === local.name.toLowerCase()) ||
            data.find((r: any) => r.slug === `${local.slug}-room`);

          if (!match) return local;

          // Supabase photos are authoritative (admin uploads/deletions persist there)
          let photos = (Array.isArray(match.photos) && match.photos.length > 0)
            ? match.photos
            : (local.images && local.images.length > 0 ? local.images : [local.image]);

          if (local.slug === 'deluxe-2') {
            photos = photos.filter((img: string) => !img.includes('hotel-exterior.jpg'));
            if (photos.length === 0) {
              photos = ['/images/deluxe-2.jpg', '/images/deluxe-1.jpg'];
            }
          }

          const price = (match.price_per_night && Number(match.price_per_night) >= local.price * 0.7)
            ? Number(match.price_per_night)
            : local.price;

          return {
            ...local,
            price,
            image: photos[0],
            images: photos,
            status: match.status || local.status || 'available',
          };
        });

        return NextResponse.json({ success: true, rooms: mergedRooms });
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
    const currentRooms = ensureRoomsFile();

    // 1. Direct unit status change: { action: 'update_unit_status', roomId, unitId, status }
    if (body.action === 'update_unit_status') {
      const { roomId, unitId, status } = body;
      const updatedRooms = currentRooms.map((r) => {
        if (r.id !== roomId && r.slug !== roomId) return r;
        const updatedUnits = r.units.map((u) => {
          if (u.id !== unitId) return u;
          return { ...u, status };
        });
        return { ...r, units: updatedUnits };
      });
      saveRooms(updatedRooms);
      return NextResponse.json({ success: true, message: `Unit updated to ${status}`, rooms: updatedRooms });
    }

    // 2. Batch mark all units in a tier: { action: 'mark_all_units', roomId, status }
    if (body.action === 'mark_all_units') {
      const { roomId, status } = body;
      const updatedRooms = currentRooms.map((r) => {
        if (r.id !== roomId && r.slug !== roomId) return r;
        const updatedUnits = r.units.map((u) => ({ ...u, status }));
        return { ...r, status, units: updatedUnits };
      });
      saveRooms(updatedRooms);
      return NextResponse.json({ success: true, message: `All units marked as ${status}`, rooms: updatedRooms });
    }

    // 3. Update room tier status: { action: 'update_tier_status', roomId, status }
    if (body.action === 'update_tier_status') {
      const { roomId, status } = body;
      const updatedRooms = currentRooms.map((r) => {
        if (r.id !== roomId && r.slug !== roomId) return r;
        return { ...r, status };
      });
      saveRooms(updatedRooms);
      return NextResponse.json({ success: true, message: `Tier status updated to ${status}`, rooms: updatedRooms });
    }

    // 4. Save entire rooms array: { action: 'save_all', rooms }
    if (body.action === 'save_all' && Array.isArray(body.rooms)) {
      saveRooms(body.rooms);
      return NextResponse.json({ success: true, message: 'All inventory saved', rooms: body.rooms });
    }

    // 5. Normal single room category update / insert
    const { id, slug, name, price, maxGuests, bedType, roomSize, images, image, description, facilities, isFeatured, units, status } = body;

    const trimmedName = (name || '').trim();

    const cleanSlug = slug && !slug.startsWith('new-tier-')
      ? slug
      : (trimmedName ? trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `room-${Date.now()}`);

    const cleanId = id && !id.startsWith('tier-') ? id : cleanSlug;

    const photos = images && Array.isArray(images) && images.length > 0
      ? images.filter(Boolean)
      : (image ? [image] : ['/images/standard-room.jpg']);

    const targetRoomIndex = currentRooms.findIndex((r) => r.slug === cleanSlug || r.id === cleanId || r.slug === slug || r.id === id);

    const roomUnits = (Array.isArray(units) && units.length > 0)
      ? units
      : (targetRoomIndex >= 0 && Array.isArray(currentRooms[targetRoomIndex].units) && currentRooms[targetRoomIndex].units.length > 0
          ? currentRooms[targetRoomIndex].units
          : [
              {
                id: `${cleanSlug}-101`,
                roomNumber: '101',
                floor: '1st Floor',
                status: (status as any) || 'available',
              },
            ]);

    const roomPayload: RoomCategoryData = {
      id: cleanId,
      slug: cleanSlug,
      name: trimmedName || 'Standard Room',
      category: body.category || 'Standard',
      price: Number(price) || 36000,
      status: status || 'available',
      maxGuests: Number(maxGuests) || 2,
      bedType: bedType || 'Queen Bed',
      roomSize: roomSize || '25 sqm',
      image: photos[0] || '/images/standard-room.jpg',
      images: photos.length > 0 ? photos : ['/images/standard-room.jpg'],
      description: description || '',
      facilities: Array.isArray(facilities) && facilities.length > 0 ? facilities : ['Air Conditioning', 'Flat Screen TV', 'Wi-Fi', 'Hot Water'],
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
      units: roomUnits,
    };

    let updatedRooms: RoomCategoryData[];
    if (targetRoomIndex >= 0) {
      updatedRooms = currentRooms.map((r, i) => (i === targetRoomIndex ? roomPayload : r));
    } else {
      updatedRooms = [...currentRooms, roomPayload];
    }

    saveRooms(updatedRooms);

    // Sync to Supabase — update ALL slug variants so the seed rows stay in sync
    const supabase = getSupabase();
    if (supabase) {
      try {
        const photoData = {
          name: roomPayload.name,
          price_per_night: roomPayload.price,
          status: roomPayload.status || 'available',
          max_guests: roomPayload.maxGuests,
          bed_type: roomPayload.bedType,
          room_size: roomPayload.roomSize,
          description: roomPayload.description,
          facilities: roomPayload.facilities,
          photos: roomPayload.images,
          updated_at: new Date().toISOString(),
        };

        if (isFeatured !== undefined) {
          (photoData as any).is_featured = Boolean(isFeatured);
        }

        // 1. Update the exact slug row (admin-created rows)
        const res1 = await supabase.from('rooms').update(photoData).eq('slug', roomPayload.slug);
        if (res1.error) console.warn('Supabase exact slug update warning:', res1.error.message);

        // 2. Also update the seed row which has a '-room' suffix slug
        //    e.g. 'standard' admin slug → 'standard-room' seed slug
        const res2 = await supabase.from('rooms').update(photoData).eq('slug', `${roomPayload.slug}-room`);
        if (res2.error) console.warn('Supabase suffix slug update warning:', res2.error.message);

        // 3. Also update by name to catch any other seeded variation
        const res3 = await supabase.from('rooms').update(photoData).ilike('name', roomPayload.name);
        if (res3.error) console.warn('Supabase name update warning:', res3.error.message);

        // 4. If neither row exists yet, insert a new one
        const { data: existingRows } = await supabase
          .from('rooms')
          .select('id')
          .or(`slug.eq.${roomPayload.slug},slug.eq.${roomPayload.slug}-room`);

        if (!existingRows || existingRows.length === 0) {
          await supabase.from('rooms').insert({
            slug: roomPayload.slug,
            ...photoData,
          });
        }
      } catch (err) {
        console.warn('Supabase room update notice:', err);
      }
    }

    try {
      revalidatePath('/rooms');
      revalidatePath('/rooms/[slug]', 'page');
      revalidatePath(`/rooms/${roomPayload.slug}`);
      revalidatePath('/');
      revalidatePath('/admin/rooms');
    } catch (_) {}

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

    // If neither photoUrl nor photoIndex is provided, delete the entire room category
    if (!photoUrl && (photoIndex === null || photoIndex === undefined)) {
      const updatedRooms = currentRooms.filter((r) => r.id !== roomId && r.slug !== roomId);
      saveRooms(updatedRooms);

      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from('rooms').delete().eq('slug', room.slug);
        } catch (err) {
          console.warn('Supabase delete room notice:', err);
        }
      }

      return NextResponse.json({
        success: true,
        message: `${room.name} deleted successfully`,
        rooms: updatedRooms,
      });
    }

    // Otherwise, delete a specific photo from the room
    let updatedImages = [...(room.images || [room.image])];

    if (photoUrl) {
      const decodedTarget = decodeURIComponent(photoUrl).trim();
      updatedImages = updatedImages.filter((img) => {
        const decodedImg = decodeURIComponent(img).trim();
        return img !== photoUrl && decodedImg !== decodedTarget;
      });
    } else if (photoIndex !== null && photoIndex !== undefined) {
      const idx = parseInt(photoIndex, 10);
      if (!isNaN(idx) && idx >= 0 && idx < updatedImages.length) {
        updatedImages.splice(idx, 1);
      }
    }

    if (updatedImages.length === 0) {
      updatedImages = ['/images/standard-room.jpg'];
    }

    const updatedRoom: RoomCategoryData = {
      ...room,
      image: updatedImages[0] || '/images/standard-room.jpg',
      images: updatedImages,
    };

    const updatedRooms = currentRooms.map((r, i) => (i === roomIndex ? updatedRoom : r));
    saveRooms(updatedRooms);

    // Sync to Supabase — update ALL slug variants
    const supabase = getSupabase();
    if (supabase) {
      try {
        const photoPayload = { photos: updatedImages, updated_at: new Date().toISOString() };
        // Update exact slug row, the seed '-room' variant, and by name
        await supabase.from('rooms').update(photoPayload).eq('slug', room.slug);
        await supabase.from('rooms').update(photoPayload).eq('slug', `${room.slug}-room`);
        await supabase.from('rooms').update(photoPayload).ilike('name', room.name);
      } catch (err) {
        console.warn('Supabase delete photo notice:', err);
      }
    }

    try {
      revalidatePath('/rooms');
      revalidatePath('/rooms/[slug]', 'page');
      revalidatePath(`/rooms/${room.slug}`);
      revalidatePath('/');
      revalidatePath('/admin/rooms');
    } catch (_) {}

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
