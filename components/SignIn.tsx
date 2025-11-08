"use client";

import Link from "next/link";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";

import { signInAction } from "@/lib/auth-actions";

import { Button } from "@/components/ui/button";
import { RecaptchaWrapper } from "@/components/RecaptchaWrapper";

export default function SignIn() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5"
        action={signInAction}
      >
        <div className="p-6">
          <div>
            <Link
              href="/"
              aria-label="go home"
              className="flex items-center gap-1"
            >
              <Image
                src="/queyk-light.png"
                width={25}
                height={25}
                alt="queyk's logo"
                className="size-4.5 invert md:size-5.5"
              />
              <p className="mb-0.5 font-semibold md:text-xl">Queyk</p>
            </Link>
            <h1 className="mt-4 mb-1 text-xl font-semibold">
              Sign In to Queyk
            </h1>
            <p>Welcome back! Sign in to continue</p>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-center">
              <RecaptchaWrapper onVerified={() => setIsVerified(true)} />
            </div>
            <Button
              type="submit"
              variant="default"
              className="w-full font-semibold"
              disabled={!isVerified}
            >
              <FaGoogle className="size-4" />
              <span>Sign in with Google</span>
            </Button>
          </div>
        </div>
      </form>
      <p className="text-sm">
        By signing in, you agree to our{" "}
        <Link href="/privacy" target="_blank" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </section>
  );
}
