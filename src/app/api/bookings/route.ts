import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { createClient } from '@supabase/supabase-js';

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
  status: 'new' | 'awaiting_confirmation' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus: 'not_paid' | 'awaiting_payment' | 'partially_paid' | 'paid';
  paymentMethod?: 'cash' | 'pos_debit_card' | 'bank_transfer' | 'split' | 'pay_later';
  paymentReference?: string;
  amountPaid?: number;
  balanceDue?: number;
  roomNumber?: string;
  isWalkIn?: boolean;
  cashierName?: string;
  adminNotes?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');
const TMP_FILE = path.join(os.tmpdir(), 'super-e-bookings.json');

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

function ensureDataFile(): StoredBooking[] {
  // 1. Try primary data file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Notice reading data/bookings.json:', err);
  }

  // 2. Try tmp file fallback (persists across ephemeral writes)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  // 3. Try to initialize
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  } catch {}

  return [];
}

function saveBookings(bookings: StoredBooking[]): boolean {
  let saved = false;
  // 1. Try saving to DATA_FILE
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf8');
    saved = true;
  } catch (err) {
    console.warn('Read-only primary filesystem (falling back to tmp):', err);
  }

  // 2. Always backup to TMP_FILE
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(bookings, null, 2), 'utf8');
    saved = true;
  } catch (tmpErr) {
    console.warn('Tmp bookings write warning:', tmpErr);
  }

  return saved;
}

/**
 * Saves guest payment receipt to Supabase Storage bucket ('receipts' / 'media'),
 * local disk (/public/uploads/receipts/), and registers in the media table.
 */
