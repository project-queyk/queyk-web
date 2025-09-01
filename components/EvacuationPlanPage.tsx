"use client";

import { Download } from "lucide-react";
import { Session } from "next-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { safetyGuidelines } from "@/lib/safety-guidelines";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MobileFloorPlans from "@/components/MobileFloorPlans";
import DesktopFloorPlans from "@/components/DesktopFloorPlans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EvacuationPlanPage({ session }: { session: Session }) {
  const queryClient = useQueryClient();

  const { data: userData, isLoading: userDataIsLoading } = useQuery({
    queryKey: ["user", session.user.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${session.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch readings");
      }

      return response.json();
    },
  });

  const { mutate, isPending: updateNoficationIsPending } = useMutation({
    mutationFn: async (newValue: boolean) => {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alertNotification: newValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notification preference");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", session.user.id] });
    },
  });

  function handleToggleNotifications() {
    const currentValue = userData?.data?.alertNotification || false;
    mutate(!currentValue);
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-row items-center justify-between gap-2">
        {session.user.role === "user" ? (
          <div className="text-foreground/90 space-y-0.5">
            <div className="text-base font-medium">
              Earthquake Alert Notifications
            </div>
            <div className="text-sm">
              Receive email alerts when an earthquake activity is detected.
            </div>
          </div>
        ) : null}
        <div>
          <AlertDialog>
            <AlertDialogTrigger
              asChild
              disabled={userDataIsLoading || updateNoficationIsPending}
              aria-disabled={userDataIsLoading || updateNoficationIsPending}
            >
              <div className="cursor-pointer">
                <Switch
                  checked={userData ? userData.data.alertNotification : false}
                  onCheckedChange={() => {}}
                  className="cursor-pointer"
                  disabled={userDataIsLoading || updateNoficationIsPending}
                  aria-disabled={userDataIsLoading || updateNoficationIsPending}
                />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleToggleNotifications();
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
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
