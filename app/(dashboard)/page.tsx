import { getUser } from "@/actions/user";
import { DashboardMain } from "@/components/sections";
import { createCheckoutLink, hasSubscription } from "@/lib/stripe/stripe";
import Link from "next/link";

export default async function Home() {
  const user = await getUser();
  const hasSub = await hasSubscription(user);

  let checkoutLink;
  if (!hasSub && user.stripe_cust_id)
    checkoutLink = await createCheckoutLink(user.stripe_cust_id);

  return (
    <main className="container">
      {hasSub ? (
        <DashboardMain user={user} />
      ) : (
        checkoutLink && (
          <div className="bg-primary/5 dark:bg-secondary/30 p-4 rounded-lg flex items-center justify-center">
            <p>
              You don't have a subscription.{" "}
              <Link
                href={checkoutLink}
                className="cursor-pointer text-purple-400"
              >
                Click here
              </Link>{" "}
              to subscribe.
            </p>
          </div>
        )
      )}
    </main>
  );
}
