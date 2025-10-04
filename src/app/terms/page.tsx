
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Terms of Service</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Please read our terms of service carefully.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This page is under construction. The terms of service will be detailed here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
