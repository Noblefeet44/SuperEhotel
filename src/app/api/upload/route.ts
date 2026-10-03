import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminRequest } from '@/lib/auth';

// Allowed file types for uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.pdf'];

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await verifyAdminRequest(request);
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: `File type "${fileExtension}" is not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `MIME type "${file.type}" is not allowed.` },
        { status: 400 }
      );
    }

    // Check size limit (max 10MB)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Create base64 fallback so upload succeeds 100% of the time on serverless/read-only hosts
    const mime = file.type || 'image/jpeg';
    const base64Url = `data:${mime};base64,${buffer.toString('base64')}`;
    let publicUrl = base64Url;

    const timestamp = Date.now();
    const safeName = path.basename(file.name).replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${category}_${timestamp}_${safeName}`;

    // Try saving locally to public/uploads if filesystem is writable
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${fileName}`;
    } catch (fsErr) {
      console.warn('Local uploads disk is read-only (using data URI fallback):', fsErr);
    }

    // Try uploading to Supabase Storage with 1500ms timeout if credentials are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const bucketName = category === 'rooms' ? 'rooms' : category === 'receipts' ? 'receipts' : 'media';

        const uploadPromise = supabase.storage
          .from(bucketName)
          .upload(fileName, buffer, {
            contentType: mime,
            upsert: true,
          });

        const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error('Supabase storage timeout') }), 1500)
        );

        const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

        if (!error && data?.path) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);

          if (publicUrlData?.publicUrl) {
            publicUrl = publicUrlData.publicUrl;
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage notice (falling back):', storageErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: `${(buffer.length / 1024).toFixed(1)} KB`,
      category,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
