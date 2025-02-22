import { Header, Sidebar } from "@/components/shared";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API SaaS",
  description:
    "API SaaS is a platform for managing your APIs. It allows you to create, update, and delete APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header />
        <Separator />
        <div className="overflow-auto">
          <div className="container max-md:px-2 flex-1 py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
