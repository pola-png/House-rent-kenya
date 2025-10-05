
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Construction } from "lucide-react";

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
        <div className="text-center py-12 text-muted-foreground">
            <Construction className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold">This feature is under construction.</p>
            <p className="text-sm">Advanced lead management tools are coming soon.</p>
          </div>
      </CardContent>
    </Card>
  );
}
