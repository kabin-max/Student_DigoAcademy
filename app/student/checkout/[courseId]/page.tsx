import { notFound } from 'next/navigation';
import { getCourseForCheckout } from '@/features/courses/server/data';
import { getGlobalSettings } from '@/features/enrollment/server/settings';
import { requireRole } from '@/lib/auth/session';
import { ROLES } from '@/shared/constants/roles';
import { CheckoutForm } from '@/features/enrollment/components/CheckoutForm';

interface PageProps {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ mode?: string }>;
}

function parseMode(raw?: string): 'GROUP_LIVE' | 'SELF_PACED' {
  if (raw === 'SELF_PACED' || raw === 'self') return 'SELF_PACED';
  return 'GROUP_LIVE';
}

export default async function StudentCheckoutPage({ params, searchParams }: PageProps) {
  // requireRole already redirects to /login if unauthenticated
  const session = await requireRole(ROLES.STUDENT);

  const { courseId } = await params;
  const { mode: modeParam } = await searchParams;
  const mode = parseMode(modeParam);

  const [course, settings] = await Promise.all([
    getCourseForCheckout(courseId),
    getGlobalSettings(),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <CheckoutForm
      course={course}
      settings={settings}
      mode={mode}
      user={session.user ? { name: session.user.name, email: session.user.email } : null}
    />
  );
}
