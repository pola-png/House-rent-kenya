import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | House Rent Kenya',
  description: 'Read our comprehensive terms of service covering user responsibilities, platform usage, and legal agreements.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Terms of Service</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Please read our terms of service carefully before using our platform.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Website Terms and Conditions of Use</CardTitle>
                 <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none text-muted-foreground space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                    <p>By accessing and using House Rent Kenya ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
                    <p>House Rent Kenya is an online platform that connects property seekers with property owners, landlords, and real estate agents in Kenya. We provide a marketplace for property listings, search functionality, and communication tools.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">3. User Conduct and Responsibilities</h2>
                    <p>You agree not to use the Platform to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Post false, misleading, or fraudulent information</li>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Harass, abuse, or harm other users</li>
                        <li>Distribute spam, viruses, or malicious content</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Use automated tools to access or scrape our content</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">4. Property Listings and Content</h2>
                    <p>Users who post property listings agree that:</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>All information provided is accurate and truthful</li>
                        <li>They have the right to list the property</li>
                        <li>Photos and descriptions are current and representative</li>
                        <li>They will update or remove listings when no longer available</li>
                        <li>They comply with fair housing and anti-discrimination laws</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property Rights</h2>
                    <p>The Platform and its original content, features, and functionality are owned by House Rent Kenya and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                    <p>Users retain ownership of content they post but grant us a license to use, display, and distribute such content on the Platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">6. Privacy and Data Protection</h2>
                    <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform, to understand our practices regarding the collection and use of your information.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">7. Third-Party Services and Links</h2>
                    <p>Our Platform may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites. Use of third-party services is at your own risk.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">8. Disclaimers and Limitation of Liability</h2>
                    <p>The Platform is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.</p>
                    <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">9. Termination</h2>
                    <p>We may terminate or suspend your account and access to the Platform at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">10. Governing Law and Jurisdiction</h2>
                    <p>These Terms are governed by the laws of Kenya. Any disputes arising from these Terms or use of the Platform shall be subject to the exclusive jurisdiction of Kenyan courts.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Information</h2>
                    <p>If you have any questions about these Terms, please contact us:</p>
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