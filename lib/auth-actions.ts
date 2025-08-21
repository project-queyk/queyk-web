"use server";

import { signIn, signOut } from "@/auth";
import { Profile } from "next-auth";

export async function signInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/signin" });
}

export async function signOutRootAction() {
  await signOut({ redirectTo: "/" });
}

export async function signInBackendAction(profile: Profile) {
  const userValues = {
    email: profile.email,
    name: profile.name,
    oauthId: profile.sub,
    profileImage: profile.picture,
    tokenType: "auth",
  };
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/v1/api/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userValues),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Backend authentication failed: ${error.message}`);
    }
    throw new Error("Backend authentication failed: Unknown error occurred");
  }
}
