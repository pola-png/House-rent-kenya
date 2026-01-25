import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | House Rent Kenya',
  description: 'Learn about how House Rent Kenya uses cookies and similar technologies to improve your browsing experience.',
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Cookie className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Cookie Policy</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Learn how we use cookies and similar technologies on our website.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Our Cookie Policy</CardTitle>
                <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">1. What Are Cookies?</h2>
                    <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and analyzing how you use our site.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">2. Types of Cookies We Use</h2>
                    
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Essential Cookies</h3>
                    <p>These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and form submissions.</p>
                    
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Analytics Cookies</h3>
                    <p>We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience. We use Google Analytics to collect this information.</p>
                    
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Advertising Cookies</h3>
                    <p>These cookies are used to deliver relevant advertisements to you. They may be set by our advertising partners, including Google AdSense, to build a profile of your interests and show you relevant ads on other sites.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">3. Third-Party Cookies</h2>
                    <p>We may allow third-party companies to set cookies on our website for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                        <li><strong>Google AdSense:</strong> To display relevant advertisements</li>
                        <li><strong>Social Media Platforms:</strong> To enable social sharing features</li>
                        <li><strong>Payment Processors:</strong> To facilitate secure transactions</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">4. Managing Your Cookie Preferences</h2>
                    <p>You have several options for managing cookies:</p>
                    
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Browser Settings</h3>
                    <p>Most web browsers allow you to control cookies through their settings. You can:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Block all cookies</li>
                        <li>Block third-party cookies</li>
                        <li>Delete existing cookies</li>
                        <li>Set preferences for specific websites</li>
                    </ul>
                    
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Opt-Out Links</h3>
                    <p>You can opt out of certain third-party cookies:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                        <li>Google Ads: <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a></li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">5. Impact of Disabling Cookies</h2>
                    <p>If you choose to disable cookies, some features of our website may not function properly. This may include:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Difficulty logging in or staying logged in</li>
                        <li>Loss of personalized settings</li>
                        <li>Reduced website functionality</li>
                        <li>Less relevant advertising</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact Us</h2>
                    <p>If you have any questions about our use of cookies, please contact us:</p>
                    <div className="bg-muted p-4 rounded-lg mt-3">
                        <p><strong>Email:</strong> privacy@houserent.co.ke</p>
                        <p><strong>Phone:</strong> +254 706 060 684</p>
                        <p><strong>Address:</strong> 123 Riverside Drive, Nairobi, Kenya</p>
                    </div>
                </section>
            </CardContent>
        </Card>
    </div>
  );
}