import { Metadata } from "next";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Monitor seismic activity with comprehensive data visualization. Track earthquake magnitude and frequency patterns with date picker selection and interactive charts showing detailed hourly breakdowns.",
};

export default async function Page() {
  const session = await auth();

  if (!session) return redirect("/signin");

  return <Dashboard session={session} />;
}
