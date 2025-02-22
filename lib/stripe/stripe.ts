import Stripe from "stripe";
import { prisma } from "../db";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY!), {
  apiVersion: "2025-01-27.acacia",
  typescript: true,
});

export const hasSubscription = async (user: User) => {
  if (!user.stripe_cust_id) return false;
  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripe_cust_id,
  });

  const isSubscribed = subscriptions.data.length > 0;
  if (isSubscribed && !user.api_key) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        api_key: `api_key_${randomUUID()}`,
      },
    });
  }

  return isSubscribed;
};

export const createCheckoutLink = async (customerId: string) => {
  const checkout = await stripe.checkout.sessions.create({
    success_url: String(process.env.STRIPE_SUCCESS_URL),
    cancel_url: String(process.env.STRIPE_CANCEL_URL),
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: String(process.env.STRIPE_PRICE_ID),
      },
    ],
  });

  return checkout.url;
};

export const createCustomer = async (user: User) => {
  if (!user.stripe_cust_id) {
    const customer = await stripe.customers.create({
      email: String(user.email),
    });
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripe_cust_id: customer.id,
      },
    });
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    await prisma.apiUsage.create({
      data: {
        userId: user.id,
        month: startOfMonth,
        hit_count: 1,
        cost: 50,
      },
    });
  }

  return user.stripe_cust_id;
};
