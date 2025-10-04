
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Briefcase className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Careers</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Join our team and help us build the future of real estate.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This page is under construction. Job openings will be listed here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
