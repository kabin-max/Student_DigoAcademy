'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number'),
  course: z.string().min(1, 'Please select a course or track of interest'),
  message: z.string().trim().min(10, 'Please enter a message (at least 10 characters)'),
  _gotcha: z.string().max(0, 'Spam detected').optional().nullable(),
});

export async function sendContactMessage(formData: FormData) {
  const rawData = {
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? '',
    course: formData.get('course') ?? '',
    message: formData.get('message') ?? '',
    _gotcha: (formData.get('_gotcha') as string | null) || undefined,
  };

  const parsed = contactSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstErrorMessage =
      Object.values(fieldErrors)[0]?.[0] || 'Please provide valid information in all required fields.';
    return { success: false, error: firstErrorMessage, errors: fieldErrors };
  }

  const data = parsed.data;

  // Silent discard spam
  if (data._gotcha && data._gotcha.trim().length > 0) {
    return { success: true };
  }

  let inquirySaved = false;

  // 1. Save inquiry into the database so it appears in the Admin Panel (/admin/inquiries)
  try {
    const normalizedCourse = data.course.toLowerCase();
    const course =
      (await db.course.findFirst({
        where: {
          OR: [
            { id: data.course },
            { id: { contains: normalizedCourse } },
            { category: { slug: normalizedCourse } },
            { title: { contains: data.course.replace(/-/g, ' '), mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true },
      })) ||
      (await db.course.findFirst({
        select: { id: true, title: true },
      }));

    if (course) {
      await db.inquiry.create({
        data: {
          guestName: data.name,
          guestEmail: data.email,
          guestPhone: data.phone || null,
          courseId: course.id,
          mode: 'GROUP_LIVE',
          status: 'NEW',
          message: `[Contact Inquiry - Track: ${data.course}]\n\n${data.message}`,
        },
      });
      inquirySaved = true;
      revalidatePath('/admin/inquiries');
    }
  } catch (dbErr) {
    console.error('Failed to save contact inquiry to database:', dbErr);
  }

  // 2. Send notification emails via AWS SES (or console fallback in dev)
  let emailSent = false;
  try {
    // 2a. Send email to admin
    await sendEmail({
      to: 'info@digoacademy.com',
      subject: `New Inquiry from ${data.name} - Digo Academy`,
      text: `
You have received a new inquiry from the Digo Academy Contact Form.

Name: ${data.name}
Email: ${data.email}
Phone/WhatsApp: ${data.phone}
Interested Track: ${data.course}

Message:
${data.message}
      `,
    });

    // 2b. Send auto-responder to user
    await sendEmail({
      to: data.email,
      subject: `We've received your inquiry - Digo Academy`,
      text: `
Hi ${data.name},

Thank you for reaching out to Digo Academy! We have received your inquiry regarding the ${data.course} track.

An academic counselor will review your goals and get back to you via email or WhatsApp within 24 hours.

Here is a copy of your message:
${data.message}

Best regards,
The Digo Academy Team
      `,
    });
    emailSent = true;
  } catch (emailErr) {
    console.warn('Contact email delivery error (SES restriction or unverified address):', emailErr);
  }

  // If at least one channel succeeded, consider the submission successful
  if (inquirySaved || emailSent) {
    return { success: true };
  }

  return {
    success: false,
    error: 'Failed to send message. Please try again later.',
  };
}
