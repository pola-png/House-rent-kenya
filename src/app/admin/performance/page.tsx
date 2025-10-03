
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart } from "lucide-react";

export default function PerformancePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AreaChart className="h-6 w-6" />
          Performance
        </CardTitle>
        <CardDescription>
          Analyze the performance of your listings with detailed analytics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Listing performance analytics will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
