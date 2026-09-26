import fs from 'fs';
import path from 'path';
import { INITIAL_ROOMS_DATA, RoomCategoryData } from './hotel-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rooms.json');

/**
 * Server-only helper to read persistent rooms from data/rooms.json
 * If missing, falls back to INITIAL_ROOMS_DATA.
 */
export function getServerRoomsData(): RoomCategoryData[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading rooms from disk on server:', err);
  }
  return INITIAL_ROOMS_DATA;
}

/**
 * Server-only helper to find a room by slug or id
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
