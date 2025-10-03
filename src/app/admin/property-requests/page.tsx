
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function PropertyRequestsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6" />
          Property Requests
        </CardTitle>
        <CardDescription>
          Track requests from users looking for specific types of properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Property request tracking will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
