"use server";
import { prisma } from "@/lib/db";

export const getCurrentUsage = async (userId: string) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const usage = await prisma.apiUsage.findFirst({
    where: {
      userId,
      month: startOfMonth,
    },
  });

  if (!usage) throw new Error("No usage found");

  return usage;
};
