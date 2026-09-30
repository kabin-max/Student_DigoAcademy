import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Digo Academy',
  description: 'How Digo Academy collects, uses, and protects student and visitor personal data.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mb-8">
        <ArrowLeft className="size-3.5" /> Back to Home
      </Link>

      <div className="border-b border-border/60 pb-6 mb-8">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-blue">
          Data Protection
        </span>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
          Privacy Policy
        </h1>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span>Last Updated: September 2026</span>
          <span>•</span>
          <span>GDPR &amp; Standard Aligned</span>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We collect personal information necessary to deliver educational services, including your name, email address, phone/WhatsApp number, enrollment records, assignment submissions, and progress within course modules.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">2. How We Use Your Data</h2>
          <p>
            Your information is utilized solely to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provision student accounts and authenticate learning sessions.</li>
            <li>Deliver live class invitations, assignment feedback, and mentor evaluations.</li>
            <li>Issue cryptographically verified completion certificates.</li>
            <li>Provide transaction receipts and academic support communications.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">3. Third-Party Infrastructure</h2>
          <p>
            We partner with enterprise-grade cloud providers for core functions (e.g. AWS for encrypted media streaming, PostgreSQL database hosting, and Google Meet for live classrooms). We never sell or license student data to third-party advertisers.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-foreground">4. Student Rights &amp; Data Deletion</h2>
          <p>
            You have the right to request an export of your personal information, request corrections, or request account closure and data deletion by writing to our privacy officer at{' '}
            <a href="mailto:privacy@digoacademy.com" className="text-primary underline">
              privacy@digoacademy.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
