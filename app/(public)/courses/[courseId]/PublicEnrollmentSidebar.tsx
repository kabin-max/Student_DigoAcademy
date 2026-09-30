'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle2, Download, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

export function PublicEnrollmentSidebar({
  courseId,
  price,
  instructorName,
}: {
  courseId: string;
  price: string;
  instructorName: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<'group' | 'self'>('group');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Enrollment request received!');
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-4">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="text-center font-heading text-lg font-bold">Request Received!</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Our team will contact you shortly to complete your enrollment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm flex flex-col">
      <h2 className="font-heading text-2xl font-bold text-foreground">{price}</h2>
      
      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        Interested? Request enrollment and our team will reach out to help you get started — no upfront payment.
      </p>

      <div className="mt-6 space-y-4 flex-1">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">How would you like to learn?</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('group')}
              className={`rounded-xl border p-3 text-left transition-all ${
                mode === 'group' ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border/60 hover:bg-muted/50'
              }`}
            >
              <span className="block text-xs font-bold text-foreground">Group (live)</span>
              <span className="mt-1 block text-[10px] text-muted-foreground leading-snug">
                Scheduled live sessions with an instructor and a cohort.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMode('self')}
              className={`rounded-xl border p-3 text-left transition-all ${
                mode === 'self' ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border/60 hover:bg-muted/50'
              }`}
            >
              <span className="block text-xs font-bold text-foreground">Self-paced</span>
              <span className="mt-1 block text-[10px] text-muted-foreground leading-snug">
                Recorded lessons and materials you work through anytime.
              </span>
            </button>
          </div>
        </div>

        <Button asChild className="w-full h-10 text-xs font-bold uppercase tracking-wider mt-4">
          <Link href={`/checkout/${courseId}?mode=${mode}`}>Enroll Now</Link>
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-border/60">
        <h4 className="text-xs font-bold text-foreground mb-4">This course includes</h4>
        <ul className="space-y-3 text-xs text-muted-foreground">
          <li className="flex items-center gap-2.5">
            <BookOpen className="size-4 text-primary" /> 0 video lessons
          </li>
          <li className="flex items-center gap-2.5">
            <Download className="size-4 text-primary" /> 36 downloadable resources
          </li>
          <li className="flex items-center gap-2.5">
            <Clock className="size-4 text-primary" /> Full lifetime access
          </li>
          <li className="flex items-center gap-2.5">
            <Award className="size-4 text-primary" /> Certificate of completion
          </li>
        </ul>
      </div>

      <p className="mt-6 text-[10px] text-muted-foreground">
        Taught by <span className="font-bold text-foreground">{instructorName}</span>
      </p>
    </div>
  );
}
