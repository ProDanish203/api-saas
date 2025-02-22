import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BillingSuccessPage = () => {
  return (
    <div className="container mx-auto py-12 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Payment Successful
          </CardTitle>
          <CardDescription className="text-center">
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
          <p className="text-center text-muted-foreground">
            Thank you for your purchase. Your account has been updated.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSuccessPage;
