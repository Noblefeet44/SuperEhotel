import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '@/lib/auth';

export interface StoredBooking {
  id: string;
  ref: string;
  guestName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  roomName: string;
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  numGuests: number;
  totalAmount: number;
  specialRequests?: string;
  paymentBank: string;
  paymentAccountNumber: string;
  paymentAccountName: string;
  receiptImage?: string;
  receiptFileName?: string;
  status: 'new' | 'awaiting_confirmation' | 'confirmed' | 'checked_in' | 'cancelled';
  paymentStatus: 'not_paid' | 'awaiting_payment' | 'paid';
  adminNotes?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

function ensureDataFile(): StoredBooking[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading bookings file:', err);
    return [];
  }
}

function saveBookings(bookings: StoredBooking[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving bookings file:', err);
    return false;
  }
}

export async function GET() {
  const localBookings = ensureDataFile();
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, guests(*), rooms(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const supabaseBookings: StoredBooking[] = data.map((b: any) => ({
          id: b.id,
          ref: b.reference_number,
          guestName: b.guests?.full_name || 'Guest',
          phone: b.guests?.phone || '',
          whatsapp: b.guests?.whatsapp || b.guests?.phone || '',
          email: b.guests?.email || '',
          roomName: b.rooms?.name || 'Hotel Room',
          roomSlug: b.rooms?.slug || '',
          checkIn: b.check_in_date,
          checkOut: b.check_out_date,
          nights: b.total_nights || 1,
          numGuests: b.num_guests || 1,
          totalAmount: Number(b.total_amount) || 0,
          specialRequests: b.special_requests || '',
          paymentBank: 'Moniepoint Microfinance Bank',
          paymentAccountNumber: '5326187865',
          paymentAccountName: 'SUPER E LUXURY HOTEL AND SUITES LTD - RECEPTION',
          status: b.booking_status || 'new',
          paymentStatus: b.payment_status || 'paid',
          createdAt: b.created_at,
        }));

        // Merge: add any local bookings that aren't yet in Supabase
        const existingRefs = new Set(supabaseBookings.map((b) => b.ref));
        const missingLocal = localBookings.filter((b) => !existingRefs.has(b.ref));
        const merged = [...supabaseBookings, ...missingLocal];

        return NextResponse.json({ success: true, bookings: merged });
      }
    } catch (err) {
      console.warn('Supabase bookings query warning (using local):', err);
    }
  }

  return NextResponse.json({ success: true, bookings: localBookings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.guestName || !body.phone || !body.roomName) {
      return NextResponse.json(
        { success: false, error: 'Missing required booking fields (guestName, phone, roomName)' },
        { status: 400 }
      );
    }

    const ref = body.ref || `SE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: StoredBooking = {
      id: body.id || `b_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ref,
      guestName: body.guestName,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      email: body.email || '',
      roomName: body.roomName,
      roomSlug: body.roomSlug || '',
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      nights: Number(body.nights) || 1,
      numGuests: Number(body.numGuests) || 1,
      totalAmount: Number(body.totalAmount) || 0,
      specialRequests: body.specialRequests || '',
      paymentBank: body.paymentBank || 'Moniepoint Microfinance Bank',
      paymentAccountNumber: body.paymentAccountNumber || '5326187865',
      paymentAccountName: body.paymentAccountName || 'SUPER E LUXURY HOTEL AND SUITES LTD - RECEPTION',
      receiptImage: body.receiptImage || '',
      receiptFileName: body.receiptFileName || '',
      status: 'awaiting_confirmation',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
    };

    // 1. Sync to Supabase
    const supabase = getSupabase();
    if (supabase) {
      try {
        // Insert or find guest
        let guestId: string | null = null;
        const { data: existingGuests } = await supabase
          .from('guests')
          .select('id')
          .eq('phone', body.phone)
          .limit(1);

        if (existingGuests && existingGuests.length > 0) {
          guestId = existingGuests[0].id;
        } else {
          const { data: newGuest } = await supabase
            .from('guests')
            .insert({
              full_name: body.guestName,
              phone: body.phone,
              whatsapp: body.whatsapp || body.phone,
              email: body.email || null,
            })
            .select('id')
            .single();

          if (newGuest) guestId = newGuest.id;
        }

        // Find matching room
        let roomId: string | null = null;
        // Use parameterized slug search first (safe from injection)
        if (body.roomSlug) {
          const { data: slugMatched } = await supabase
            .from('rooms')
            .select('id')
            .eq('slug', body.roomSlug)
            .limit(1);
          if (slugMatched && slugMatched.length > 0) {
            roomId = slugMatched[0].id;
          }
        }
        const { data: matchedRooms } = !roomId && body.roomSlug ? await supabase
          .from('rooms')
          .select('id')
          .eq('slug', body.roomSlug)
          .limit(1) : { data: null };

        if (matchedRooms && matchedRooms.length > 0) {
          roomId = matchedRooms[0].id;
        } else {
          // Fallback: try name search with separate query to avoid injection
          const { data: nameMatched } = await supabase
            .from('rooms')
            .select('id')
            .ilike('name', `%${(body.roomName || '').replace(/[%_]/g, '')}%`)
            .limit(1);
          if (nameMatched && nameMatched.length > 0) {
            roomId = nameMatched[0].id;
          }
        }

        // Insert booking into Supabase
        if (guestId && roomId) {
          await supabase.from('bookings').insert({
            reference_number: ref,
            guest_id: guestId,
            room_id: roomId,
            check_in_date: body.checkIn,
            check_out_date: body.checkOut,
            num_guests: Number(body.numGuests) || 1,
            total_amount: Number(body.totalAmount) || 0,
            booking_status: 'awaiting_confirmation',
            payment_status: 'paid',
            special_requests: body.specialRequests || null,
          });
        }
      } catch (sbErr) {
        console.warn('Supabase booking sync warning:', sbErr);
      }
    }

    // 2. Save to local JSON backup
    const bookings = ensureDataFile();
    bookings.unshift(newBooking);
    saveBookings(bookings);

    return NextResponse.json({
      success: true,
      message: 'Booking and payment receipt saved successfully',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error handling booking submission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process booking submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ref, status, paymentStatus, adminNotes } = body;

    if (!id && !ref) {
      return NextResponse.json({ success: false, error: 'Booking ID or Ref required' }, { status: 400 });
    }

    // 1. Sync update to Supabase
    const supabase = getSupabase();
    if (supabase) {
      try {
        const updatePayload: any = {};
        if (status !== undefined) updatePayload.booking_status = status;
        if (paymentStatus !== undefined) updatePayload.payment_status = paymentStatus;
        if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

        if (ref) {
          await supabase.from('bookings').update(updatePayload).eq('reference_number', ref);
        } else if (id) {
          await supabase.from('bookings').update(updatePayload).eq('id', id);
        }
      } catch (sbErr) {
        console.warn('Supabase booking update warning:', sbErr);
      }
    }

    // 2. Update local JSON backup
    const bookings = ensureDataFile();
    const index = bookings.findIndex((b) => (id && b.id === id) || (ref && b.ref === ref));

    if (index !== -1) {
      if (status !== undefined) bookings[index].status = status;
      if (paymentStatus !== undefined) bookings[index].paymentStatus = paymentStatus;
      if (adminNotes !== undefined) bookings[index].adminNotes = adminNotes;
      saveBookings(bookings);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      booking: index !== -1 ? bookings[index] : { id, ref, status, paymentStatus },
    });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}
