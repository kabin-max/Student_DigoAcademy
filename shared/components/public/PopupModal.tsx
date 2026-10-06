'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

interface PopupModalProps {
  title: string;
  subtitle: string;
  buttonText: string;
  linkUrl: string;
}

export function PopupModal({ title, subtitle, buttonText, linkUrl }: PopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after a short delay
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('hasSeenPromoModal');
      if (!hasSeen) {
        setIsOpen(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenPromoModal', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue via-brand-blue/90 to-violet-600 p-1 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-white/80 transition-colors hover:bg-black/40 hover:text-white"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="relative flex flex-col items-center justify-center rounded-[22px] bg-background p-8 text-center sm:p-10">
          <div className="absolute -top-12 -right-12 size-32 rounded-full bg-brand-blue/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 size-32 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue/20 to-violet-500/20 text-brand-blue ring-1 ring-brand-blue/30">
            <Sparkles className="size-8" />
          </div>

          <h3 className="mb-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h3>
          <p className="mb-8 text-sm text-muted-foreground sm:text-base leading-relaxed">
            {subtitle}
          </p>

          <Button
            size="lg"
            className="w-full rounded-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold shadow-lg transition-transform hover:scale-105"
            nativeButton={false}
            onClick={close}
            render={
              <Link href={linkUrl}>
                {buttonText} <ArrowRight className="ml-2 size-5" />
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
}
