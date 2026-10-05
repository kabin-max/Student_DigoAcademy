'use server';

import { db } from '@/lib/db';
import { isS3Configured, presignDownload } from '@/lib/storage';

/**
 * Fetches the global singleton settings row and resolves the QR code S3 key
 * to a short-lived signed URL so the checkout page can display it as an image.
 */
export async function getGlobalSettings() {
  const settings = await db.globalSettings.findUnique({
    where: { id: 'singleton' },
  });
  if (!settings) return null;

  // Resolve the S3 key to a signed URL; fall back to null if storage isn't configured.
  let paymentQrUrl: string | null = settings.paymentQrUrl ?? null;
  if (paymentQrUrl && isS3Configured) {
    try {
      paymentQrUrl = await presignDownload(paymentQrUrl);
    } catch {
      paymentQrUrl = null;
    }
  }

  return {
    ...settings,
    paymentQrUrl,
  };
}
