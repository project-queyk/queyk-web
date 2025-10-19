"use client";

import Image from "next/image";
import { Session } from "next-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile({ session }: { session: Session }) {
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

  const {
    mutate: togglePushNotifications,
    isPending: pushNotificationPending,
  } = useMutation({
    mutationFn: async (enable: boolean) => {
      if (enable) {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
          throw new Error("Push notifications not supported");
        }

        if (Notification.permission === "denied") {
          throw new Error("Push notifications denied");
        }

        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            throw new Error("Push notification permission denied");
          }
        }

        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        await navigator.serviceWorker.ready;

        const existingSub = await registration.pushManager.getSubscription();
        let subscription;

        if (existingSub) {
          subscription = existingSub;
        } else {
          if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
            throw new Error("VAPID key not configured");
          }

          const urlBase64ToUint8Array = (base64String: string) => {
            const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
            const base64 = (base64String + padding)
              .replace(/-/g, "+")
              .replace(/_/g, "/");
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
          };

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            ),
          });
        }

        const serializedSub = JSON.parse(JSON.stringify(subscription));
        const response = await fetch("/api/push-subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: serializedSub }),
        });

        if (!response.ok) {
          throw new Error("Failed to subscribe to push notifications");
        }

        return response.json();
      } else {
        const response = await fetch("/api/push-unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to unsubscribe from push notifications");
        }

        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", session.user.id] });
    },
  });

  function handleToggleNotifications() {
    const currentValue = userData?.data?.alertNotification || false;
    mutate(!currentValue);
  }

  function handleTogglePushNotifications() {
    const currentValue = userData?.data?.webPushSubscription ? true : false;
    togglePushNotifications(!currentValue);
  }

  return (
    <div className="grid gap-3">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 md:gap-4">
            <Image
              src={session.user.image ?? ""}
              width={45}
              height={45}
              alt={`${session.user.name ?? ""}name`}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{session.user.name}</p>
              <p className="text-muted-foreground text-sm font-medium">
                {session.user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="mx-6 flex flex-col items-stretch space-y-0 p-0">
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-row items-center justify-between gap-2">
            <div className="text-foreground/80 text-sm">
              Receive email alerts when an earthquake activity is detected.
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger
                  asChild
                  disabled={userDataIsLoading || updateNoficationIsPending}
                  aria-disabled={userDataIsLoading || updateNoficationIsPending}
                >
                  <div className="cursor-pointer">
                    <Switch
                      checked={
                        userData ? userData.data.alertNotification : false
                      }
                      onCheckedChange={() => {}}
                      className="cursor-pointer"
                      disabled={userDataIsLoading || updateNoficationIsPending}
                      aria-disabled={
                        userDataIsLoading || updateNoficationIsPending
                      }
                    />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {userData?.data?.alertNotification
                        ? "Disable Earthquake Notifications?"
                        : "Enable Earthquake Notifications?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {userData?.data?.alertNotification
                        ? "You will no longer receive email alerts when earthquake activity is detected."
                        : "You will receive email alerts when earthquake activity is detected."}
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
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="text-foreground/80 text-sm">
              Receive browser push notifications when an earthquake activity is
              detected.
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger
                  asChild
                  disabled={userDataIsLoading || pushNotificationPending}
                  aria-disabled={userDataIsLoading || pushNotificationPending}
                >
                  <div className="cursor-pointer">
                    <Switch
                      checked={
                        userData?.data?.webPushSubscription ? true : false
                      }
                      onCheckedChange={() => {}}
                      className="cursor-pointer"
                      disabled={userDataIsLoading || pushNotificationPending}
                      aria-disabled={
                        userDataIsLoading || pushNotificationPending
                      }
                    />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {userData?.data?.webPushSubscription
                        ? "Disable Push Notifications?"
                        : "Enable Push Notifications?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {userData?.data?.webPushSubscription
                        ? "You will no longer receive browser push notifications when earthquake activity is detected."
                        : "You will receive browser push notifications when earthquake activity is detected. Your browser will request permission to send notifications."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleTogglePushNotifications();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
