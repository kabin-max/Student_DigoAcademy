import { Mail, Phone, MessageCircle } from 'lucide-react';

import { ContactForm } from '@/shared/components/public/ContactForm';
import { HeroHeadline, HeroStage } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';

export const metadata = {
  title: 'Contact Us | Digo Academy',
  description:
    'Have questions about our live cohorts, curriculum, or career mentorship? Get in touch with our team or schedule a free counseling session.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-linear-to-b from-brand-blue/5 via-background to-background pt-12 pb-12">
        <div className="animate-blob pointer-events-none absolute -left-32 -top-32 z-0 size-80 rounded-full bg-brand-blue/20 blur-3xl" />
        
        <HeroStage className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
          <HeroHeadline
            className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
            segments={[
              { text: "Let's talk about" },
              { text: 'your', accent: true },
              { text: 'future' },
            ]}
          />
          
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Have questions about prerequisites, cohort timelines, or career transitions? Reach out and we&apos;ll guide you to the right path.
            </p>
          </Reveal>
        </HeroStage>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">


        {/* Main Two-Column Layout */}
        <div id="form" className="grid gap-8 lg:grid-cols-12">
          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-lg sm:p-8 h-full">
              <h2 className="font-heading text-2xl font-bold text-foreground">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground mb-6">
                Fill out the form below and an advisor will reach out to you within 24 hours.
              </p>
              <ContactForm />
            </div>
          </div>

          {/* Details & Info Side */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-lg sm:p-8 h-full flex flex-col">
              <h2 className="font-heading text-2xl font-bold text-foreground">Direct Contact</h2>
              <p className="mt-1 text-sm text-muted-foreground mb-6">
                Reach out to us directly via email or phone.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <Mail className="size-5" />
                  </span>
                  <a href="mailto:support@digoacademy.com" className="font-medium text-sm text-foreground hover:text-primary transition-colors">
                    support@digoacademy.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <Phone className="size-5" />
                  </span>
                  <a href="tel:+9779801820900" className="font-medium text-sm text-foreground hover:text-primary transition-colors">
                    +977 980-182-0900
                  </a>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm mt-8 flex-1 min-h-[250px]">
                <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                  <a
                    href="https://maps.google.com/maps?q=Digo%20Solutions%20Pvt.Ltd,%20Kathmandu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-md transition-colors hover:bg-slate-50"
                  >
                    Open in Maps
                    <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                  <a 
                    href="https://wa.me/?text=Check%20out%20Digo%20Academy%27s%20location:%20https://maps.google.com/maps?q=Digo%20Solutions%20Pvt.Ltd,%20Kathmandu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded bg-white px-3 py-2 text-sm font-semibold text-emerald-600 shadow-md transition-colors hover:bg-slate-50"
                  >
                    <MessageCircle className="size-3.5" />
                    Share
                  </a>
                </div>
                <iframe
                  title="Digo Solutions Location"
                  className="w-full h-full border-0 absolute inset-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Digo%20Solutions%20Pvt.Ltd,%20Kathmandu+(Digo%20Academy)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
