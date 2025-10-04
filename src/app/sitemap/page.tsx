
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Map className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Sitemap</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Navigate our website with ease.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Website Sitemap</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This page is under construction. A sitemap will be generated here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
