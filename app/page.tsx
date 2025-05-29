import { auth } from "@/auth";
import { Metadata } from "next";

import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Queyk - Open-source earthquake early warning system",
};

export default async function Home() {
  const session = await auth();

  return <LandingPage session={session} />;
}
