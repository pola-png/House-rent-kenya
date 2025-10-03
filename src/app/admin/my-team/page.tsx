
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2 } from "lucide-react";

export default function MyTeamPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users2 className="h-6 w-6" />
          My Team
        </CardTitle>
        <CardDescription>
          Manage your team members and their roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Team management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
