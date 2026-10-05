'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';

export function PublicEnrollmentSidebar({
  courseId,
  price,
}: {
  courseId: string;
  price: string;
  instructorName: string;
}) {
  const [mode, setMode] = useState<'GROUP_LIVE' | 'SELF_PACED'>('GROUP_LIVE');

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm flex flex-col gap-6">
      {/* Price */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Course price</p>
        <h2 className="font-heading text-3xl font-extrabold text-foreground">{price}</h2>
      </div>

      {/* Mode picker */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">How would you like to learn?</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('GROUP_LIVE')}
            className={`rounded-xl border p-3 text-left transition-all ${
              mode === 'GROUP_LIVE'
                ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                : 'border-border/60 hover:bg-muted/50'
            }`}
          >
            <span className="block text-xs font-bold text-foreground">Group (live)</span>
            <span className="mt-1 block text-[10px] text-muted-foreground leading-snug">
              Scheduled live sessions with a cohort.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode('SELF_PACED')}
            className={`rounded-xl border p-3 text-left transition-all ${
              mode === 'SELF_PACED'
                ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                : 'border-border/60 hover:bg-muted/50'
            }`}
          >
            <span className="block text-xs font-bold text-foreground">Self-paced</span>
            <span className="mt-1 block text-[10px] text-muted-foreground leading-snug">
              Recorded lessons you work through anytime.
            </span>
          </button>
        </div>
      </div>

      {/* CTA */}
      <Button
        render={<Link href={`/checkout/${courseId}?mode=${mode}`} />}
        className="w-full h-11 text-xs font-bold uppercase tracking-wider"
      >
        Enroll Now
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        You&apos;ll be asked to log in or create an account before completing your enrollment.
      </p>
    </div>
  );
}
