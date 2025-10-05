
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2, Construction } from "lucide-react";

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
         <div className="text-center py-12 text-muted-foreground">
            <Construction className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold">This feature is under construction.</p>
            <p className="text-sm">Functionality for managing agents within your agency is coming soon.</p>
          </div>
      </CardContent>
    </Card>
  );
}
