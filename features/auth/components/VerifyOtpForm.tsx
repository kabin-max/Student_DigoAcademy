'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ResendVerification } from './ResendVerification';

interface VerifyOtpFormProps {
  email: string;
}

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email,
        otp: cleanOtp,
      });

      if (error) {
        toast.error(error.message || 'Invalid verification code');
        return;
      }

      toast.success('Email verified successfully!');
      
      // Look for a redirect param if present, or go to student dashboard
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirectTo');
      
      router.push(redirectTo || '/student');
      router.refresh();
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div className="space-y-2">
          <label htmlFor="otp" className="text-sm font-medium">
            Verification Code
          </label>
          <Input
            id="otp"
            type="text"
            placeholder="e.g. 123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.trim())}
            disabled={isVerifying}
            className="text-center tracking-widest text-lg font-mono"
            maxLength={6}
            autoComplete="one-time-code"
          />
        </div>
        <Button type="submit" disabled={isVerifying || otp.trim().length < 6} className="w-full">
          {isVerifying ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground mb-2">Didn't receive the code?</p>
        <ResendVerification email={email} />
      </div>
    </div>
  );
}
