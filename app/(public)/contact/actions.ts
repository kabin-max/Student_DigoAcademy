'use server';

import { z } from 'zod';
import { sendEmail } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  course: z.string().min(1, 'Please select a course or of interest'),
  message: z.string().min(10, 'Please enter a message (at least 10 characters)'),
  _gotcha: z.string().max(0, 'Spam detected').optional(),
});

export async function sendContactMessage(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    course: formData.get('course'),
    message: formData.get('message'),
    _gotcha: formData.get('_gotcha'),
  };

  const parsed = contactSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  // Silent discard spam
  if (data._gotcha) {
    return { success: true };
  }

  try {
    // 1. Send email to admin
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

    // 2. Send auto-responder to user
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

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact emails:', error);
    return { success: false, error: 'Failed to send message. Please try again later.' };
  }
}
