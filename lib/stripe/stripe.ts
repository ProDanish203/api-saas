import Stripe from "stripe";
import { prisma } from "../db";
import { User } from "@prisma/client";

export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY!), {
  apiVersion: "2025-01-27.acacia",
  typescript: true,
});

export const hasSubscription = async (user: User) => {
  if (!user.stripe_cust_id) return false;
  const subscriptions = await stripe.subscriptions.list({
    customer: user.stripe_cust_id,
  });

  return subscriptions.data.length > 0;
};

export const createCheckoutLink = async () => {};

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
  }
};
