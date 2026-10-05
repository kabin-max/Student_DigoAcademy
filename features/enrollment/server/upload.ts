'use server';

import { randomUUID } from 'node:crypto';
import { isS3Configured } from '@/lib/env';
import { presignUpload } from '@/lib/storage';

export interface PresignResult {
  ok: boolean;
  error?: string;
  url?: string;
  key?: string;
}

const extFromName = (name: string) => {
  const match = /\.([a-z0-9]{1,8})$/i.exec(name);
  return match ? match[1].toLowerCase() : 'bin';
};

/**
 * Presign a payment receipt upload. This allows unauthenticated users on the 
 * checkout page to upload their payment screenshots.
 */
export async function presignReceiptUpload(input: {
  filename: string;
  contentType: string;
  size: number;
}): Promise<PresignResult> {
  if (!isS3Configured) return { ok: false, error: 'File storage is not configured.' };

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedTypes.includes(input.contentType)) {
    return { ok: false, error: `That file type isn't allowed for receipts.` };
  }

  // Max 5MB
  if (input.size > 5_000_000) {
    return { ok: false, error: 'That file is too large (max 5MB).' };
  }

  const ext = extFromName(input.filename);
  const key = `receipts/${randomUUID()}.${ext}`;

  try {
    const url = await presignUpload(key, input.contentType, input.size);
    return { ok: true, url, key };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Failed to generate upload URL.' };
  }
}
