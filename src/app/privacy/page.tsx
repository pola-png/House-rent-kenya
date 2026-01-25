
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | House Rent Kenya',
  description: 'Learn how House Rent Kenya collects, uses, and protects your personal information. Our comprehensive privacy policy covers data collection, cookies, and your rights.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Your privacy is important to us. This policy outlines how we collect, use, and protect your data.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Our Commitment to Your Privacy</CardTitle>
                <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
                    <p>Welcome to House Rent Kenya ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website houserent.co.ke and use our services.</p>
                </section>
                
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
                    <h3 className="text-lg font-medium text-foreground mb-2">Personal Information</h3>
                    <p>We collect personal information that you voluntarily provide to us when you:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Register for an account</li>
                        <li>List a property</li>
                        <li>Contact us or other users</li>
                        <li>Subscribe to our newsletter</li>
                        <li>Participate in surveys or promotions</li>
                    </ul>
                    <p>This may include: names, email addresses, phone numbers, physical addresses, payment information, and property details.</p>
                    
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Automatically Collected Information</h3>
                    <p>We automatically collect certain information when you visit our website, including:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>IP address and location data</li>
                        <li>Browser type and version</li>
                        <li>Device information</li>
                        <li>Pages visited and time spent</li>
                        <li>Referring website</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Provide and maintain our services</li>
                        <li>Process transactions and payments</li>
                        <li>Send administrative information and updates</li>
                        <li>Respond to your inquiries and provide customer support</li>
                        <li>Improve our website and services</li>
                        <li>Prevent fraud and enhance security</li>
                        <li>Comply with legal obligations</li>
                        <li>Send marketing communications (with your consent)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">4. Cookies and Tracking Technologies</h2>
                    <p>We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Remember your preferences and settings</li>
                        <li>Analyze website traffic and usage patterns</li>
                        <li>Provide personalized content and advertisements</li>
                        <li>Improve website functionality</li>
                    </ul>
                    <p>You can control cookie settings through your browser preferences. However, disabling cookies may affect website functionality.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Services and Advertising</h2>
                    <p>We may use third-party services for analytics, advertising, and other business purposes, including:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>Google Analytics:</strong> To analyze website usage and improve our services</li>
                        <li><strong>Google AdSense:</strong> To display relevant advertisements on our website</li>
                        <li><strong>Social Media Platforms:</strong> For social sharing and marketing</li>
                        <li><strong>Payment Processors:</strong> To handle secure transactions</li>
                    </ul>
                    <p>These third parties may collect information about your online activities across different websites. Please review their privacy policies for more information about their data practices.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">6. Information Sharing and Disclosure</h2>
                    <p>We may share your information in the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
                        <li><strong>Service providers:</strong> With trusted third parties who assist in operating our website</li>
                        <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                        <li><strong>Business transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                        <li><strong>Public listings:</strong> Property information you choose to make public</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Security</h2>
                    <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">8. Your Rights and Choices</h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Access and update your personal information</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Restrict or object to certain data processing</li>
                        <li>Data portability (where applicable)</li>
                    </ul>
                    <p>To exercise these rights, please contact us at privacy@houserent.co.ke.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">9. Data Retention</h2>
                    <p>We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">10. Children's Privacy</h2>
                    <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us immediately.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">11. International Data Transfers</h2>
                    <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">12. Changes to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
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
