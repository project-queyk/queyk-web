import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { UserData } from "./types/auth";
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
    async jwt({ token, profile }) {
      if (profile) {
        const userData = await signInBackendAction(profile);
        token.userData = userData.data;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userData) {
        const userData = token.userData as UserData;
        return {
          ...session,
          user: {
            ...session.user,
            id: userData.id,
            role: userData.role,
            alertNotification: userData.alertNotification,
            oauthId: userData.oauthId,
            smsNotification: userData.smsNotification,
            phoneNumber: userData.phoneNumber,
          },
        };
      }
      return session;
    },
  },
  pages: { signIn: "/signin", error: "/error" },
});
