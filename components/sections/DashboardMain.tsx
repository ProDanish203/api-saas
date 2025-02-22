"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Loader2Icon } from "lucide-react";
import { ApiUsage, User } from "@prisma/client";
import { Badge } from "../ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUsage } from "@/actions/usage";

interface DashboardMainProps {
  user: User;
}

export const DashboardMain: React.FC<DashboardMainProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!user.api_key) return;
    navigator.clipboard.writeText(user.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: usage, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUsage(user.id),
  });

  if (isLoading)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2Icon className="animate-spin text-xl" />
      </div>
    );

  return (
    <div className="">
      <div className="bg-green-500 dark:bg-green-700 text-white p-4 rounded-lg">
        You have a subscription.
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            Your API Key
            {usage && (
              <Badge className="bg-green-800 hover:bg-green-900 text-white">
                Total Hits: {usage.hit_count}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Use this key to authenticate your API requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={user.api_key || "No API key found"}
              readOnly
              className="font-mono bg-muted outline-none focus-visible:ring-0"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy API key</span>
            </Button>
          </div>
          {copied && (
            <p className="text-xs text-green-400 text-muted-foreground">
              API key copied to clipboard!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
