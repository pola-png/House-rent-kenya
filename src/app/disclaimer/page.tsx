import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer | House Rent Kenya',
  description: 'Important disclaimers and limitations regarding the use of House Rent Kenya platform and services.',
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Disclaimer</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Important information about the use of our website and services.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Website Disclaimer</CardTitle>
                <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">1. General Information</h2>
                    <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, House Rent Kenya excludes all representations, warranties, obligations, and liabilities arising out of or in connection with the information provided on this website.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">2. Property Information Accuracy</h2>
                    <p>While we strive to ensure that property information on our platform is accurate and up-to-date, we cannot guarantee the completeness, accuracy, or reliability of any property listings, descriptions, prices, or availability. Property information is provided by third-party agents, landlords, and property owners.</p>
                    <p>Users should:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Verify all property details independently</li>
                        <li>Conduct physical inspections before making decisions</li>
                        <li>Confirm availability and pricing directly with property owners or agents</li>
                        <li>Seek professional advice when necessary</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">3. Third-Party Content</h2>
                    <p>Our website may contain content provided by third parties, including property listings, reviews, and advertisements. We do not endorse, guarantee, or assume responsibility for any third-party content. Users interact with third-party content at their own risk.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">4. Investment and Financial Advice</h2>
                    <p>Nothing on this website constitutes financial, investment, legal, or professional advice. Property investment decisions should be made after consulting with qualified professionals. We are not responsible for any financial losses or investment decisions made based on information from our platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
                    <p>To the maximum extent permitted by law, House Rent Kenya shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Use or inability to use our website or services</li>
                        <li>Reliance on information provided on the platform</li>
                        <li>Property transactions or rental agreements</li>
                        <li>Interactions with other users or third parties</li>
                        <li>Technical issues or website downtime</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">6. Advertising and Sponsored Content</h2>
                    <p>Our website may display advertisements and sponsored content from third parties. We do not endorse or guarantee any advertised products or services. Users should exercise caution and conduct their own research before engaging with advertisers.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact Information</h2>
                    <p>If you have any questions about this disclaimer, please contact us:</p>
                    <div className="bg-muted p-4 rounded-lg mt-3">
                        <p><strong>Email:</strong> legal@houserent.co.ke</p>
                        <p><strong>Phone:</strong> +254 706 060 684</p>
                        <p><strong>Address:</strong> 123 Riverside Drive, Nairobi, Kenya</p>
                    </div>
                </section>
            </CardContent>
        </Card>
    </div>
  );
}