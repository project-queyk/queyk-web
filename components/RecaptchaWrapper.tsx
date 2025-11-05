"use client";

import Script from "next/script";

declare global {
  interface Window {
    onRecaptchaCallback?: (token: string) => void;
  }
}

interface Props {
  onVerified?: () => void;
}

export function RecaptchaWrapper({ onVerified }: Props) {
  const onCallback = (token: string) => {
    const tokenInput = document.getElementById(
      "recaptcha-token",
    ) as HTMLInputElement;
    if (tokenInput) tokenInput.value = token;
    onVerified?.();
  };

  // Make the callback global for reCAPTCHA
  if (typeof window !== "undefined") {
    window.onRecaptchaCallback = onCallback;
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js`}
        strategy="afterInteractive"
      />
      <div
        className="g-recaptcha mb-4"
        data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
        data-callback="onRecaptchaCallback"
      ></div>
      <input type="hidden" name="recaptchaToken" id="recaptcha-token" />
    </>
  );
}
