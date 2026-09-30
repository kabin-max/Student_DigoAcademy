import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Digo Academy',
  description: 'Terms and conditions governing the use of Digo Academy platform and live learning cohorts.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-8">
        <ArrowLeft className="size-3.5" /> Back to Home
      </Link>

      <div className="border-b border-border/60 pb-6 mb-8">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-blue">
          Legal Agreement
        </span>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
          Terms of Service
        </h1>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span>Last Updated: September 2026</span>
          <span>•</span>
          <span>Version 2.4</span>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing, creating an account, or enrolling in any live cohorts or self-paced courses provided by Digo Academy (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">2. Student Accounts &amp; Conduct</h2>
          <p>
            You must provide accurate, current, and complete information during registration. You are solely responsible for maintaining the confidentiality of your credentials and all activities occurring under your account. We reserve the right to suspend or terminate accounts that breach our student code of conduct or engage in harassment.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">3. Intellectual Property Rights</h2>
          <p>
            All course materials, video streams, code challenges, assignments, and curriculum designs provided on the platform remain the exclusive intellectual property of Digo Academy and our instructors. You are granted a personal, non-exclusive, non-transferable license to access materials for your individual educational usage only.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">4. Code Sharing &amp; Academic Integrity</h2>
          <p>
            Students are encouraged to collaborate and learn together. However, copying solutions verbatim from other students or external sources for graded milestone capstones without attribution constitutes academic dishonesty and may result in forfeiture of certification.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">5. Limitation of Liability</h2>
          <p>
            While our programs are designed to provide industry-grade practical engineering training, Digo Academy does not guarantee immediate employment or specific compensation levels upon completion.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">6. Contact &amp; Queries</h2>
          <p>
            For questions regarding these terms, please contact our legal and administrative team at{' '}
            <a href="mailto:legal@digoacademy.com" className="text-primary underline">
              legal@digoacademy.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
