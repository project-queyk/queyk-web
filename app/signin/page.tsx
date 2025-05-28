import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { FaGoogle } from "react-icons/fa";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { signInAction } from "@/lib/auth-actions";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to access your school's earthquake monitoring system with Google authentication.",
};

export default async function Page() {
  const session = await auth();

  if (session) return redirect("/dashboard");

  return (
    <section className="flex min-h-screen px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        action=""
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5"
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

          <div className="mt-6">
            <Button
              type="button"
              variant="default"
              className="w-full font-semibold"
              onClick={signInAction}
            >
              <FaGoogle className="size-4" />
              <span>Sign in with Google</span>
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
