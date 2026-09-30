import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

import { getStudentQuizzes } from '@/features/quizzes/server/data';
import { requireRole } from '@/lib/auth/session';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ROLES } from '@/shared/constants/roles';

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

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <HelpCircle className="size-10 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No quizzes available</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Once you enroll in courses that have quizzes, they will appear here.
            </p>
            <Button nativeButton={false} render={<Link href="/student/courses">Browse courses</Link>} />
          </CardContent>
        </Card>
      ) : (
        <ul className="divide-y rounded-2xl border border-border/70 bg-card shadow-sm">
          {quizzes.map((q) => (
            <li key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate font-medium">{q.courseTitle}</span>
                  <span>·</span>
                  <span className="truncate">{q.sectionTitle}</span>
                </div>
                <h3 className="truncate font-medium text-base leading-snug">{q.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span>Instructor: <span className="font-medium text-foreground/80">{q.instructorName}</span></span>
                  <span>Questions: <span className="font-medium text-foreground/80">{q.questionCount}</span></span>
                  <span>Passing Score: <span className="font-medium text-foreground/80">{q.passingScore}%</span></span>
                </div>
              </div>
              
              <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                {q.lastAttemptScore != null ? (
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="text-muted-foreground text-xs mr-1">Last Score:</span>
                    {q.passed ? (
                      <CheckCircle2 className="size-4 text-emerald-500" />
                    ) : (
                      <XCircle className="size-4 text-rose-500" />
                    )}
                    <span className={q.passed ? "text-emerald-600" : "text-rose-600"}>
                      {q.lastAttemptScore}%
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground py-1">Not attempted yet</span>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  nativeButton={false}
                  render={<Link href={`/student/courses/${q.courseId}`}>Take quiz</Link>}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
