import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import SignIn from "@/components/SignIn";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to access your school's earthquake monitoring system with Google authentication.",
};

export default async function Page() {
  const session = await auth();

  if (session) return redirect("/dashboard");

  return <SignIn />;
}
