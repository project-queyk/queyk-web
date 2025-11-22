import NextAuth from "next-auth";
import { jwtDecode } from "jwt-decode";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { UserData } from "@/types/auth";
import { signInBackendAction } from "@/lib/auth-actions";
import { GoogleToken, UserWithSub } from "@/lib/types/oauth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Google One Tap",
      credentials: {
        credential: { label: "Credential", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.credential) {
            throw new Error("AccessDenied");
          }

          const decoded = jwtDecode<GoogleToken>(
            credentials.credential as string,
          );

          if (!decoded.email?.endsWith(process.env.AUTH_EMAIL_DOMAIN!)) {
            throw new Error("AccessDenied");
          }

          return {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            image: decoded.picture,
            sub: decoded.sub,
          };
        } catch (error) {
          if (error instanceof Error && error.message === "AccessDenied") {
            throw new Error("AccessDenied");
          }
          throw new Error("Callback");
        }
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      const { profile, user, account } = params;

      if (account?.provider === "credentials") {
        try {
          const oauthProfile = {
            sub: (user as UserWithSub).sub,
            email: user?.email,
            name: user?.name,
            picture: user?.image,
          };
          await signInBackendAction(oauthProfile);
          return true;
        } catch {
          return false;
        }
      }

      try {
        if (!profile) {
          return false;
        }
        if (!profile.email?.endsWith(process.env.AUTH_EMAIL_DOMAIN!)) {
          return false;
        }
        await signInBackendAction(profile);
        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, profile, user, account }) {
      if (account?.provider === "credentials" && user) {
        try {
          const oauthProfile = {
            sub: (user as UserWithSub).sub,
            email: user?.email,
            name: user?.name,
            picture: user?.image,
          };
          const userData = await signInBackendAction(oauthProfile);
          token.userData = userData.data;
        } catch {
          return token;
        }
      } else if (profile) {
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
