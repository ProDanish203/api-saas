import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const { handlers, auth } = NextAuth({
  ...authOptions,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        if (account?.provider === "google") {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email! },
            update: {
              name: user.name as string,
              image: user.image,
              emailVerified: new Date(),
            },
            create: {
              email: user.email!,
              name: user.name!,
              image: user.image,
              emailVerified: new Date(),
              password: "",
            },
          });
          token.id = dbUser.id;
        } else {
          token.id = user.id;
        }
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect after sign in
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return baseUrl + url;
      return baseUrl;
    },
  },
});
