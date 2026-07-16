import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { captureLead } from "./airtable";

export const authConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const authOptions: NextAuthOptions = {
  // Fallback keeps the site healthy before credentials are configured;
  // set a real NEXTAUTH_SECRET in production before enabling Google login.
  secret: process.env.NEXTAUTH_SECRET ?? "findost-demo-secret-set-NEXTAUTH_SECRET",
  providers: authConfigured
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : [],
  session: { strategy: "jwt" },
  events: {
    // Every Google sign-in becomes a CRM row.
    async signIn({ user, isNewUser }) {
      await captureLead({
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        source: isNewUser ? "google-signup" : "google-signin",
      });
    },
  },
};
