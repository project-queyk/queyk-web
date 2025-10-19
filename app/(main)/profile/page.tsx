import type { Metadata } from "next";

import Profile from "@/components/Profile";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  return {
    title: `${session?.user.name}'s Profile`,
  };
}

export default async function Page() {
  const session = await auth();

  if (!session) return redirect("/signin");

  return <Profile session={session} />;
}
