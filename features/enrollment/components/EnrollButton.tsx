'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ENROLLMENT_MODES, ENROLLMENT_MODE_LABELS } from '@/features/enrollment/schemas';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

const MODE_HINTS: Record<(typeof ENROLLMENT_MODES)[number], string> = {
  GROUP_LIVE: 'Scheduled live sessions with an instructor and a cohort.',
  SELF_PACED: 'Recorded lessons and materials you work through anytime.',
};

export function EnrollButton({ courseId }: { courseId: string }) {
  const [mode, setMode] = useState<(typeof ENROLLMENT_MODES)[number]>('GROUP_LIVE');

  return (
    <div className="space-y-4">
      {/* Mode picker */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">How would you like to learn?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ENROLLMENT_MODES.map((m) => {
            const selected = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={selected}
                className={cn(
                  'rounded-xl border p-3 text-left transition-colors',
                  selected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-input hover:bg-muted/50'
                )}
              >
                <span className="block text-sm font-medium">{ENROLLMENT_MODE_LABELS[m]}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{MODE_HINTS[m]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="w-full"
        render={<Link href={`/student/checkout/${courseId}?mode=${mode}`} />}
      >
        Enroll Now
      </Button>
    </div>
  );
}
