import 'server-only';

import { db } from '@/lib/db';

export async function getInstructorCourses(instructorId: string) {
  return db.course.findMany({
    where: { instructorId },
    orderBy: { updatedAt: 'desc' },
    include: {
      category: { select: { name: true } },
      _count: { select: { sections: true, enrollments: true } },
    },
  });
}

/** Full course for the builder — scoped to its owner (returns null otherwise). */
export async function getCourseForInstructor(courseId: string, instructorId: string) {
  return db.course.findFirst({
    where: { id: courseId, instructorId },
    include: {
      category: true,
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              quiz: {
                include: { questions: { orderBy: { order: 'asc' }, include: { choices: true } } },
              },
            },
          },
        },
      },
    },
  });
}

/** Courses needing admin attention: submitted for review, or flagged for re-review. */
export async function getAdminReviewQueue() {
  return db.course.findMany({
    where: { OR: [{ status: 'SUBMITTED' }, { reReviewFlagged: true }] },
    orderBy: { updatedAt: 'asc' },
    include: {
      category: { select: { name: true } },
      instructor: { select: { name: true, email: true } },
    },
  });
}

/** Every course, for the admin management list. */
export async function getAllCoursesForAdmin() {
  return db.course.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      category: { select: { name: true } },
      instructor: { select: { name: true, email: true } },
      _count: { select: { sections: true, enrollments: true } },
    },
  });
}

export async function getCourseForAdmin(courseId: string) {
  return db.course.findUnique({
    where: { id: courseId },
    include: {
      category: true,
      instructor: { select: { name: true, email: true } },
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: {
              quiz: {
                include: { questions: { orderBy: { order: 'asc' }, include: { choices: true } } },
              },
            },
          },
        },
      },
    },
  });
}

export async function getCourseForCheckout(courseId: string) {
  try {
    return await db.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        subtitle: true,
        priceCents: true,
        originalPriceCents: true,
        currency: true,
        status: true,
      },
    });
  } catch {
    return db.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        subtitle: true,
        priceCents: true,
        currency: true,
        status: true,
      },
    });
  }
}

export async function getPromoCourses() {
  try {
    return await db.course.findMany({
      where: { isPromo: true, status: 'PUBLISHED' } as any,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        priceCents: true,
        originalPriceCents: true,
        currency: true,
        thumbnailKey: true,
      },
    });
  } catch (err) {
    console.warn('getPromoCourses query pending prisma generate:', err);
    return [];
  }
}

export async function getUpcomingBatches() {
  try {
    return await db.batch.findMany({
      where: {
        OR: [
          { startDate: { gte: new Date() } },
          { startText: { not: null } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: {
        id: true,
        name: true,
        startText: true,
        startDate: true,
        course: {
          select: {
            id: true,
            title: true,
            priceCents: true,
            originalPriceCents: true,
            currency: true,
          }
        }
      },
    });
  } catch (err) {
    console.warn('getUpcomingBatches query pending prisma generate:', err);
    return [];
  }
}
