
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

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
            <CardContent className="prose max-w-none text-muted-foreground">
                <h2>1. Introduction</h2>
                <p>Welcome to House Rent Kenya. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@houserent.co.ke.</p>
                
                <h2>2. Information We Collect</h2>
                <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.</p>
                <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
                <ul>
                    <li><strong>Personal Information Provided by You.</strong> We collect names; phone numbers; email addresses; mailing addresses; job titles; usernames; passwords; contact preferences; and other similar information.</li>
                    <li><strong>Payment Data.</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a M-Pesa transaction code), and the security code associated with your payment instrument. All payment data is stored by our payment processor and you should review its privacy policies and contact the payment processor directly to respond to your questions.</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                <ul>
                    <li>To facilitate account creation and logon process.</li>
                    <li>To post testimonials on our website with your consent.</li>
                    <li>To send administrative information to you.</li>
                    <li>To protect our Services from fraud monitoring and prevention.</li>
                    <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
                </ul>

                <h2>4. Will Your Information Be Shared With Anyone?</h2>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, Legal Obligations.</p>

                <h2>5. How Long Do We Keep Your Information?</h2>
                <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).</p>
            </CardContent>
        </Card>
    </div>
  );
}
