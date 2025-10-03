
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rss } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Rss className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Blog</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Insights, tips, and news from the Kenyan real estate market.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>This page is under construction. Check back soon for blog posts!</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Blog functionality will be implemented here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
