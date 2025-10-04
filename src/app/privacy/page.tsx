
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Your privacy is important to us.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This page is under construction. The privacy policy will be detailed here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
