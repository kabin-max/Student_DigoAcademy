'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface PopupModalProps {
  imageUrl: string;
  linkUrl: string;
}

export function PopupModal({ imageUrl, linkUrl }: PopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    // Check if user already dismissed the promo modal in this session
    const hasSeen = sessionStorage.getItem('hasSeenPromoModal');
    if (hasSeen) return;

    let isMounted = true;
    let timerPassed = false;
    let imageReady = false;

    const tryOpen = () => {
      if (timerPassed && imageReady && isMounted) {
        setIsOpen(true);
      }
    };

    // Delay slightly to let the page settle before opening modal
    const timer = setTimeout(() => {
      timerPassed = true;
      tryOpen();
    }, 1200);

    // Preload image in memory so it renders instantly when modal appears
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      if (!isMounted) return;
      imageReady = true;
      tryOpen();
    };
    img.onerror = () => {
      // Do not open modal if image fails to load
      imageReady = false;
    };

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [imageUrl]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPromoModal', 'true');
  };

  if (!isOpen || !imageUrl) return null;

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
