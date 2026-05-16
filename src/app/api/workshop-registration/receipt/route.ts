import { NextResponse } from 'next/server';

import { createSupabaseServiceRoleClient } from '@/lib/supabase/db';
import { isValidWorkshopReceiptPath } from '@/lib/validation/workshop-registration';

const BUCKET = 'workshop-registrations';
const MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function extFromFile(file: File): string {
  const n = file.name;
  const i = n.lastIndexOf('.');
  if (i === -1) return 'bin';
  return n.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
}

export async function POST(request: Request) {
  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      {
        error: 'Workshop uploads are not configured',
        message: 'Set SUPABASE_SERVICE_ROLE_KEY and apply the workshop receipts migration.',
      },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file');
  const uploadId = String(formData.get('uploadId') ?? '').trim();

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Expected a file field named "file"' },
      { status: 400 },
    );
  }

  if (!/^[0-9a-f-]{36}$/i.test(uploadId)) {
    return NextResponse.json({ error: 'Invalid upload id' }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: 'File must be 10 MB or smaller' },
      { status: 400 },
    );
  }

  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'File type not supported. Use an image, PDF, or Word document.' },
      { status: 400 },
    );
  }

  const ext = extFromFile(file);
  const storagePath = `anonymous/${uploadId}/receipt-${Date.now()}.${ext}`;

  if (!isValidWorkshopReceiptPath(storagePath)) {
    return NextResponse.json({ error: 'Could not build storage path' }, { status: 500 });
  }

  const { error } = await service.storage.from(BUCKET).upload(storagePath, file, {
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    return NextResponse.json(
      { error: 'Upload failed', message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ receiptStoragePath: storagePath });
}
