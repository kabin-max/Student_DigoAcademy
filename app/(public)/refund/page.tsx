import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy | Digo Academy',
  description: 'Our transparent 7-day money-back satisfaction guarantee for cohorts and courses.',
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-8">
        <ArrowLeft className="size-3.5" /> Back to Home
      </Link>

      <div className="border-b border-border/60 pb-6 mb-8">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Student Guarantee
        </span>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
          Refund &amp; Cancellation Policy
        </h1>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span>Last Updated: September 2026</span>
          <span>•</span>
          <span>7-Day No-Questions-Asked Window</span>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">1. 7-Day Satisfaction Guarantee</h2>
          <p>
            We stand completely behind the caliber of our mentorship and curriculum. For all live cohort programs, you can attend the first week of scheduled classes, review the materials, and meet your cohort peers. If you feel the program is not a match for your learning style, you may request a 100% refund within 7 calendar days of your batch start date.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">2. How to Request a Refund</h2>
          <p>
            To initiate a refund, email{' '}
            <a href="mailto:admissions@digoacademy.com" className="text-primary underline">
              admissions@digoacademy.com
            </a>{' '}
            from your registered email address with your enrollment ID and transaction reference. We do not require complex justifications.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">3. Processing Timelines</h2>
          <p>
            Once approved by our administration team, bank transfers and refunds are processed within 3–5 business days directly to the original funding account.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">4. Post 7-Day Window</h2>
          <p>
            After the initial 7-day period has elapsed, tuition fees become non-refundable as cohort seats, mentor assignments, and cloud server capacities are permanently reserved for each student. However, students facing unforeseen emergencies may apply for a one-time cohort deferral to a subsequent batch.
          </p>
        </section>
      </div>
    </div>
  );
}
