
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon, Home, Building, FileText, User, Star, Phone, Newspaper, Briefcase, Mail, Shield, Book } from "lucide-react";
import Link from "next/link";

const mainLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search?type=rent', label: 'To Rent', icon: Home },
  { href: '/search?type=buy', label: 'For Sale', icon: Building },
  { href: '/developments', label: 'Developments', icon: Building },
  { href: '/advice', label: 'Property Advice', icon: Newspaper },
  { href: '/agents', label: 'Find Agents', icon: User },
  { href: '/blog', label: 'Blog', icon: Book },
];

const agentLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: User },
    { href: '/admin/properties/new', label: 'Post a Property', icon: Star },
    { href: '/admin/properties', label: 'My Listings', icon: FileText },
    { href: '/admin/callback-requests', label: 'Callback Requests', icon: Phone },
    { href: '/admin/subscription', label: 'Subscription', icon: Star },
];

const companyLinks = [
  { href: '/about', label: 'About Us', icon: Building },
  { href: '/contact', label: 'Contact Us', icon: Mail },
  { href: '/careers', label: 'Careers', icon: Briefcase },
  { href: '/terms', label: 'Terms of Service', icon: FileText },
  { href: '/privacy', label: 'Privacy Policy', icon: Shield },
];


export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <MapIcon className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Sitemap</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                An overview of our website's structure. Use these links to navigate to any page.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Main Pages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {mainLinks.map(link => (
                        <Button key={link.href} variant="ghost" className="w-full justify-start" asChild>
                             <Link href={link.href}>
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Link>
                        </Button>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Agent Pages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                     {agentLinks.map(link => (
                        <Button key={link.href} variant="ghost" className="w-full justify-start" asChild>
                             <Link href={link.href}>
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Link>
                        </Button>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Company & Legal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                     {companyLinks.map(link => (
                        <Button key={link.href} variant="ghost" className="w-full justify-start" asChild>
                             <Link href={link.href}>
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Link>
                        </Button>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
