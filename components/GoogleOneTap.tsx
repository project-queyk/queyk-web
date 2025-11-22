"use client";

import Script from "next/script";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useCallback, useState } from "react";

import {
  CredentialResponse,
  GoogleIdentityInitializeConfig,
  GoogleNotification,
} from "@/lib/types/oauth";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleIdentityInitializeConfig) => void;
          prompt: (
            callback: (notification: GoogleNotification) => void,
          ) => void;
          cancel: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
  }
}

export default function GoogleOneTap() {
  const { data: session } = useSession();
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  const handleCredentialResponse = useCallback(
    (response: CredentialResponse) => {
      signIn("credentials", {
        credential: response.credential,
        redirect: true,
        redirectTo: "/dashboard",
      });
    },
    [],
  );

  const initializeGoogleOneTap = useCallback(() => {
    if (window.google && !session) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID!,
          callback: handleCredentialResponse,
          context: "signin",
          ux_mode: "popup",
          auto_select: false,
          use_fedcm_for_prompt: true,
          cancel_on_tap_outside: false,
          itp_support: true,
        });

        try {
          window.google.accounts.id.prompt(() => {});
        } catch {}
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(
            "Only one navigator.credentials.get request may be outstanding at one time",
          )
        ) {
          setTimeout(initializeGoogleOneTap, 1000);
        } else {
        }
      }
    }
  }, [session, handleCredentialResponse]);

  useEffect(() => {
    if (isGoogleScriptLoaded) {
      initializeGoogleOneTap();
    }
  }, [isGoogleScriptLoaded, initializeGoogleOneTap]);

  useEffect(() => {
    if (session) {
      window.google?.accounts.id.cancel();
    }
  }, [session]);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      async
      defer
      onLoad={() => setIsGoogleScriptLoaded(true)}
      strategy="afterInteractive"
    />
  );
}
