"use client";

import Image from "next/image";
import { useState } from "react";
import { Download } from "lucide-react";

import { floors } from "@/lib/floors";
import { safetyGuidelines } from "@/lib/safety-guidelines";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function MobileFloorPlans() {
  const [selectedFloor, setSelectedFloor] = useState("ground");

  const currentFloor =
    floors.find((floor) => floor.id === selectedFloor) || floors[0];

  return (
    <div className="space-y-4">
      <Select defaultValue="ground" onValueChange={setSelectedFloor}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select floor" />
        </SelectTrigger>
        <SelectContent>
          {floors.map((floor) => (
            <SelectItem key={floor.id} value={floor.id}>
              {floor.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="animate-in fade-in-50">
        <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-md">
          <Image
            src={currentFloor.imageSrc}
            alt={`${currentFloor.title} Earthquake Evacuation Plan`}
            width={1280}
            height={720}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function DesktopFloorPlans() {
  return (
    <Tabs defaultValue="ground" className="w-full">
      <TabsList className="flex w-full">
        {floors.map((floor) => (
          <TabsTrigger
            key={floor.id}
            value={floor.id}
            className="flex-1 text-sm"
          >
            {floor.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {floors.map((floor) => (
        <TabsContent key={floor.id} value={floor.id} className="mt-4">
          <div className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-md">
            <Image
              src={floor.imageSrc}
              alt={`${floor.title} Earthquake Evacuation Plan`}
              width={1280}
              height={720}
              className="object-contain"
              priority={floor.id === "ground"}
            />
          </div>
          <div className="mt-2 text-center">
            <h3 className="font-medium">{floor.title}</h3>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default function Page() {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground">
          Floor plans with evacuation routes and assembly points in case of an
          earthquake
        </p>
        <Button variant="outline" size="sm" className="h-8" asChild>
          <a
            href="/documents/evacuation-plan.pdf"
            download="Queyk-Evacuation-Plan.pdf"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>
      <Card className="w-full">
        <CardHeader className="mx-4.5 flex flex-col items-stretch space-y-0 border-b p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 pt-2">
            <CardTitle>Evacuation Floor Plans</CardTitle>
            <CardDescription>
              Select a floor to view evacuation routes
            </CardDescription>
          </div>
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
                <p className="text-muted-foreground text-sm">
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
