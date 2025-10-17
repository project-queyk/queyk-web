import { auth } from "@/auth";
import { Metadata } from "next";

import LandingPage from "@/components/LandingPage";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Queyk - Open-source earthquake early warning system",
};

export default async function Home() {
  const session = await auth();

  if (session) {
    if (session.user.role === "admin") {
      return redirect("/dashboard");
    }
    return redirect("/evacuation-plan");
  }

  return <LandingPage session={session} />;
}
