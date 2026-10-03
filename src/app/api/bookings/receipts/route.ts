import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  return createClient(url, key);
}

export async function GET() {
  const receiptsList: Array<{
    fileName: string;
    url: string;
    size?: string;
    createdAt?: string;
    bookingRef?: string;
    source: 'supabase_bucket' | 'local_disk';
  }> = [];

  const seenUrls = new Set<string>();

  // 1. Fetch from Supabase Storage 'receipts' bucket
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: files, error } = await supabase.storage.from('receipts').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (!error && Array.isArray(files)) {
        for (const file of files) {
          if (file.name === '.emptyFolderPlaceholder') continue;
          const { data: pUrl } = supabase.storage.from('receipts').getPublicUrl(file.name);
          if (pUrl?.publicUrl) {
            seenUrls.add(pUrl.publicUrl);
            const parts = file.name.split('_');
            const bookingRef = parts.length >= 2 ? parts[1] : undefined;

            receiptsList.push({
              fileName: file.name,
              url: pUrl.publicUrl,
              size: file.metadata?.size ? `${(Number(file.metadata.size) / 1024).toFixed(1)} KB` : undefined,
              createdAt: file.created_at || file.updated_at || undefined,
              bookingRef,
              source: 'supabase_bucket',
            });
          }
        }
      }
    } catch (sbErr) {
      console.warn('Notice querying Supabase receipts bucket:', sbErr);
    }
  }

  // 2. Fetch from local public/uploads/receipts/ folder
  try {
    const receiptsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    if (fs.existsSync(receiptsDir)) {
      const files = fs.readdirSync(receiptsDir);
      for (const f of files) {
        const localUrl = `/uploads/receipts/${f}`;
        if (!seenUrls.has(localUrl)) {
          const stats = fs.statSync(path.join(receiptsDir, f));
          const parts = f.split('_');
          const bookingRef = parts.length >= 2 ? parts[1] : undefined;

          receiptsList.push({
            fileName: f,
            url: localUrl,
            size: `${(stats.size / 1024).toFixed(1)} KB`,
            createdAt: stats.birthtime.toISOString(),
            bookingRef,
            source: 'local_disk',
          });
        }
      }
    }
  } catch {}

  return NextResponse.json({
    success: true,
    totalReceipts: receiptsList.length,
    receipts: receiptsList,
  });
}
