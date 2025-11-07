"use client";

import React, { useState } from "react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function Profile({ session }: { session: Session }) {
  const queryClient = useQueryClient();
  const [phoneNumber, setPhoneNumber] = useState("");

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

  const {
    mutate: updateEmailNotification,
    isPending: updateEmailNotificationIsPending,
  } = useMutation({
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

  // const {
  //   mutate: togglePushNotifications,
  //   isPending: pushNotificationPending,
  // } = useMutation({
  //   mutationFn: async (enable: boolean) => {
  //     if (enable) {
  //       if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
  //         throw new Error("Push notifications not supported");
  //       }

  //       if (Notification.permission === "denied") {
  //         throw new Error("Push notifications denied");
  //       }

  //       if (Notification.permission === "default") {
  //         const permission = await Notification.requestPermission();
  //         if (permission !== "granted") {
  //           throw new Error("Push notification permission denied");
  //         }
  //       }

  //       const registration = await navigator.serviceWorker.register("/sw.js", {
  //         scope: "/",
  //         updateViaCache: "none",
  //       });
  //       await navigator.serviceWorker.ready;

  //       const existingSub = await registration.pushManager.getSubscription();
  //       let subscription;

  //       if (existingSub) {
  //         subscription = existingSub;
  //       } else {
  //         if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
  //           throw new Error("VAPID key not configured");
  //         }

  //         const urlBase64ToUint8Array = (base64String: string) => {
  //           const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  //           const base64 = (base64String + padding)
  //             .replace(/-/g, "+")
  //             .replace(/_/g, "/");
  //           const rawData = window.atob(base64);
  //           const outputArray = new Uint8Array(rawData.length);
  //           for (let i = 0; i < rawData.length; ++i) {
  //             outputArray[i] = rawData.charCodeAt(i);
  //           }
  //           return outputArray;
  //         };

  //         subscription = await registration.pushManager.subscribe({
  //           userVisibleOnly: true,
  //           applicationServerKey: urlBase64ToUint8Array(
  //             process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  //           ),
  //         });
  //       }

  //       const serializedSub = JSON.parse(JSON.stringify(subscription));
  //       const response = await fetch("/api/push-subscribe", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ subscription: serializedSub }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to subscribe to push notifications");
  //       }

  //       return response.json();
  //     } else {
  //       const response = await fetch("/api/push-unsubscribe", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to unsubscribe from push notifications");
  //       }

  //       return response.json();
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["user", session.user.id] });
  //   },
  // });

  const {
    mutate: updateSMSNotification,
    isPending: updateSMSNotificationIsPending,
  } = useMutation({
    mutationFn: async (newValue: boolean) => {
      const response = await fetch("/api/sms-notification", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          smsNotification: newValue,
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

  const { mutate: updatePhoneNumber, isPending: updatePhoneNumberIsPending } =
    useMutation({
      mutationFn: async (newValue: string) => {
        const response = await fetch("/api/phone-number", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: newValue,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update user's phone number");
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", session.user.id] });
      },
    });

  const { mutate: deletePhoneNumber, isPending: deletePhoneNumberIsPending } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch("/api/phone-number", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete user's phone number");
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", session.user.id] });
      },
    });

  function handleToggleEmailNotifications() {
    const currentValue = userData?.data?.alertNotification || false;
    updateEmailNotification(!currentValue);
  }

  function handleToggleSMSNotifications() {
    const currentValue = userData?.data?.smsNotification || false;
    updateSMSNotification(!currentValue);
  }

  // function handleTogglePushNotifications() {
  //   const currentValue = userData?.data?.webPushSubscription ? true : false;
  //   togglePushNotifications(!currentValue);
  // }

  async function handleUpdateUserPhoneNumber(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const phoneNumber = formData.get("phone-number") as string;

    setPhoneNumber("");
    updatePhoneNumber(phoneNumber);

    const dialog = document.activeElement?.closest('[role="dialog"]');
    if (dialog) {
      (dialog.querySelector("[data-dialog-close]") as HTMLElement)?.click();
    }
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
            <div className="min-w-0">
              <p className="truncate font-semibold">{session.user.name}</p>
              <p className="text-muted-foreground truncate text-sm font-medium">
                {session.user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="mx-6 flex flex-col items-stretch space-y-0 p-0">
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-row items-center justify-between gap-2">
            <div className="grid items-center gap-1">
              <p className="text-foreground/80 text-sm">Phone Number:</p>
              {userDataIsLoading ? (
                <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200"></div>
              ) : (
                <p className="text-foreground/90 font-medium">
                  {userData?.data?.phoneNumber
                    ? `0${userData.data.phoneNumber.slice(3)}`
                    : "Not set"}
                </p>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                {!userData?.data?.phoneNumber && (
                  <Button variant="secondary" className="cursor-pointer">
                    Set now
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Set new phone number</DialogTitle>
                  <DialogDescription>
                    Enter your phone number below and click save to update your
                    profile.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateUserPhoneNumber}>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="phone-number">Phone number</Label>
                      <Input
                        id="phone-number"
                        name="phone-number"
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        minLength={10}
                        pattern="9[0-9]{9}"
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length === 0) {
                            setPhoneNumber("");
                          } else {
                            if (value[0] !== "9") {
                              value = "9" + value.replace(/^9*/, "");
                            }
                            setPhoneNumber(value.slice(0, 10));
                          }
                        }}
                        value={phoneNumber}
                        placeholder="9XXXXXXXXX"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline" data-dialog-close>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={
                        phoneNumber?.length !== 10 || updatePhoneNumberIsPending
                      }
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger
                asChild
                disabled={userDataIsLoading || deletePhoneNumberIsPending}
                aria-disabled={userDataIsLoading || deletePhoneNumberIsPending}
              >
                {userData?.data?.phoneNumber && (
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    disabled={userDataIsLoading || deletePhoneNumberIsPending}
                    aria-disabled={
                      userDataIsLoading || deletePhoneNumberIsPending
                    }
                  >
                    Remove
                  </Button>
                )}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Phone Number?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove your phone number? You will
                    no longer receive SMS notifications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deletePhoneNumber();
                      }}
                    >
                      Confirm
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                  disabled={
                    userDataIsLoading || updateEmailNotificationIsPending
                  }
                  aria-disabled={
                    userDataIsLoading || updateEmailNotificationIsPending
                  }
                >
                  <div className="cursor-pointer">
                    <Switch
                      checked={
                        userData ? userData.data.alertNotification : false
                      }
                      onCheckedChange={() => {}}
                      className="cursor-pointer"
                      disabled={
                        userDataIsLoading || updateEmailNotificationIsPending
                      }
                      aria-disabled={
                        userDataIsLoading || updateEmailNotificationIsPending
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
                        handleToggleEmailNotifications();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="mb-4 flex flex-row items-center justify-between gap-2">
            <div className="text-foreground/80 text-sm">
              Receive SMS notifications when an earthquake activity is detected.
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger
                  asChild
                  disabled={
                    userDataIsLoading ||
                    updateSMSNotificationIsPending ||
                    !userData?.data?.phoneNumber
                  }
                  aria-disabled={
                    userDataIsLoading ||
                    updateSMSNotificationIsPending ||
                    !userData?.data?.phoneNumber
                  }
                >
                  <div className="cursor-pointer">
                    <Switch
                      checked={userData?.data?.smsNotification ? true : false}
                      onCheckedChange={() => {}}
                      className="cursor-pointer"
                      disabled={
                        userDataIsLoading ||
                        updateSMSNotificationIsPending ||
                        !userData?.data?.phoneNumber
                      }
                      aria-disabled={
                        userDataIsLoading ||
                        updateSMSNotificationIsPending ||
                        !userData?.data?.phoneNumber
                      }
                    />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {userData?.data?.smsNotification
                        ? "Disable SMS Notifications?"
                        : "Enable SMS Notifications?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {userData?.data?.smsNotification
                        ? "You will no longer receive SMS notifications when earthquake activity is detected."
                        : "You will receive SMS notifications when earthquake activity is detected."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleToggleSMSNotifications();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {/* <div className="flex flex-row items-center justify-between gap-2">
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
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
