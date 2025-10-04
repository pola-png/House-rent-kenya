
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

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
            <CardContent className="prose max-w-none text-muted-foreground">
                <h2>1. Terms</h2>
                <p>By accessing this Website, accessible from www.houserent.co.ke, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>

                <h2>2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials on House Rent Kenya's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul>
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose or for any public display;</li>
                    <li>attempt to reverse engineer any software contained on House Rent Kenya's Website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transferring the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
                <p>This will let House Rent Kenya to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format.</p>
                
                <h2>3. Disclaimer</h2>
                <p>All the materials on House Rent Kenya’s Website are provided "as is". House Rent Kenya makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, House Rent Kenya does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>

                <h2>4. Limitations</h2>
                <p>House Rent Kenya or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on House Rent Kenya’s Website, even if House Rent Kenya or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>

                <h2>5. Governing Law</h2>
                <p>Any claim related to House Rent Kenya's Website shall be governed by the laws of Kenya without regards to its conflict of law provisions.</p>
            </CardContent>
        </Card>
    </div>
  );
}
