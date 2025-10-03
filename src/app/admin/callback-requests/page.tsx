
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall } from "lucide-react";

export default function CallbackRequestsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhoneCall className="h-6 w-6" />
          Callback Requests
        </CardTitle>
        <CardDescription>
          Manage requests from users who want you to call them back.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Callback request management will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
