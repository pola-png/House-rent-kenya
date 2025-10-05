
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Construction } from "lucide-react";

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
        <div className="text-center py-12 text-muted-foreground">
            <Construction className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold">This feature is under construction.</p>
            <p className="text-sm">A system for managing client property requests is coming soon.</p>
          </div>
      </CardContent>
    </Card>
  );
}