async function saveReceiptToStorage(
  ref: string,
  receiptDataOrUrl: string,
  originalFileName?: string
): Promise<{ receiptUrl: string; fileName: string }> {
  if (!receiptDataOrUrl) {
    return { receiptUrl: '', fileName: '' };
  }

  // If already a remote public URL and not a data URI, keep it
  if (receiptDataOrUrl.startsWith('http://') || receiptDataOrUrl.startsWith('https://')) {
    return { receiptUrl: receiptDataOrUrl, fileName: originalFileName || 'receipt.jpg' };
  }

  // If already a local relative path
  if (receiptDataOrUrl.startsWith('/uploads/')) {
    return { receiptUrl: receiptDataOrUrl, fileName: originalFileName || path.basename(receiptDataOrUrl) };
  }

  // Check if it's a base64 Data URI
  const matches = receiptDataOrUrl.match(/^data:([A-Za-z0-9+/.-]+);base64,(.+)$/);
  if (!matches) {
    return { receiptUrl: receiptDataOrUrl, fileName: originalFileName || 'receipt.jpg' };
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
  };
  const ext = extMap[mimeType] || 'jpg';
  const cleanRef = ref.replace(/[^a-zA-Z0-9-]/g, '_');
  const fileName = `receipt_${cleanRef}_${Date.now()}.${ext}`;

  let finalUrl = receiptDataOrUrl; // Base64 serves as fail-safe fallback

  // 1. Save to local filesystem public/uploads/receipts/ immediately (< 5ms)
  try {
    const receiptsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }
    const localFilePath = path.join(receiptsDir, fileName);
    fs.writeFileSync(localFilePath, buffer);
    finalUrl = `/uploads/receipts/${fileName}`;
  } catch (fsErr) {
    console.warn('Local disk save notice (read-only):', fsErr);
  }

  // 2. Upload to Supabase Storage Bucket ('receipts' or 'media') with strict 3.5s timeout
  const supabase = getSupabase();
  if (supabase) {
    try {
      const uploadFn = async () => {
        let targetBucket = 'receipts';
        let { data: uploadRes, error: uploadErr } = await supabase.storage
          .from(targetBucket)
          .upload(fileName, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadErr) {
          targetBucket = 'media';
          const mediaUpload = await supabase.storage
            .from(targetBucket)
            .upload(`receipts/${fileName}`, buffer, {
              contentType: mimeType,
              upsert: true,
            });
          uploadRes = mediaUpload.data;
          uploadErr = mediaUpload.error;
        }

        if (!uploadErr && uploadRes?.path) {
          const { data: publicUrlData } = supabase.storage
            .from(targetBucket)
            .getPublicUrl(uploadRes.path);
          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
        return null;
      };

      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 3500)
      );

      const remoteUrl = await Promise.race([uploadFn(), timeoutPromise]);
      if (remoteUrl) {
        finalUrl = remoteUrl;
      }
    } catch (sbStorageErr) {
      console.warn('Supabase storage upload error:', sbStorageErr);
    }
  }

  // 3. Register in Supabase 'media' table if connected (non-blocking)
  if (supabase && finalUrl && !finalUrl.startsWith('data:')) {
    Promise.resolve(
      supabase.from('media').insert({
        file_name: fileName,
        file_url: finalUrl,
        file_type: mimeType.startsWith('image/') ? 'image' : 'document',
        file_size: buffer.length,
        alt_text: `Payment Receipt for Booking ${ref}`,
        usage_context: 'receipt',
      })
    ).catch(() => {});
  }

  return { receiptUrl: finalUrl, fileName };
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
        // Query files from 'receipts' bucket to correlate any receipt by reference
        const bucketReceiptMap = new Map<string, string>();
        try {
          const { data: receiptFiles } = await supabase.storage.from('receipts').list();
          if (receiptFiles && Array.isArray(receiptFiles)) {
            for (const file of receiptFiles) {
              const parts = file.name.split('_');
              if (parts.length >= 2) {
                const fileRef = parts[1];
                const { data: pUrl } = supabase.storage.from('receipts').getPublicUrl(file.name);
                if (pUrl?.publicUrl) {
                  bucketReceiptMap.set(fileRef, pUrl.publicUrl);
                }
              }
            }
          }
        } catch {
          // ignore bucket list errors
        }

        const supabaseBookings: StoredBooking[] = data.map((b: any) => {
          const localMatch = localBookings.find(
            (l) => l.ref === b.reference_number || l.id === b.id
          );

          // Priority for receipt image:
          // 1. Direct receipt_url from Supabase row
          // 2. Receipt image from localBookings matching ref
          // 3. Receipt found directly in 'receipts' storage bucket matching ref
          // 4. Fallback receipt_image
          const receiptImg =
            b.receipt_url ||
            localMatch?.receiptImage ||
            bucketReceiptMap.get(b.reference_number) ||
            b.receipt_image ||
            '';

          const receiptFileName =
            b.receipt_file_name ||
            localMatch?.receiptFileName ||
            (receiptImg && !receiptImg.startsWith('data:') ? path.basename(receiptImg) : '') ||
            '';

          return {
            id: b.id,
            ref: b.reference_number,
            guestName: b.guests?.full_name || localMatch?.guestName || 'Guest',
            phone: b.guests?.phone || localMatch?.phone || '',
            whatsapp: b.guests?.whatsapp || b.guests?.phone || localMatch?.whatsapp || '',
            email: b.guests?.email || localMatch?.email || '',
            roomName: b.rooms?.name || localMatch?.roomName || 'Hotel Room',
            roomSlug: b.rooms?.slug || localMatch?.roomSlug || '',
            checkIn: b.check_in_date || localMatch?.checkIn,
            checkOut: b.check_out_date || localMatch?.checkOut,
            nights: b.total_nights || localMatch?.nights || 1,
            numGuests: b.num_guests || localMatch?.numGuests || 1,
            totalAmount: Number(b.total_amount) || localMatch?.totalAmount || 0,
            paymentMethod: b.payment_method || localMatch?.paymentMethod || 'transfer',
            paymentReference: b.payment_reference || localMatch?.paymentReference || '',
            amountPaid: Number(b.amount_paid) || localMatch?.amountPaid || Number(b.total_amount) || 0,
            balanceDue: Number(b.balance_due) || localMatch?.balanceDue || 0,
            roomNumber: b.room_number || b.assigned_room_number || localMatch?.roomNumber || '',
            isWalkIn: Boolean(b.is_walk_in || localMatch?.isWalkIn),
            cashierName: b.cashier_name || localMatch?.cashierName || '',
            specialRequests: b.special_requests || localMatch?.specialRequests || '',
            paymentBank: 'Moniepoint Microfinance Bank',
            paymentAccountNumber: '5326187865',
            paymentAccountName: 'SUPER E LUXURY HOTEL AND SUITES LTD - RECEPTION',
            receiptImage: receiptImg,
            receiptFileName: receiptFileName,
            status: b.booking_status || localMatch?.status || 'new',
            paymentStatus: b.payment_status || localMatch?.paymentStatus || 'paid',
            adminNotes: b.admin_notes || localMatch?.adminNotes || '',
            createdAt: b.created_at || localMatch?.createdAt || new Date().toISOString(),
          };
        });

        // Merge: add any local bookings that aren't yet in Supabase
        const existingRefs = new Set(supabaseBookings.map((b) => b.ref));
        const missingLocal = localBookings.filter((b) => !existingRefs.has(b.ref));
        const merged = [...supabaseBookings, ...missingLocal];

        // Keep local cache in sync with live receipts
        try {
          saveBookings(merged);
        } catch {}

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
    const totalAmt = Number(body.totalAmount) || 0;
    const amtPaid = Number(body.amountPaid ?? totalAmt);
    const balDue = Number(body.balanceDue ?? Math.max(0, totalAmt - amtPaid));

    // Upload & persist receipt in storage bucket and local storage
    let receiptUrl = body.receiptImage || '';
    let receiptFileName = body.receiptFileName || '';

    if (receiptUrl) {
      try {
        const receiptResult = await saveReceiptToStorage(ref, receiptUrl, receiptFileName);
        receiptUrl = receiptResult.receiptUrl;
        receiptFileName = receiptResult.fileName;
      } catch (rErr) {
        console.warn('Receipt processing error (falling back):', rErr);
      }
    }

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
      totalAmount: totalAmt,
      paymentMethod: body.paymentMethod || (body.isWalkIn ? 'cash' : 'transfer'),
      paymentReference: body.paymentReference || '',
      amountPaid: amtPaid,
      balanceDue: balDue,
      roomNumber: body.roomNumber || '',
      isWalkIn: Boolean(body.isWalkIn),
      cashierName: body.cashierName || (body.isWalkIn ? 'Front Desk Cashier' : ''),
      specialRequests: body.specialRequests || '',
      paymentBank: body.paymentBank || 'Moniepoint Microfinance Bank',
      paymentAccountNumber: body.paymentAccountNumber || '5326187865',
      paymentAccountName: body.paymentAccountName || 'SUPER E LUXURY HOTEL AND SUITES LTD - RECEPTION',
      receiptImage: receiptUrl,
      receiptFileName: receiptFileName,
      status: body.status || (body.isWalkIn ? 'confirmed' : 'awaiting_confirmation'),
      paymentStatus: body.paymentStatus || (balDue <= 0 ? 'paid' : amtPaid > 0 ? 'partially_paid' : 'not_paid'),
      createdAt: new Date().toISOString(),
    };

    // 1. Save to local JSON backup immediately (< 5ms response guarantee)
    const bookings = ensureDataFile();
    bookings.unshift(newBooking);
    saveBookings(bookings);

    // 2. Sync to Supabase with strict timeout so user isn't kept waiting
    const supabase = getSupabase();
    if (supabase) {
      const syncToSupabase = async () => {
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
          if (!roomId && body.roomSlug) {
            const { data: suffixedMatched } = await supabase
              .from('rooms')
              .select('id')
              .eq('slug', `${body.roomSlug}-room`)
              .limit(1);
            if (suffixedMatched && suffixedMatched.length > 0) {
              roomId = suffixedMatched[0].id;
            }
          }
          if (!roomId) {
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
            const fullPayload: any = {
              reference_number: ref,
              guest_id: guestId,
              room_id: roomId,
              check_in_date: body.checkIn,
              check_out_date: body.checkOut,
              num_guests: Number(body.numGuests) || 1,
              total_amount: totalAmt,
              booking_status: newBooking.status,
              payment_status: newBooking.paymentStatus,
              special_requests: body.specialRequests || null,
              admin_notes: body.adminNotes || null,
              assigned_room_number: body.roomNumber || null,
              receipt_url: receiptUrl,
              receipt_file_name: receiptFileName,
              payment_method: newBooking.paymentMethod,
              payment_reference: body.paymentReference || null,
              amount_paid: amtPaid,
              balance_due: balDue,
              is_walk_in: Boolean(body.isWalkIn),
              cashier_name: body.cashierName || null,
            };

            const { error: insErr } = await supabase.from('bookings').insert(fullPayload);
            if (insErr) {
              console.warn('Full booking insert warning (retrying basic payload):', insErr.message);
              // Fallback for pre-migration schema
              await supabase.from('bookings').insert({
                reference_number: ref,
                guest_id: guestId,
                room_id: roomId,
                check_in_date: body.checkIn,
                check_out_date: body.checkOut,
                num_guests: Number(body.numGuests) || 1,
                total_amount: totalAmt,
                booking_status: newBooking.status,
                payment_status: newBooking.paymentStatus,
                special_requests: body.specialRequests || null,
              });
            }
          }
        } catch (sbErr) {
          console.warn('Supabase booking sync warning:', sbErr);
        }
      };

      const syncTimeout = new Promise((resolve) => setTimeout(resolve, 3500));
      await Promise.race([syncToSupabase(), syncTimeout]);
    }

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
    const { id, ref, status, paymentStatus, adminNotes, receiptUrl } = body;

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
        if (receiptUrl !== undefined) updatePayload.receipt_url = receiptUrl;

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
      if (receiptUrl !== undefined) bookings[index].receiptImage = receiptUrl;
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
