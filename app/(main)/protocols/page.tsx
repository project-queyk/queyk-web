import Link from "next/link";
import { LocateIcon } from "lucide-react";

import { protocols } from "@/lib/protocols";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="grid gap-3">
      {protocols.map((protocol) => (
        <Card className="w-full" key={protocol.header}>
          <CardHeader className="mx-4.5 flex flex-col items-stretch space-y-0 border-b p-0">
            <div className="flex flex-1 flex-col justify-center gap-1 px-1.5 pt-2">
              <CardTitle>{protocol.header}</CardTitle>
              <CardDescription>{protocol.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 px-6 pb-4">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {protocol.bulletItems.map((bullet) => (
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
      ))}
      <div className="mt-4 flex justify-center md:hidden">
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/evacuation-plan" className="flex items-center gap-2">
            <LocateIcon className="size-5" />
            <span>Find Nearest Evacuation Site</span>
          </Link>
        </Button>
      </div>
      <div className="text-muted-foreground mt-2 text-center text-xs md:text-sm">
        Based on guidelines from NDRRMC, PHIVOLCS, and the Philippine Disaster
        Risk Reduction and Management Act (RA 10121)
      </div>
    </div>
  );
}
