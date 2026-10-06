'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface PopupModalProps {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  linkUrl: string;
}

export function PopupModal({ imageUrl, title, subtitle, buttonText, linkUrl }: PopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already dismissed promo modal in this session
    const hasSeen = sessionStorage.getItem('hasSeenPromoModal');
    if (hasSeen) return;

    let isMounted = true;
    let timerPassed = false;
    let imageReady = !imageUrl;

    const tryOpen = () => {
      if (timerPassed && imageReady && isMounted) {
        setIsOpen(true);
      }
    };

    const timer = setTimeout(() => {
      timerPassed = true;
      tryOpen();
    }, 1200);

    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        if (!isMounted) return;
        imageReady = true;
        tryOpen();
      };
      img.onerror = () => {
        imageReady = false;
      };
    }

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPromoModal', 'true');
  };

  if (!isOpen) return null;

  if (imageUrl) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-label="Course Offer"
      >
        <div 
          className="relative flex items-center justify-center animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={close}
            className="absolute -top-3.5 -right-3.5 z-20 flex size-9 items-center justify-center rounded-full bg-black/85 text-white backdrop-blur-md transition-all hover:bg-black hover:scale-110 shadow-2xl cursor-pointer border border-white/20"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <Link href={linkUrl} onClick={close} className="relative block overflow-hidden rounded-2xl shadow-2xl group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt="Special Offer" 
              className="w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain rounded-2xl cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue via-brand-blue/90 to-violet-600 p-1 shadow-2xl animate-in zoom-in-95 duration-200"
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

          {title && (
            <h3 className="mb-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mb-8 text-sm text-muted-foreground sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}

          <Button
            size="lg"
            className="w-full rounded-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold shadow-lg transition-transform hover:scale-105"
            nativeButton={false}
            onClick={close}
            render={
              <Link href={linkUrl}>
                {buttonText || 'Claim Offer'} <ArrowRight className="ml-2 size-5" />
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
}
