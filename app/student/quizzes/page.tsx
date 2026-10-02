import { getStudentQuizzes } from '@/features/quizzes/server/data';
import { requireRole } from '@/lib/auth/session';
import { ROLES } from '@/shared/constants/roles';
import { StudentQuizList } from '@/features/quizzes/components/StudentQuizList';

export default async function StudentQuizzesPage() {
  const session = await requireRole(ROLES.STUDENT);
  const quizzes = await getStudentQuizzes(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Quizzes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and take quizzes from all your enrolled courses.
          </p>
        </div>
      </div>

      <StudentQuizList quizzes={quizzes} />
    </div>
  );
}
