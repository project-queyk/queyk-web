"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { FaGoogle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

import { signInAction } from "@/lib/auth-actions";

import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-6 my-80 grid items-center justify-center gap-2 md:gap-3">
          <h5 className="text-3xl font-bold md:text-4xl">
            Something went wrong
          </h5>
          <p className="text-muted-foreground text-sm font-medium text-balance break-words md:text-base">
            Loading error details...
          </p>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}

function ErrorContent() {
  const search = useSearchParams();
  const error = search.get("error");

  return (
    <>
      <header className="mx-6 my-4">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/queyk-light.png"
            width={25}
            height={25}
            alt="queyk's logo"
            className="invert"
          />
          <p className="mb-0.5 text-xl font-semibold">Queyk</p>
        </Link>
      </header>
      <div className="mx-6 my-80 grid items-center justify-center gap-2 md:gap-3">
        <h5 className="text-3xl font-bold md:text-4xl">Something went wrong</h5>
        {error === "AccessDenied" && (
          <>
            <p className="text-muted-foreground text-sm font-medium text-balance break-words md:text-base">
              Access restricted. You must use your official Immaculada
              Concepcion College email to sign in.
            </p>
            <Button
              onClick={signInAction}
              className="mt-2 cursor-pointer gap-3 font-semibold"
              size="lg"
            >
              <FaGoogle className="size-4" />
              Sign in with Google
            </Button>
          </>
        )}

        {error === "Verification" && (
          <>
            <p className="text-muted-foreground text-sm font-medium text-balance break-words md:text-base">
              We couldn&apos;t verify your email address. Please check your
              inbox for a verification email or try signing in again.
            </p>
            <div className="mt-2 grid gap-3">
              <Button
                onClick={signInAction}
                className="cursor-pointer gap-3 font-semibold"
                size="lg"
              >
                <FaGoogle className="size-4" />
                Sign in with Google
              </Button>
              <Button
                asChild
                variant="outline"
                className="cursor-pointer font-semibold"
                size="lg"
              >
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </>
        )}

        {error === "Configuration" && (
          <>
            <p className="text-muted-foreground text-sm font-medium text-balance break-words md:text-base">
              There&apos;s an issue with the authentication service. Please try
              again later or contact support.
            </p>
            <Button
              asChild
              className="mt-2 cursor-pointer font-semibold"
              size="lg"
            >
              <Link href="/">Return to Home</Link>
            </Button>
          </>
        )}

        {!error ||
          (error !== "AccessDenied" &&
            error !== "Verification" &&
            error !== "Configuration" && (
              <>
                <p className="text-muted-foreground text-sm font-medium text-balance break-words md:text-base">
                  An unexpected error occurred. Please try again or contact
                  support if the problem persists.
                </p>
                <Button
                  asChild
                  className="mt-2 cursor-pointer font-semibold"
                  size="lg"
                >
                  <Link href="/">Go to Home</Link>
                </Button>
              </>
            ))}
      </div>
    </>
  );
}
