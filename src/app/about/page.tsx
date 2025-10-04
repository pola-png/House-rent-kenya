
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Info className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">About Us</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Learn more about our mission and team.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This page is under construction. Information about the company will be displayed here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
