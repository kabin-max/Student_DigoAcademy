import 'server-only';

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { twoFactor, emailOTP } from 'better-auth/plugins';

import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { renderEmail } from '@/lib/email-template';
import { env, isGoogleAuthEnabled } from '@/lib/env';
import { lockoutAfterHook, lockoutBeforeHook } from '@/lib/auth/lockout';

/**
 * Better Auth server instance — the single source of truth for auth.
 *
 * Server-only. The matching Prisma models (User/Session/Account/Verification/
 * TwoFactor) live in prisma/schema.prisma; `role` and `status` are exposed to the
 * session via `user.additionalFields` (input:false so they can't be set by clients
 * — role elevation happens server-side only, e.g. instructor registration).
 */
export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: ['http://localhost:3000', 'https://digo.academy', 'https://main.d1b1rd1shb8iv2.amplifyapp.com'],
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { html, text } = renderEmail({
        heading: 'Reset your password',
        intro: `Hi ${user.name || 'there'},`,
        paragraphs: ['We received a request to reset your Digo Academy password. Click below to choose a new one.'],
        button: { label: 'Reset password', url },
        footerNote: "This link expires soon. If you didn't request it, you can safely ignore this email.",
      });
      await sendEmail({ to: user.email, subject: 'Reset your Digo Academy password', text, html });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  socialProviders: isGoogleAuthEnabled
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID!,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        input: false,
        defaultValue: 'STUDENT',
      },
      status: {
        type: 'string',
        required: false,
        input: false,
        defaultValue: 'ACTIVE',
      },
    },
  },

  // Cooldown/throttling for auth endpoints. Tighter limits on the sensitive routes.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      // Coarse IP flood guard. Per-account lockout (lib/auth/lockout.ts) is the
      // primary defense and trips first at 5 failed passwords, so this sits above
      // it to stay a backstop rather than masking the account lock.
      '/sign-in/email': { window: 60, max: 15 },
      '/request-password-reset': { window: 60, max: 3 },
      '/two-factor/verify-totp': { window: 60, max: 5 },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache to reduce DB round-trips
    },
  },

  // Per-account lockout after repeated failed password logins.
  hooks: {
    before: lockoutBeforeHook,
    after: lockoutAfterHook,
  },

  plugins: [
    twoFactor({ issuer: 'Digo Academy' }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`\n📧 [AUTH] Sending verification OTP for: ${email}, OTP: ${otp}, type: ${type}`);
        if (type === 'email-verification' || !type) {
          const { html, text } = renderEmail({
            heading: 'Your Verification Code',
            intro: `Hi there,`,
            paragraphs: [
              'Welcome to Digo Academy! Please use the following One-Time Password (OTP) to activate your account. This code is valid for 5 minutes.',
            ],
            // We use the new otpCode property for a big, easy-to-copy box
            otpCode: otp,
            footerNote: 'If you did not request this, you can safely ignore this email.',
          });
          await sendEmail({ to: email, subject: `${otp} is your Digo Academy verification code`, text, html });
        }
      },
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
    }),
    nextCookies(), // keep last — sets cookies on Next.js responses
  ],
});

export type Auth = typeof auth;
