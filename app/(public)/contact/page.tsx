import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { ContactForm } from '@/shared/components/public/ContactForm';
import { HeroHeadline, HeroStage } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';

export const metadata = {
  title: 'Contact Us | Digo Academy',
  description:
    'Have questions about our live cohorts, curriculum, or career mentorship? Get in touch with our team or schedule a free counseling session.',
};

const CHANNELS = [
  {
    icon: MessageCircle,
    title: 'Chat on WhatsApp',
    subtitle: 'Instant responses during working hours',
    href: 'https://wa.me/9779801820900',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: Phone,
    title: 'Book a Guidance Call',
    subtitle: '15-min call with an academic advisor',
    href: '#form',
    color: 'bg-brand-blue/10 text-brand-blue',
  },
  {
    icon: MapPin,
    title: 'Visit Our Campus',
    subtitle: 'Drop by for an in-person walkthrough',
    href: '#location',
    color: 'bg-brand-coral/10 text-brand-coral',
  },
];

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

        {/* Quick Action Channels */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <a
                key={ch.title}
                href={ch.href}
                className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${ch.color}`}>
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{ch.subtitle}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Main Two-Column Layout */}
        <div id="form" className="grid gap-8 lg:grid-cols-12">
          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-lg sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground mb-6">
                Fill out the form below and an advisor will reach out to you within 24 hours.
              </p>
              <ContactForm />
            </div>
          </div>

          {/* Details & Info Side */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 space-y-6">
              <h3 className="font-heading text-xl font-bold text-foreground">Direct Contact</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                    <a href="mailto:support@digoacademy.com" className="font-medium text-foreground hover:text-primary transition-colors">
                      support@digoacademy.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Admissions Hotline</p>
                    <a href="tel:+9779801820900" className="font-medium text-foreground hover:text-primary transition-colors">
                      +977 980-182-0900
                    </a>
                  </div>
                </div>

                <div id="location" className="flex items-start gap-3">
                  <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Learning Hub &amp; Labs</p>
                    <p className="font-medium text-foreground">
                      Digo Solutions Pvt.Ltd, Kathmandu, Nepal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Support Hours</p>
                    <p className="font-medium text-foreground">
                      Mon - Sat: 9:00 AM - 7:00 PM NPT
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
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
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
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
