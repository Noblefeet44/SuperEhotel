import fs from 'fs';
import path from 'path';
import os from 'os';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_ROOMS_DATA, RoomCategoryData } from './hotel-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');
const TMP_FILE = path.join(os.tmpdir(), 'super_e_rooms_v5.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abiavsgmbokwyxlahhyt.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiaWF2c2dtYm9rd3l4bGFoaHl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTAwODA4MSwiZXhwIjoyMTA2NTg0MDgxfQ.aE1ghNEm3xN_I0cOpcE7opJLiiX9mlE7P0y3zRDuuMk';
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
    // Priority match: exact slug > name match > '-room' suffix (seed data)
    // This ensures admin-saved rows (slug='standard') beat seed rows (slug='standard-room')
    const match =
      supabaseRows.find((r: any) => r.slug === room.slug) ||
      supabaseRows.find((r: any) => (r.name || '').toLowerCase() === room.name.toLowerCase()) ||
      supabaseRows.find((r: any) => r.slug === `${room.slug}-room`);

    if (!match) return room;

    // Supabase `photos` column is the source of truth for images
    let photos: string[] =
      Array.isArray(match.photos) && match.photos.length > 0
        ? match.photos
        : room.images && room.images.length > 0
        ? room.images
        : [room.image];

    // Specifically ensure hotel-exterior.jpg is never attached to deluxe-2
    if (room.slug === 'deluxe-2') {
      photos = photos.filter((img) => !img.includes('hotel-exterior.jpg'));
      if (photos.length === 0) {
        photos = ['/images/deluxe-2.jpg', '/images/deluxe-1.jpg'];
      }
    }

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
 * Async version: fetches live rooms and photos from Supabase Storage app-data and local files.
 * Use this wherever await is possible (server components, generateMetadata, etc.)
 */
export async function getServerRoomsDataAsync(): Promise<RoomCategoryData[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const downloadPromise = supabase.storage.from('app-data').download('rooms.json');
      const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('Timeout') }), 2500)
      );

      const result: any = await Promise.race([downloadPromise, timeoutPromise]);
      if (result && result.data && typeof result.data.text === 'function') {
        const text = await result.data.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Cache locally
          try {
            fs.writeFileSync(TMP_FILE, JSON.stringify(parsed, null, 2), 'utf8');
            if (fs.existsSync(DATA_DIR)) {
              fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');
            }
          } catch (_) {}
          return parsed;
        }
      }
    } catch (err) {
      console.warn('server-rooms: Supabase app-data query warning:', err);
    }
  }

  return readLocalRooms();
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

