import type { ReactNode } from 'react';
import Image from 'next/image';

import { PublicFooter } from '@/shared/components/public/PublicFooter';
import { PublicHeader } from '@/shared/components/public/PublicHeader';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background relative">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />

      {/* Sticky WhatsApp Tab */}
      <div className="fixed right-0 top-1/2 z-50 -translate-y-1/2">
        <a
          href="https://wa.me/9779801820900?text=Hi%20%2C%20We%20are%20digo%20academy%20do%20you%20want%20to%20disucss%20anything%20like%20type%20message%20over%20there"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center bg-[#25D366] text-white py-4 px-2 rounded-l-md shadow-[-4px_0_15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-x-1 focus:outline-none"
          aria-label="Connect on Whatsapp"
        >
          {/* Left-pointing triangle indicator */}
          <div className="absolute top-1/2 right-full -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[8px] border-r-[#25D366]" />
          
          <div className="flex flex-col items-center gap-3">
            <Image src="/whatsapp.png" alt="WhatsApp" width={28} height={28} className="object-contain" />
            <span className="[writing-mode:vertical-rl] font-medium tracking-wide text-sm">
              WhatsApp
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
