'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import type { QuizOverview } from '@/features/quizzes/server/data';

export function StudentQuizList({ quizzes }: { quizzes: QuizOverview[] }) {
  if (quizzes.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
        Once you enroll in courses that have quizzes, they will appear here.
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-2xl border border-border/70 bg-card shadow-sm">
      {quizzes.map((quiz) => (
        <li key={quiz.id} className="flex items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-sm leading-snug">{quiz.title}</h3>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">{quiz.questionCount} Questions</Badge>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5">{quiz.passingScore}% Pass</Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="truncate font-medium">{quiz.courseTitle}</span>
              {quiz.sectionTitle && <span>·</span>}
              <span className="truncate">{quiz.sectionTitle}</span>
              {quiz.instructorName && (
                <>
                  <span>·</span>
                  <span className="truncate">By {quiz.instructorName}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex shrink-0 items-center gap-4">
            {quiz.lastAttemptScore != null ? (
              <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium">
                <span className="text-muted-foreground text-xs mr-1">Last Score:</span>
                {quiz.passed ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-rose-500" />
                )}
                <span className={quiz.passed ? "text-emerald-600" : "text-rose-600"}>
                  {quiz.lastAttemptScore}%
                </span>
              </div>
            ) : (
              <span className="hidden sm:inline-flex text-xs text-muted-foreground">Not attempted yet</span>
            )}
            
            <Button
              size="sm"
              variant="default"
              className="rounded-full"
              nativeButton={false}
              render={<Link href={`/student/courses/${quiz.courseId}`}>Take quiz</Link>}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
