import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared contact-field validators (used by both the checkout UI and the server)
// ---------------------------------------------------------------------------

/** Letters (any script), spaces, dots, apostrophes and hyphens. */
const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[\s.'-]+[\p{L}\p{M}]+)*\.?$/u;

/** Nepali mobile numbers: 10 digits starting 96/97/98 (NTC, Ncell, Smart). */
const NP_MOBILE_PATTERN = /^9[678]\d{8}$/;

/**
 * Parse a WhatsApp number typed by the user. Numbers without a `+` country code
 * are treated as Nepali. Returns the E.164 form (e.g. `+9779841234567`) or
 * `null` when invalid. Nepali numbers must be mobile, since landlines can't
 * receive WhatsApp.
 */
export function normalizeWhatsAppNumber(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  // Accept "00" international prefix as "+".
  const prepared = value.startsWith('00') ? `+${value.slice(2)}` : value;
  const parsed = parsePhoneNumberFromString(prepared, 'NP');
  if (!parsed || !parsed.isValid()) return null;
  if (parsed.country === 'NP' && !NP_MOBILE_PATTERN.test(parsed.nationalNumber)) return null;
  return parsed.number;
}

export const fullNameSchema = z
  .string()
  .trim()
  .min(1, 'Full name is required')
  .min(3, 'Name must be at least 3 characters')
  .max(100, 'Name is too long')
  .regex(NAME_PATTERN, 'Name can only contain letters, spaces, dots, apostrophes and hyphens')
  .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, 'Enter your full name (first and last name)');

export const contactEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email is required')
  .max(254, 'Email is too long')
  .email('Enter a valid email address');

export const whatsAppNumberSchema = z
  .string()
  .trim()
  .min(1, 'WhatsApp number is required')
  .refine((v) => normalizeWhatsAppNumber(v) !== null, {
    message: 'Enter a valid WhatsApp number (e.g. 98XXXXXXXX or +CountryCode number)',
  })
  .transform((v) => normalizeWhatsAppNumber(v) as string);

/** Enrollment mode — mirrors the Prisma `EnrollmentMode` enum. */
export const ENROLLMENT_MODES = ['GROUP_LIVE', 'SELF_PACED'] as const;
export const enrollmentModeSchema = z.enum(ENROLLMENT_MODES);
export type EnrollmentMode = (typeof ENROLLMENT_MODES)[number];

export const ENROLLMENT_MODE_LABELS: Record<EnrollmentMode, string> = {
  GROUP_LIVE: 'Group (live)',
  SELF_PACED: 'Self-paced',
};

const optionalId = z
  .union([z.string(), z.literal('')])
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null));

/**
 * A student booking a course via the manual pipeline. Captures the desired mode
 * (group/live vs. self-paced) and an optional message; the admin follows up.
 */
export const createInquirySchema = z.object({
  courseId: z.string().min(1, 'Missing course.'),
  mode: enrollmentModeSchema,
  message: z.string().trim().max(1000, 'Keep it under 1000 characters.').optional(),
});
export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

/**
 * A guest (no account yet) booking a course from the public site. Contact details
 * are captured on the inquiry; a student account is created/linked at enrollment.
 */
export const createGuestInquirySchema = z.object({
  courseId: z.string().min(1, 'Missing course.'),
  mode: enrollmentModeSchema,
  name: fullNameSchema,
  email: contactEmailSchema,
  // WhatsApp number — validated & normalised to E.164 (defaults to Nepal).
  phone: whatsAppNumberSchema,
  message: z.string().trim().max(1000, 'Keep it under 1000 characters.').optional(),
  receiptUrl: z.string().optional(),
});
export type CreateGuestInquiryInput = z.infer<typeof createGuestInquirySchema>;

/**
 * Convert an inquiry into an enrollment. GROUP_LIVE enrollments attach to a batch,
 * SELF_PACED to a learning plan — the XOR is enforced server-side against the mode.
 */
export const convertInquirySchema = z.object({
  inquiryId: z.string().min(1),
  batchId: optionalId,
  learningPlanId: optionalId,
});
export type ConvertInquiryInput = z.infer<typeof convertInquirySchema>;

/** Create an enrollment directly (admin bypasses the inquiry pipeline). */
export const createEnrollmentSchema = z.object({
  studentId: z.string().min(1, 'Choose a student.'),
  courseId: z.string().min(1, 'Choose a course.'),
  mode: enrollmentModeSchema,
  batchId: optionalId,
  learningPlanId: optionalId,
});
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;

export const PAYMENT_STATUSES = ['PENDING', 'PARTIAL', 'PAID', 'REFUNDED'] as const;
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  PAID: 'Paid',
  REFUNDED: 'Refunded',
};

/** Record a manual payment against an enrollment (amount captured in major units). */
export const recordPaymentSchema = z.object({
  enrollmentId: z.string().min(1),
  amount: z.coerce.number().nonnegative('Amount must be zero or more.').max(1_000_000),
  currency: z.string().trim().length(3, 'Use a 3-letter code.').toUpperCase().default('USD'),
  status: paymentStatusSchema.default('PAID'),
  method: z.string().trim().max(60).optional(),
  reference: z.string().trim().max(120).optional(),
  note: z.string().trim().max(500).optional(),
});
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
