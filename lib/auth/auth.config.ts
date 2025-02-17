import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        let user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          const hashedPassword = await bcrypt.hash(
            credentials.password as string,
            10
          );

          user = await prisma.user.create({
            data: {
              email: credentials.email as string,
              password: hashedPassword,
              name: (credentials.email as string).split("@")[0],
              emailVerified: new Date(),
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || "",
          image: user.image || "",
        };
      },
    }),
  ],
};
