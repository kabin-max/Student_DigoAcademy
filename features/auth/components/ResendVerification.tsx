'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth/client';
import { Button } from '@/shared/components/ui/button';

const COOLDOWN_SECONDS = 30;

export function ResendVerification({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function startCooldown() {
    setCooldown(COOLDOWN_SECONDS);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function resend() {
    if (cooldown > 0 || isSending) return;
    setIsSending(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      });
      if (error) {
        toast.error(error.message ?? 'Could not resend email. Please try again.');
        return;
      }
      toast.success('Verification email sent — check your inbox (and spam folder).');
      startCooldown();
    } finally {
      setIsSending(false);
    }
  }

  const isDisabled = !email || cooldown > 0 || isSending;

  return (
    <Button
      type="button"
      variant="outline"
      onClick={resend}
      disabled={isDisabled}
      className="w-full relative"
    >
      {isSending ? (
        'Sending…'
      ) : cooldown > 0 ? (
        <span>
          Resend in{' '}
          <span className="tabular-nums font-bold text-primary">{cooldown}s</span>
        </span>
      ) : (
        'Resend verification email'
      )}
    </Button>
  );
}
