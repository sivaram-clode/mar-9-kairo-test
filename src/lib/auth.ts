import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  // Trust the Host header — required behind reverse proxies (Cloudflare Tunnel, etc.)
  // In NextAuth v4 this is undocumented but works; also set NEXTAUTH_URL correctly.
  ...(process.env.NEXTAUTH_TRUST_HOST === "true" && {
    cookies: {
      sessionToken: {
        name: process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax" as const,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
      csrfToken: {
        name: process.env.NODE_ENV === "production"
          ? "__Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
        options: {
          httpOnly: true,
          sameSite: "lax" as const,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
  }),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
