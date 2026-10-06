'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface PopupModalProps {
  imageUrl: string;
  linkUrl: string;
}

export function PopupModal({ imageUrl, linkUrl }: PopupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after a short delay
    const timer = setTimeout(() => {
      const hasSeen = sessionStorage.getItem('hasSeenPromoModal');
      if (!hasSeen && imageUrl) {
        setIsOpen(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenPromoModal', 'true');
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={close}
    >
      <div 
        className="relative flex items-center justify-center animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute -top-3 -right-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-md transition-colors hover:bg-black hover:scale-110 shadow-xl cursor-pointer"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <Link href={linkUrl} onClick={close} className="relative block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt="Special Offer" 
            className="w-auto h-auto max-w-[90vw] max-h-[85vh] object-contain rounded-2xl cursor-pointer shadow-2xl"
          />
        </Link>
      </div>
    </div>
  );
}
