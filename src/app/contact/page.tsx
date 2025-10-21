
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Building, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Contact Us</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Have a question or need support? We're here to help. Reach out to us through any of the channels below.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                        <CardDescription>Fill out the form and our team will get back to you within 24 hours.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input id="first-name" placeholder="John" />
                            </div>
                             <div className="space-y-1.5">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input id="last-name" placeholder="Doe" />
                            </div>
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john.doe@example.com" />
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" />
                        </div>
                        <Button size="lg" className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline">Our Information</h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-muted rounded-full text-primary">
                             <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Our Office</h3>
                            <p className="text-muted-foreground">123 Riverside Drive, Nairobi, Kenya</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="p-3 bg-muted rounded-full text-primary">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Email Us</h3>
                            <p className="text-muted-foreground">For general inquiries: <a href="mailto:propertynyumba254@gmail.com" className="text-primary hover:underline">propertynyumba254@gmail.com</a></p>
                             <p className="text-muted-foreground">For support: <a href="mailto:propertynyumba254@gmail.com" className="text-primary hover:underline">propertynyumba254@gmail.com</a></p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="p-3 bg-muted rounded-full text-primary">
                            <Phone className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Call Us</h3>
                            <p className="text-muted-foreground">Mon - Fri, 9am - 5pm</p>
                            <p className="text-muted-foreground">+254706060684</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
