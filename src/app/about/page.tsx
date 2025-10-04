
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Building, Info, Milestone, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <Info className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">About House Rent Kenya</h1>
            <p className="text-lg text-muted-foreground mt-4">
                We are dedicated to revolutionizing the property market in Kenya by simplifying the process of finding and renting homes.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
            <div>
                <h2 className="text-3xl font-bold font-headline mb-4">Our Mission</h2>
                <p className="text-muted-foreground text-lg mb-4">
                    Our mission is to create a seamless and transparent property rental experience for tenants, landlords, and agents across Kenya. We leverage technology to connect people with their ideal homes, providing a comprehensive and user-friendly platform that empowers our users with the information they need to make confident decisions.
                </p>
                 <p className="text-muted-foreground text-lg">
                    We believe that finding a home should be an exciting and stress-free journey. That's why we're committed to building a trusted community, offering verified listings, and providing exceptional support every step of the way.
                </p>
            </div>
             <div className="bg-muted p-8 rounded-lg">
                <Card className="bg-background">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-6 w-6 text-primary"/>
                            <span>Core Values</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Award className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold">Integrity</h4>
                                <p className="text-sm text-muted-foreground">We operate with honesty and transparency in all our dealings.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Building className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold">Innovation</h4>
                                <p className="text-sm text-muted-foreground">We continuously improve our platform to better serve our users.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 mt-1 text-primary"/>
                            <div>
                                <h4 className="font-semibold">Community</h4>
                                <p className="text-sm text-muted-foreground">We foster a supportive network of tenants, agents, and landlords.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
             </div>
        </div>

        <div>
            <h2 className="text-3xl font-bold font-headline text-center mb-10">Our Journey</h2>
             <div className="relative">
                <div className="absolute left-1/2 h-full w-0.5 bg-border -translate-x-1/2"></div>
                <div className="space-y-12">
                    <div className="flex justify-center items-center relative">
                        <div className="w-full md:w-5/12 lg:w-4/12 p-4">
                             <Card className="ml-auto">
                                <CardHeader>
                                    <CardTitle>2023 - The Idea</CardTitle>
                                    <CardDescription>House Rent Kenya was born from a desire to solve the challenges of navigating the Kenyan rental market.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-primary">
                            <Milestone className="h-6 w-6 text-primary"/>
                        </div>
                         <div className="hidden md:block w-5/12 lg:w-4/12 p-4"></div>
                    </div>
                     <div className="flex justify-center items-center relative">
                         <div className="hidden md:block w-5/12 lg:w-4/12 p-4"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-primary">
                            <Milestone className="h-6 w-6 text-primary"/>
                        </div>
                        <div className="w-full md:w-5/12 lg:w-4/12 p-4">
                             <Card>
                                <CardHeader>
                                    <CardTitle>2024 - Official Launch</CardTitle>
                                    <CardDescription>We launched our platform, connecting the first tenants with their new homes and partnering with leading agents.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                     <div className="flex justify-center items-center relative">
                        <div className="w-full md:w-5/12 lg:w-4/12 p-4">
                             <Card className="ml-auto">
                                <CardHeader>
                                    <CardTitle>The Future</CardTitle>
                                    <CardDescription>We are continuously expanding our features, growing our network, and innovating to remain Kenya's #1 property portal.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 bg-background p-2 rounded-full border-2 border-primary">
                            <Milestone className="h-6 w-6 text-primary"/>
                        </div>
                         <div className="hidden md:block w-5/12 lg:w-4/12 p-4"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
