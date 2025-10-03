
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function LeadsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-6 w-6" />
          Leads
        </CardTitle>
        <CardDescription>
          View and manage potential customer leads for your properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Lead management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
