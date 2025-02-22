"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/middleware";
import { redirect } from "next/navigation";

export const getUser = async () => {
  const session = await auth();

  if (!session || !session.user) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) redirect("/login");

  return user;
};
