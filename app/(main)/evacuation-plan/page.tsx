import { Metadata } from "next";

import EvacuationPlanPage from "@/components/EvacuationPlanPage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Evacuation Plan",
  description:
    "View comprehensive evacuation floor plans and safety guidelines for earthquake emergency response. Interactive floor-by-floor evacuation routes, assembly points, and safety procedures based on official Philippine disaster management protocols.",
};

export default async function Page() {
  const session = await auth();

  if (!session) return redirect("/signin");

  return <EvacuationPlanPage />;
}
