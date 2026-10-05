'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  UploadCloud,
  ShoppingCart,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { createGuestInquiry } from '@/features/enrollment/server/actions';
import { presignReceiptUpload } from '@/features/enrollment/server/upload';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface CheckoutFormProps {
  course: {
    id: string;
    title: string;
    subtitle?: string | null;
    priceCents: number;
    originalPriceCents?: number | null;
    currency: string;
  };
  settings: {
    paymentQrUrl?: string | null;
    bankName?: string | null;
    bankAccountName?: string | null;
    bankAccountNumber?: string | null;
    bankBranch?: string | null;
  } | null;
  mode: 'GROUP_LIVE' | 'SELF_PACED';
  user?: { name: string; email: string } | null;
}

export function CheckoutForm({ course, settings, mode, user }: CheckoutFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const [details, setDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  // Dynamic Price Calculations (NPR)
  const priceNpr = Math.round(course.priceCents / 100);
  const vatNpr = Math.round(priceNpr * 0.13);
  const totalPayableNpr = priceNpr + vatNpr;

  const originalNpr = course.originalPriceCents ? Math.round(course.originalPriceCents / 100) : null;
  const discountPercent =
    originalNpr && originalNpr > totalPayableNpr
      ? Math.round(((originalNpr - totalPayableNpr) / originalNpr) * 100)
      : null;

  // Bank transfer details fallback
  const bankName = settings?.bankName || 'Nepal Bank Limited';
  const bankAccountName = settings?.bankAccountName || 'Digo Academy';
  const bankAccountNumber = settings?.bankAccountNumber || '01600107100424000001';
  const bankBranch = settings?.bankBranch || 'Dharan';
  const qrCodeUrl = settings?.paymentQrUrl || null;

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Account number copied to clipboard!');
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      toast.error('Please upload your payment receipt.');
      return;
    }
    if (!agreed) {
      toast.error('Please agree to the Terms and Conditions.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalReceiptUrl = receiptUrl;

      if (receiptFile && !finalReceiptUrl) {
        const presign = await presignReceiptUpload({
          filename: receiptFile.name,
          contentType: receiptFile.type,
          size: receiptFile.size,
        });

        if (!presign.ok || !presign.url || !presign.key) {
          toast.error(presign.error || 'Failed to initialize upload.');
          setIsSubmitting(false);
          return;
        }

        const res = await fetch(presign.url, {
          method: 'PUT',
          body: receiptFile,
          headers: { 'Content-Type': receiptFile.type },
        });

        if (!res.ok) {
          toast.error('Failed to upload receipt to storage.');
          setIsSubmitting(false);
          return;
        }

        finalReceiptUrl = presign.key;
        setReceiptUrl(finalReceiptUrl);
      }

      let formattedPhone = details.phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+977' + formattedPhone.replace(/\D/g, '');
      }

      const result = await createGuestInquiry({
        courseId: course.id,
        mode,
        name: details.name,
        email: details.email,
        phone: formattedPhone,
        message: `Receipt Uploaded`,
        receiptUrl: finalReceiptUrl || undefined,
      });

      if (result.ok) {
        setSubmitted(true);
        toast.success('Payment submitted! We are validating your receipt.');
      } else {
        toast.error(result.error || 'Failed to submit payment request.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 sm:p-12 shadow-lg">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-extrabold text-foreground">
            Enrollment Request Received!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Thank you, <span className="font-semibold text-foreground">{details.name}</span>. We will notify you once the review process is complete by the admin of this payment.
          </p>
          <div className="mt-6 rounded-2xl border border-border/80 bg-background/90 p-4 text-left text-xs space-y-2">
            <p className="font-bold text-foreground">Next Steps:</p>
            <p className="text-muted-foreground">After the admin validates it, you will successfully access the course, indicating your payment is verified.</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="rounded-full px-8 bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black" render={<Link href="/student/courses" />}>Go to My Courses</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50/50 dark:bg-background min-h-screen">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Payment Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fonepay Card */}
          <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-6 shadow-sm flex flex-col items-center">
            <p className="text-xs font-semibold text-muted-foreground mb-2">We accept</p>
            <div className="flex items-center gap-1 mb-1">
              <span className="font-extrabold text-red-600 text-lg">fone</span>
              <span className="font-extrabold text-gray-800 text-lg">pay</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-4 font-semibold tracking-wide">नेपाल राष्ट्र बैंकबाट अनुमति प्राप्त</p>
            
            <div className="p-2 border border-dashed border-gray-300 rounded-xl mb-4 bg-gray-50 flex items-center justify-center size-52 overflow-hidden relative">
              {qrCodeUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrCodeUrl} alt="Fonepay QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="size-44 border-8 border-black rounded-lg bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=DigoAcademy')] bg-center bg-cover bg-no-repeat relative flex items-center justify-center">
                  <div className="size-8 bg-white border-2 border-red-600 rounded flex items-center justify-center text-red-600 font-bold text-lg leading-none pt-1">f</div>
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-foreground">Scan to Pay</h3>
            <p className="text-xs text-red-500 font-medium">* Please take a screenshot after the payment.</p>
          </div>

          {/* Bank Transfer Card */}
          <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-gray-900 dark:text-foreground">
              <span className="text-xl">🏦</span> Bank Transfer
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><span className="font-bold text-gray-900 dark:text-foreground">Bank:</span> {bankName}</p>
              <p><span className="font-bold text-gray-900 dark:text-foreground">Account Name:</span> {bankAccountName}</p>
              <div className="flex items-center gap-2">
                <p><span className="font-bold text-gray-900 dark:text-foreground">Ac/No:</span> {bankAccountNumber}</p>
                <button
                  type="button"
                  onClick={() => handleCopyAccount(bankAccountNumber)}
                  className="text-primary hover:text-primary/80 transition-colors"
                  title="Copy Account Number"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
              <p><span className="font-bold text-gray-900 dark:text-foreground">Branch:</span> {bankBranch}</p>
            </div>
            <p className="text-[11px] text-red-500 font-medium mt-4">* Please take a screenshot after the payment.</p>
          </div>

          {/* Info Card */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5 dark:bg-emerald-950/20 dark:border-emerald-900/30">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-2">After enrollment, you will receive:</p>
            <ul className="space-y-1.5 text-xs text-emerald-700 dark:text-emerald-500 list-disc list-inside">
              <li>Instant WhatsApp group invitation via SMS or email</li>
              <li>Payment receipt confirmation</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Checkout Summary & Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleComplete} className="rounded-2xl border border-border/80 bg-white dark:bg-card p-6 sm:p-8 shadow-sm">
            
            {/* Checkout Summary Section */}
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="size-6 text-black dark:text-white" />
              <h2 className="font-heading text-xl font-extrabold text-gray-900 dark:text-foreground">Checkout Summary</h2>
            </div>
            
            <div className="space-y-3 text-sm border-b border-dashed border-gray-200 dark:border-border/60 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 font-medium">Course:</span>
                <span className="font-bold text-right text-gray-900 dark:text-foreground max-w-[60%]">{course.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Mode:</span>
                <span className="font-medium text-gray-900 dark:text-foreground">
                  {mode === 'GROUP_LIVE' ? 'Online (Group Live)' : 'Self-Paced Learning'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm border-b border-dashed border-gray-200 dark:border-border/60 pb-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600 dark:text-gray-400">Course Price <span className="text-[10px] font-normal">(Excl. VAT)</span></span>
                <span className="font-bold text-gray-900 dark:text-foreground">Rs. {priceNpr.toLocaleString()}/-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-400">VAT <span className="text-[10px] font-normal">(13%)</span></span>
                <span className="font-bold text-gray-600 dark:text-gray-400">+ Rs. {vatNpr.toLocaleString()}/-</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-gray-900 dark:text-foreground">Total Payable</span>
              <div className="text-right">
                <span className="block font-extrabold text-3xl text-black dark:text-white mb-1">
                  Rs. {totalPayableNpr.toLocaleString()}/-
                </span>
                {originalNpr && originalNpr > totalPayableNpr && (
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <span className="text-gray-400 line-through font-semibold">
                      Rs. {originalNpr.toLocaleString()}
                    </span>
                    {discountPercent && (
                      <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-sm">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-[9px] text-gray-400 font-medium mb-8">
              <span className="inline-flex items-center justify-center size-3 rounded-full bg-gray-200 text-gray-500 mr-1">i</span>
              Course price shown on our course pages excludes VAT. 13% VAT is added at checkout as required by Nepal tax law.
            </p>

            <div className="border-t border-gray-200 dark:border-border/60 pt-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-black dark:bg-white rounded-full p-1 text-white dark:text-black">
                  <User className="size-4" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-foreground">Student Details</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-900 dark:text-foreground block mb-1.5">Full Name</label>
                  <Input 
                    required 
                    placeholder="E.g. Jane Doe" 
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="h-10" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-900 dark:text-foreground block mb-1.5">Email</label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="jane@example.com" 
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className="h-10" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-900 dark:text-foreground block mb-1.5">WhatsApp / Phone</label>
                  <Input 
                    required 
                    placeholder="E.g. 9840000000" 
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    className="h-10" 
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 border-t border-gray-200 dark:border-border/60 pt-6">
              <label className="text-sm font-bold text-gray-900 dark:text-foreground block mb-2">Upload Payment Receipt <span className="text-red-500">*</span></label>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className={`w-full rounded-xl border-2 border-dashed p-8 text-center transition-all pointer-events-none ${
                    receiptFile 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' 
                      : 'border-gray-300 bg-gray-50 dark:bg-accent/10'
                  }`}
                >
                  {receiptFile ? (
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="size-8 text-emerald-500 mb-2" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{receiptFile.name}</span>
                      <span className="text-xs text-emerald-600/80 dark:text-emerald-500 mt-1">Click to change file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <UploadCloud className="size-8 mb-2 text-gray-400" />
                      <span className="text-sm font-medium">Click or drag receipt here</span>
                      <span className="text-[10px] mt-1">(PNG, JPG • Max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="size-4 rounded border-gray-300 text-black focus:ring-black dark:text-white dark:focus:ring-white dark:border-gray-600 dark:bg-gray-800" 
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                I agree to the <Link href="/terms" target="_blank" className="text-black dark:text-white font-bold cursor-pointer hover:underline">Terms and Conditions</Link>
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold text-base h-12 rounded-lg"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Payment & Enroll'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
