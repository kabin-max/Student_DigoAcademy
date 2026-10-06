'use client';

import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface BatchItem {
  id: string;
  name: string;
  startText: string | null;
  startDate: Date | null;
  course: {
    id: string;
    title: string;
    priceCents: number;
    originalPriceCents: number | null;
    currency: string;
  };
}

interface UpcomingBatchesSectionProps {
  batches: BatchItem[];
}

export function UpcomingBatchesSection({ batches }: UpcomingBatchesSectionProps) {
  if (!batches || batches.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50/50">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">New Batch Starting Soon</h2>
          <p className="text-slate-600 italic">Join the live class on Google Meet.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {batches.map((batch) => {
            const currentPrice = batch.course.priceCents / 100;
            const originalPrice = batch.course.originalPriceCents ? batch.course.originalPriceCents / 100 : null;
            const discountPercent =
              originalPrice && originalPrice > currentPrice
                ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                : 0;

            const displayDate = batch.startDate
              ? new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(batch.startDate))
              : 'TBA';
              
            const badgeText = batch.startText || (batch.startDate ? `Starts ${displayDate}` : 'Upcoming');
            const startsText = batch.startText || displayDate;

            return (
              <Link
                href={`/courses/${batch.course.id}`}
                key={batch.id}
                className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col cursor-pointer"
              >
                {/* Floating Badge */}
                <div className="absolute -top-3 right-4 bg-orange-50 text-black text-xs font-semibold px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  {badgeText}
                </div>

                <h3 className="font-semibold text-[1.05rem] text-slate-900 mt-3 mb-5 line-clamp-2 leading-snug">
                  {batch.course.title}
                </h3>

                <div className="flex items-center text-sm text-slate-600 mb-5 font-medium">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                  <span>
                    Batch starts: <span className="text-slate-900 font-semibold">{startsText}</span>
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-slate-100 mt-auto">
                  <span className="font-bold text-lg text-slate-900">
                    Rs. {currentPrice.toLocaleString('en-IN')}
                  </span>
                  {originalPrice && originalPrice > currentPrice && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        Rs. {originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded ml-1">
                        {discountPercent}% off
                      </span>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
