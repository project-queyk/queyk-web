"use server";

import { Profile } from "next-auth";
import { signIn, signOut } from "@/auth";

import { BackendUserResponse } from "@/types/auth";

export async function signInAction(formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const recaptchaResponse = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${rawFormData.recaptchaToken}`,
    },
  );
  const recaptchaData = await recaptchaResponse.json();

  if (!recaptchaData.success || recaptchaData.score < 0.5) {
    console.log("Recaptcha failed", JSON.stringify(recaptchaData, null, 2));
    throw new Error("Recaptcha failed");
  }

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
