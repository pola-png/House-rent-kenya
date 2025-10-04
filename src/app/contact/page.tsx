
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Contact Us</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                We'd love to hear from you.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This page is under construction. A contact form and contact details will be displayed here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
