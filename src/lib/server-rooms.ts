import fs from 'fs';
import path from 'path';
import os from 'os';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_ROOMS_DATA, RoomCategoryData } from './hotel-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');
const TMP_FILE = path.join(os.tmpdir(), 'super_e_rooms_v5.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

/**
 * Merge Supabase photos (authoritative) into the local rooms list.
 * Local rooms provide units, price, and fallback images.
 * Supabase provides the latest photos uploaded/deleted via the admin.
 */
function applySupabasePhotos(
  localRooms: RoomCategoryData[],
  supabaseRows: any[]
): RoomCategoryData[] {
  return localRooms.map((room) => {
    const match = supabaseRows.find(
      (r: any) =>
        r.slug === room.slug ||
        r.slug === `${room.slug}-room` ||
        (r.name || '').toLowerCase() === room.name.toLowerCase()
    );
    if (!match) return room;

    // Supabase `photos` column is the source of truth for images
    const photos: string[] =
      Array.isArray(match.photos) && match.photos.length > 0
        ? match.photos
        : room.images && room.images.length > 0
        ? room.images
        : [room.image];

    const price =
      match.price_per_night && Number(match.price_per_night) >= room.price * 0.7
        ? Number(match.price_per_night)
        : room.price;

    return {
      ...room,
      price,
      image: photos[0] || room.image,
      images: photos,
      status: match.status || room.status || 'available',
    };
  });
}

/**
 * Server-only: read rooms from the local file cache (tmp or data/).
 * Returns INITIAL_ROOMS_DATA if neither file exists.
 */
function readLocalRooms(): RoomCategoryData[] {
  // 1. Prefer /tmp file (survives serverless warm restarts)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}

  // 2. Fall back to data/rooms.json (local dev)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}

  return INITIAL_ROOMS_DATA;
}

/**
 * Async version: fetches live photos from Supabase and merges them in.
 * Use this wherever await is possible (server components, generateMetadata, etc.)
 */
export async function getServerRoomsDataAsync(): Promise<RoomCategoryData[]> {
  const localRooms = readLocalRooms();
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('slug, name, photos, price_per_night, status')
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        return applySupabasePhotos(localRooms, data);
      }
    } catch (err) {
      console.warn('server-rooms: Supabase query warning:', err);
    }
  }

  return localRooms;
}

/**
 * Sync version (kept for backwards compatibility where async isn't possible).
 * Reads only from local file cache — use getServerRoomsDataAsync() in Server Components.
 */
export function getServerRoomsData(): RoomCategoryData[] {
  return readLocalRooms();
}

/**
 * Async version: find a single room by slug, with live Supabase photos.
 */
export async function getServerRoomBySlugAsync(slug: string): Promise<RoomCategoryData | undefined> {
  const rooms = await getServerRoomsDataAsync();
  return rooms.find(
    (r) =>
      r.slug === slug ||
      r.id === slug ||
      `${r.slug}-room` === slug ||
      (slug === 'vip-luxury-suite' && r.slug === 'presidential-suite')
  );
}

/**
 * Sync fallback (local cache only).
 */
export function getServerRoomBySlug(slug: string): RoomCategoryData | undefined {
  const rooms = getServerRoomsData();
  return rooms.find(
    (r) =>
      r.slug === slug ||
      r.id === slug ||
      `${r.slug}-room` === slug ||
      (slug === 'vip-luxury-suite' && r.slug === 'presidential-suite')
  );
}

