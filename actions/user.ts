"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/middleware";

export const getUser = async () => {
  const session = await auth();

  if (!session || !session.user) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) throw new Error("User not found");

  return user;
};
