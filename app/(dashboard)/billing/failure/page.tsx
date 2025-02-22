import { XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BillingFailurePage = () => {
  return (
    <div className="container mx-auto py-12 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Payment Failed</CardTitle>
          <CardDescription className="text-center">
            There was an issue processing your payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <XCircle className="w-24 h-24 text-red-500 mb-4" />

          <p className="text-center text-muted-foreground">
            Please try again or contact support if the issue persists.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingFailurePage;
