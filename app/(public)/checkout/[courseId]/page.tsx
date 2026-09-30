'use client';

import { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Copy,
  UploadCloud,
  ShoppingCart,
  User,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { createGuestInquiry } from '@/features/enrollment/server/actions';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export default function CheckoutPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const searchParams = useSearchParams();
  const mode = (searchParams?.get('mode') as 'GROUP_LIVE' | 'SELF_PACED') || 'GROUP_LIVE';

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Account number copied to clipboard!');
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptUploaded) {
      toast.error('Please upload your payment receipt.');
      return;
    }
    if (!agreed) {
      toast.error('Please agree to the Terms and Conditions.');
      return;
    }

    setIsSubmitting(true);
    try {
      let formattedPhone = details.phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+977' + formattedPhone.replace(/\D/g, '');
      }

      const result = await createGuestInquiry({
        courseId,
        mode,
        name: details.name,
        email: details.email,
        phone: formattedPhone,
        message: `Receipt Uploaded`, // Just a dummy message for now
      });

      if (result.ok) {
        setSubmitted(true);
        toast.success('Payment submitted! We are validating your receipt.');
      } else {
        toast.error(result.error || 'Failed to submit payment request.');
      }
    } catch (err) {
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
            <Button size="lg" className="rounded-full px-8 bg-[#f96316] hover:bg-[#ea580c] text-white" nativeButton={false} render={<Link href="/login">Go to Dashboard</Link>} />
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
            
            <div className="p-2 border border-dashed border-gray-300 rounded-xl mb-4 bg-gray-50 flex items-center justify-center size-48">
              {/* Dummy QR Code */}
              <div className="size-40 border-8 border-black rounded-lg bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DigoAcademy')] bg-center bg-cover bg-no-repeat relative flex items-center justify-center">
                <div className="size-8 bg-white border-2 border-red-600 rounded flex items-center justify-center text-red-600 font-bold text-lg leading-none pt-1">f</div>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-foreground">Scan to Pay</h3>
            <p className="text-xs text-red-500 font-medium">* Please take a screenshot after the payment.</p>
          </div>

          {/* Bank Transfer Card */}
          <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-gray-900 dark:text-foreground">
              <span className="text-xl">🏦</span> Bank Transfer
            </h3>
            <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <p><span className="font-bold text-gray-900 dark:text-foreground">Bank:</span> Nepal Bank Limited</p>
              <p><span className="font-bold text-gray-900 dark:text-foreground">Account Name:</span> Digo Academy</p>
              <div className="flex items-center gap-2">
                <p><span className="font-bold text-gray-900 dark:text-foreground">Ac/No:</span> 01600107100424000001</p>
                <button
                  type="button"
                  onClick={() => handleCopyAccount('01600107100424000001')}
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
              <p><span className="font-bold text-gray-900 dark:text-foreground">Branch:</span> Dharan</p>
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
              <ShoppingCart className="size-6 text-[#f96316]" />
              <h2 className="font-heading text-xl font-extrabold text-gray-900 dark:text-foreground">Checkout Summary</h2>
            </div>
            
            <div className="space-y-3 text-sm border-b border-dashed border-gray-200 dark:border-border/60 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 font-medium">Course:</span>
                <span className="font-bold text-right text-gray-900 dark:text-foreground max-w-[60%]">AWS Cloud Practitioner Course (CLF-C02)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Batch Starts:</span>
                <span className="font-medium text-gray-900 dark:text-foreground">September 30, 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Duration:</span>
                <span className="font-medium text-gray-900 dark:text-foreground">1 Month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Mode:</span>
                <span className="font-medium text-gray-900 dark:text-foreground">Online (Google Meet)</span>
              </div>
            </div>

            <div className="space-y-2 text-sm border-b border-dashed border-gray-200 dark:border-border/60 pb-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600 dark:text-gray-400">Course Price <span className="text-[10px] font-normal">(Excl. VAT)</span></span>
                <span className="font-bold text-gray-900 dark:text-foreground">Rs. 3,500/-</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-400">VAT <span className="text-[10px] font-normal">(13%)</span></span>
                <span className="font-bold text-gray-600 dark:text-gray-400">+ Rs. 455/-</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-gray-900 dark:text-foreground">Total Payable</span>
              <div className="text-right">
                <span className="block font-extrabold text-3xl text-[#ea580c] mb-1">Rs. 3,955/-</span>
                <div className="flex items-center justify-end gap-2 text-xs">
                  <span className="text-gray-400 line-through font-semibold">Rs. 33,000</span>
                  <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-sm">Save 88%</span>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 font-medium mb-8">
              <span className="inline-flex items-center justify-center size-3 rounded-full bg-gray-200 text-gray-500 mr-1">i</span>
              Course price shown on our course pages excludes VAT. 13% VAT is added at checkout as required by Nepal tax law.
            </p>

            <div className="border-t border-gray-200 dark:border-border/60 pt-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#f96316] rounded-full p-1 text-white">
                  <User className="size-4" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-foreground">Student Details</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 rounded-xl bg-gray-50 border border-gray-100 dark:bg-muted/20 dark:border-border/40 p-5">
                <div>
                  <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide block mb-1">Full Name</label>
                  <Input 
                    required 
                    placeholder="Baka Baki" 
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="h-8 text-sm font-semibold text-gray-900 dark:text-foreground bg-transparent border-none p-0 focus-visible:ring-0 shadow-none placeholder:font-normal" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide block mb-1">Email</label>
                  <Input 
                    type="email" 
                    required 
                    placeholder="corole3182@cwsgear.com" 
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className="h-8 text-sm font-semibold text-gray-900 dark:text-foreground bg-transparent border-none p-0 focus-visible:ring-0 shadow-none placeholder:font-normal" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide block mb-1">Whatsapp</label>
                  <Input 
                    required 
                    placeholder="9843456720" 
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    className="h-8 text-sm font-semibold text-gray-900 dark:text-foreground bg-transparent border-none p-0 focus-visible:ring-0 shadow-none placeholder:font-normal" 
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 border-t border-gray-200 dark:border-border/60 pt-6">
              <label className="text-sm font-bold text-gray-900 dark:text-foreground block mb-2">Upload Payment Receipt <span className="text-red-500">*</span></label>
              
              <button 
                type="button" 
                onClick={() => setReceiptUploaded(!receiptUploaded)}
                className={`w-full rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  receiptUploaded 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {receiptUploaded ? (
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="size-8 text-emerald-500 mb-2" />
                    <span className="text-sm font-semibold text-emerald-700">Receipt attached successfully!</span>
                    <span className="text-xs text-emerald-600/80 mt-1">Click to remove</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud className="size-8 mb-2 text-gray-400" />
                    <span className="text-sm font-medium">Click or drag receipt here</span>
                    <span className="text-[10px] mt-1">(PNG, JPG • Max 2MB)</span>
                  </div>
                )}
              </button>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="size-4 rounded border-gray-300 text-[#f96316] focus:ring-[#f96316]" 
              />
              <label htmlFor="terms" className="text-sm text-gray-600 font-medium">
                I agree to the <span className="text-[#f96316] font-bold cursor-pointer hover:underline">Terms and Conditions</span>
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-base h-12 rounded-lg"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Payment & Enroll'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
