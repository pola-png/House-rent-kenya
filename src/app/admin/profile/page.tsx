
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6" />
          Profile
        </CardTitle>
        <CardDescription>
          Manage your personal and agency profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">User profile management will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
