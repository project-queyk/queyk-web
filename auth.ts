import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { signInBackendAction } from "./lib/auth-actions";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      const { profile } = params;
      try {
        if (
          !profile ||
          !profile.email?.endsWith(process.env.AUTH_EMAIL_DOMAIN!)
        ) {
          return false;
        }
        await signInBackendAction(profile);
        return true;
      } catch {
        return false;
      }
    },
  },
  pages: { signIn: "/signin", error: "/error" },
});
