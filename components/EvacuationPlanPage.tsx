"use client";

import { Download } from "lucide-react";

import { safetyGuidelines } from "@/lib/safety-guidelines";

import { Button } from "@/components/ui/button";
import MobileFloorPlans from "@/components/MobileFloorPlans";
import DesktopFloorPlans from "@/components/DesktopFloorPlans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EvacuationPlanPage() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2"></div>
      <Card className="w-full">
        <CardHeader className="mx-4.5 flex items-stretch space-y-0 border-b p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 pt-2">
            <CardTitle>Evacuation Floor Plans</CardTitle>
            <CardDescription>
              Select a floor to view evacuation routes
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden h-8 md:flex"
            asChild
          >
            <a
              href="/documents/evacuation-plan.pdf"
              download="Queyk-Evacuation-Plan.pdf"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </Button>
          <Button variant="outline" size="sm" className="h-8 md:hidden" asChild>
            <a
              href="/documents/evacuation-plan.pdf"
              download="Queyk-Evacuation-Plan.pdf"
            >
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-4">
          <div className="md:hidden">
            <MobileFloorPlans />
          </div>
          <div className="hidden md:block">
            <DesktopFloorPlans />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="mx-4.5 flex flex-col items-stretch space-y-0 border-b p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 pt-2">
            <CardTitle>{safetyGuidelines.header}</CardTitle>
            <CardDescription>{safetyGuidelines.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-4">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {safetyGuidelines.bulletItems.map((bullet) => (
              <div className="flex flex-col gap-2" key={bullet.title}>
                <h3 className="text-primary font-semibold">{bullet.title}</h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {bullet.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground mt-2 text-center text-xs md:text-sm">
        Based on guidelines from NDRRMC, PHIVOLCS, and the Philippine Disaster
        Risk Reduction and Management Act (RA 10121)
      </div>
    </div>
  );
}
