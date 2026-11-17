import 'server-only';

import { env, isRecaptchaEnabled } from '@/lib/env';

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

interface RecaptchaVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export interface RecaptchaVerifyResult {
  success: boolean;
  error?: string;
}

/**
 * Verifies a Google reCAPTCHA v2 response token on the server.
 *
 * When reCAPTCHA is not configured:
 * - In production, fails closed so missing credentials cannot silently bypass bot protection.
 * - In development/test, allows requests through with a warning so local dev stays unblocked.
 */
export async function verifyRecaptchaToken(
  token: string | null | undefined,
  remoteIp?: string | null
): Promise<RecaptchaVerifyResult> {
  if (!isRecaptchaEnabled) {
    if (env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'Security verification is not configured. Please contact support.',
      };
    }
    return { success: true };
  }

  const trimmedToken = token?.trim();
  if (!trimmedToken) {
    return {
      success: false,
      error: 'Please complete the reCAPTCHA verification.',
    };
  }

  try {
    const body = new URLSearchParams({
      secret: env.RECAPTCHA_SECRET_KEY!,
      response: trimmedToken,
    });
    if (remoteIp) {
      body.set('remoteip', remoteIp);
    }

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[reCAPTCHA] siteverify HTTP error:', response.status);
      return {
        success: false,
        error: 'Unable to verify reCAPTCHA. Please try again.',
      };
    }

    const data = (await response.json()) as RecaptchaVerifyResponse;
    if (!data.success) {
      console.warn('[reCAPTCHA] verification failed:', data['error-codes']);
      return {
        success: false,
        error: 'reCAPTCHA verification failed. Please try again.',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('[reCAPTCHA] verification request failed:', err);
    return {
      success: false,
      error: 'Unable to verify reCAPTCHA. Please try again.',
    };
  }
}
