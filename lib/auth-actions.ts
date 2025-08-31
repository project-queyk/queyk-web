"use server";

import { Profile } from "next-auth";
import { signIn, signOut } from "@/auth";

import { BackendUserResponse } from "@/types/auth";

export async function signInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/signin" });
}

export async function signOutRootAction() {
  await signOut({ redirectTo: "/" });
}

export async function signInBackendAction(
  profile: Profile,
): Promise<BackendUserResponse> {
  const userValues = {
    email: profile.email,
    name: profile.name,
    oauthId: profile.sub,
    profileImage: profile.picture,
  };

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/v1/api/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        "Content-Type": "application/json",
        "Token-Type": "auth",
      },
      body: JSON.stringify(userValues),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Backend authentication failed: ${error.message}`);
    }
    throw new Error("Backend authentication failed: Unknown error occurred");
  }
}
