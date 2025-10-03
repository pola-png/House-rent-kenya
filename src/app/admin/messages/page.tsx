
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Messages
        </CardTitle>
        <CardDescription>
          View and respond to messages from clients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Messaging functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
