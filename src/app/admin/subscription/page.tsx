
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function SubscriptionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          Subscription
        </CardTitle>
        <CardDescription>
          View and manage your subscription plan and billing details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Subscription and billing management will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
