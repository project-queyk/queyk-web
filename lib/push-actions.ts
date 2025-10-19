"use server";

import webpush, { PushSubscription } from "web-push";
import { auth } from "@/auth";

webpush.setVapidDetails(
  `mailto:${process.env.QUEYK_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function subscribeUser(sub: PushSubscription) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "User not authenticated" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/v1/api/push-notifications/subscribe`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.USER_TOKEN}`,
        "Token-Type": "user",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription: sub, userId: session.user.id }),
    },
  );
  if (response.ok) {
    return { success: true };
  }
  return { success: false };
}

export async function unsubscribeUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "User not authenticated" };
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/v1/api/push-notifications/unsubscribe`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.USER_TOKEN}`,
        "Token-Type": "user",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.user.id }),
    },
  );
  if (response.ok) {
    return { success: true };
  }
  return { success: false };
}

export async function sendNotification(sub: PushSubscription, message: string) {
  try {
    await webpush.sendNotification(
      sub,
      JSON.stringify({
        title: "Test Notification",
        body: message,
        icon: "/icon-512x512.png",
      }),
    );
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send notification" };
  }
}
