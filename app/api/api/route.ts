import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe/stripe";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const API_HEADER = req.headers.get("API-KEY");
    if (!API_HEADER)
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 401 }
      );

    const user = await prisma.user.findFirst({
      where: {
        api_key: API_HEADER,
      },
    });

    if (!user || !user.stripe_cust_id)
      return NextResponse.json(
        { success: false, message: "Unauthorized request" },
        { status: 401 }
      );

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_cust_id,
      status: "active",
      limit: 1,
      expand: ["data.items"],
    });

    if (!subscriptions.data.length) {
      return NextResponse.json(
        { success: false, message: "No active subscription found" },
        { status: 403 }
      );
    }

    const item = subscriptions.data[0].items.data[0];

    if (!item)
      return NextResponse.json(
        { success: false, message: "No subscription found" },
        { status: 404 }
      );

    const meterEvent = await stripe.billing.meterEvents.create({
      event_name: "api_access",
      payload: {
        stripe_customer_id: user.stripe_cust_id,
        value: "1",
        timestamp: new Date().toISOString(),
      },
    });

    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: user.stripe_cust_id,
    });

    const usageLineItem = upcomingInvoice.lines.data.find(
      (line) =>
        line.type === "subscription" &&
        line.price?.recurring?.usage_type === "metered"
    );

    if (!upcomingInvoice || !upcomingInvoice.next_payment_attempt)
      return NextResponse.json(
        { success: false, message: "No upcoming invoice found" },
        { status: 404 }
      );

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Create a metered usage record in db
    const usage = await prisma.apiUsage.upsert({
      where: {
        userId_month: {
          userId: user.id,
          month: startOfMonth,
        },
      },
      create: {
        userId: user.id,
        month: startOfMonth,
        hit_count: 1,
        cost: item.price.unit_amount! || 0,
      },
      update: {
        hit_count: {
          increment: 1,
        },
      },
    });

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      data: {
        totalUsage: usage.hit_count,
        totalAmountDue: usage.hit_count * (usage.cost / 100),
        usage: {
          totalUsage: usageLineItem?.quantity || 0,
          amountDue: upcomingInvoice.amount_remaining / 100,
          nextInvoiceDate: new Date(
            upcomingInvoice.next_payment_attempt * 1000
          ),
        },
      },
    });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
};
