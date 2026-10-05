import Link from 'next/link';
import { Flame, Sparkles, ArrowRight, Tag, Clock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { formatMoney } from '@/components/ui/utils/money';

interface PromoCourse {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  priceCents: number;
  originalPriceCents?: number | null;
  currency: string;
  thumbnailKey?: string | null;
}

interface OfferBannerProps {
  courses: PromoCourse[];
}

export function OfferBanner({ courses }: OfferBannerProps) {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 py-10 text-white shadow-xl">
      {/* Decorative background glow & shapes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {courses.map((course) => {
          const priceFormatted = formatMoney(course.priceCents, course.currency);
          const originalFormatted = course.originalPriceCents
            ? formatMoney(course.originalPriceCents, course.currency)
            : null;
          
          const priceNpr = course.priceCents / 100;
          const originalNpr = course.originalPriceCents ? course.originalPriceCents / 100 : null;
          const discountPercent =
            originalNpr && originalNpr > priceNpr
              ? Math.round(((originalNpr - priceNpr) / originalNpr) * 100)
              : null;

          return (
            <div
              key={course.id}
              className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 shadow-2xl"
            >
              {/* Left Content */}
              <div className="flex-1 space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-200 border border-white/30 backdrop-blur-sm">
                  <Flame className="size-4 text-yellow-300 animate-pulse" />
                  <span>Exclusive Offer — Limited Seats</span>
                  <Sparkles className="size-3.5 text-yellow-300" />
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                  {course.title}
                </h2>

                {course.subtitle && (
                  <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
                    {course.subtitle}
                  </p>
                )}

                <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-3">
                      <span className="font-extrabold text-3xl sm:text-4xl text-yellow-300">
                        {priceFormatted}
                      </span>
                      {originalFormatted && (
                        <span className="text-lg sm:text-xl text-white/60 line-through font-semibold">
                          {originalFormatted}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-white/80 font-medium">
                      Excl. VAT • 13% VAT added at checkout
                    </span>
                  </div>

                  {discountPercent && (
                    <div className="flex items-center gap-1 rounded-xl bg-yellow-400 text-gray-900 font-extrabold px-3.5 py-2 text-sm shadow-md animate-bounce">
                      <Tag className="size-4" />
                      <span>{discountPercent}% OFF</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right CTA Box */}
              <div className="w-full lg:w-auto flex flex-col items-center sm:items-stretch lg:items-center gap-4 bg-black/20 rounded-2xl p-6 border border-white/10 text-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-yellow-200">
                  <Clock className="size-4" />
                  <span>Special Discount Active Now!</span>
                </div>

                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-white text-red-600 hover:bg-yellow-100 font-extrabold text-base px-8 py-6 shadow-xl transition-all hover:scale-105"
                  nativeButton={false}
                  render={
                    <Link href={`/checkout/${course.id}`}>
                      Claim Offer & Enroll Now <ArrowRight className="ml-2 size-5" />
                    </Link>
                  }
                />

                <span className="text-[11px] text-white/70">
                  ⚡ Instant Access after Admin Verification
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
