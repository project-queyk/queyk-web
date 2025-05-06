import Link from "next/link";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { signInAction } from "@/lib/auth-actions";

import { Button } from "@/components/ui/button";

export default async function Page() {
  const session = await auth();

  if (session) return redirect("/dashboard");

  return (
    <>
      <header className="mx-6 my-4">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/queyk-light.png"
            width={25}
            height={25}
            alt="queyk's logo"
            className="size-4.5 invert md:size-5.5"
          />
          <p className="mb-0.5 font-semibold md:text-xl">Queyk</p>
        </Link>
      </header>
      <main className="mx-6 grid min-h-[85dvh] items-center justify-center gap-4">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold md:text-4xl">Welcome back!</h1>
          <p className="text-muted-foreground text-sm font-medium md:text-base">
            Access your school&apos;s earthquake monitoring system.
          </p>
          <Button
            onClick={signInAction}
            className="mt-2 w-full cursor-pointer gap-3 font-semibold"
            size="lg"
          >
            <FaGoogle className="size-4" />
            Sign in with Google
          </Button>
        </div>
      </main>
    </>
  );
}
