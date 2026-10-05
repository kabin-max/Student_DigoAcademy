'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useInView } from 'motion/react';

export function ConfettiOnView() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 15, 
        spread: 360, 
        ticks: 200, 
        zIndex: 50,
        gravity: 0.8
      };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 20; // consistent stream
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0, 1), y: -0.1 }
        });
      }, 250);
    }
  }, [isInView]);

  return <div ref={ref} className="absolute inset-0 pointer-events-none" />;
}
