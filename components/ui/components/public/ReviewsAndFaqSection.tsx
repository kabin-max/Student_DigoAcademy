'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Reveal } from '@/shared/components/public/Reveal';

const FAQS = [
  {
    q: 'What is Digo Academy and how does it work?',
    a: 'Digo Academy is a digital engineering academy focused on live cohorts, production-grade project development, and rigorous 1-on-1 code reviews. You build real applications rather than passive tutorial watching.',
  },
  {
    q: 'Are the sessions live or recorded?',
    a: 'All major core concepts, sprints, and architecture deep-dives are conducted live with interactive Q&A. Every live session is recorded and uploaded to your student portal with lifetime access.',
  },
  {
    q: 'What kind of support and mentor feedback will I get?',
    a: 'You receive line-by-line code reviews on your Git repositories from experienced engineers, access to daily voice office hours, and dedicated private Discord channels for fast blocker resolution.',
  },
  {
    q: 'How do enrollment and payments work?',
    a: 'Browse our catalog and submit a free enrollment request in seconds. There is no online payment gateway — our team arranges payment and activates your access manually.',
  },
  {
    q: 'Do you offer certificate and placement assistance?',
    a: 'Yes. Upon passing all module evaluations and capstone defense, you receive a verified shareable certificate and gain access to our hiring partner network and alumni demo days.',
  },
];

export interface ReviewsAndFaqSectionProps {
  showFaq?: boolean;
}

export function ReviewsAndFaqSection({ showFaq = true }: ReviewsAndFaqSectionProps = {}) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you! Our advisory team will get in touch shortly.');
    setEmail('');
  };

  return (
    <section className="relative bg-background py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* FAQ & Quick Consultation Section */}
        {showFaq && (
          <div id="faq" className="scroll-mt-24 rounded-3xl border border-border/60 bg-slate-50/80 p-8 sm:p-12 shadow-sm">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-start">
              {/* Left: Got a Question? + Email Input */}
              <Reveal>
                <div>
                  <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-4xl text-foreground">
                    Got A Question<br />For Digo Academy?
                  </h2>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
                    If there are questions you want to ask, talk to our academic counsellors and we will guide you to the right track.
                  </p>

                  <form onSubmit={handleSubscribe} className="mt-8 flex items-center gap-2 max-w-md">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 rounded-full border border-border/70 bg-background px-5 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue/50 transition-shadow"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-brand-blue px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:scale-105 hover:bg-brand-blue/90 active:scale-95"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </Reveal>

              {/* Right: Clean Interactive FAQ rows */}
              <Reveal delay={150}>
                <div className="divide-y divide-border/60">
                  {FAQS.map((faq, idx) => (
                    <details
                      key={idx}
                      className="group py-5 first:pt-0 last:pb-0 cursor-pointer"
                    >
                      <summary className="flex items-center justify-between font-heading font-bold text-foreground text-sm sm:text-base list-none [&::-webkit-details-marker]:hidden">
                        <span>{faq.q}</span>
                        <ArrowRight className="size-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-200 group-open:rotate-90 group-open:text-brand-blue" />
                      </summary>
                      <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pr-6">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Backward compatibility alias
export const DemoReviewsAndFaq = ReviewsAndFaqSection;
