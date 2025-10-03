
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function DevelopmentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Building className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">New Developments</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover the latest and most exciting new property developments in Kenya.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>This page is under construction. Check back soon for new developments!</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Functionality for new developments will be implemented here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
