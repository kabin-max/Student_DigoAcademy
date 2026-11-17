'use client';

import { useEffect, useRef } from 'react';

interface Grecaptcha {
  render: (
    container: HTMLElement,
    parameters: {
      sitekey: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      theme?: 'light' | 'dark';
      size?: 'normal' | 'compact';
    }
  ) => number;
  reset: (widgetId?: number) => void;
}

declare global {
  interface Window {
    grecaptcha?: Grecaptcha & { ready?: (cb: () => void) => void };
    __onRecaptchaScriptLoad?: () => void;
  }
}

let recaptchaScriptPromise: Promise<Grecaptcha> | null = null;

function loadRecaptchaScript(): Promise<Grecaptcha> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('reCAPTCHA can only load in the browser'));
  }

  if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise<Grecaptcha>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-recaptcha-v2="true"]'
    );

    window.__onRecaptchaScriptLoad = () => {
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        resolve(window.grecaptcha);
      } else {
        reject(new Error('grecaptcha failed to initialize'));
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.src =
        'https://www.google.com/recaptcha/api.js?onload=__onRecaptchaScriptLoad&render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.recaptchaV2 = 'true';
      script.onerror = () => {
        recaptchaScriptPromise = null;
        reject(new Error('Failed to load Google reCAPTCHA script'));
      };
      document.head.appendChild(script);
    }
  });

  return recaptchaScriptPromise;
}

export interface RecaptchaV2Props {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  /** Increment this number to programmatically reset the widget (e.g. after a failed submit). */
  resetTrigger?: number;
  className?: string;
}

/**
 * Reusable Google reCAPTCHA v2 ("I'm not a robot" checkbox) widget.
 * Uses the official explicit-render script without third-party React wrapper dependencies.
 */
export function RecaptchaV2({
  siteKey,
  onVerify,
  onExpire,
  onError,
  resetTrigger = 0,
  className,
}: RecaptchaV2Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  }, [onVerify, onExpire, onError]);

  useEffect(() => {
    let cancelled = false;

    loadRecaptchaScript()
      .then((grecaptcha) => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) {
          return;
        }
        widgetIdRef.current = grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onVerifyRef.current(token),
          'expired-callback': () => onExpireRef.current?.(),
          'error-callback': () => onErrorRef.current?.(),
        });
      })
      .catch((err) => {
        console.error('[reCAPTCHA] Widget load error:', err);
        onErrorRef.current?.();
      });

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetTrigger > 0 && widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  }, [resetTrigger]);

  return (
    <div className={className}>
      <div ref={containerRef} />
    </div>
  );
}
