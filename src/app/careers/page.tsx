
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building, MapPin, Send } from "lucide-react";

const jobOpenings = [
    {
        title: "Senior Full-Stack Engineer",
        location: "Nairobi (Remote)",
        department: "Engineering",
    },
    {
        title: "Real Estate Partnership Manager",
        location: "Nairobi",
        department: "Business Development",
    },
    {
        title: "Digital Marketing Specialist",
        location: "Nairobi",
        department: "Marketing",
    }
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <Briefcase className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Join Our Team</h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                We're building the future of real estate in Kenya. Be a part of our journey to innovate and lead the market.
            </p>
        </div>

        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Current Openings</CardTitle>
                    <CardDescription>We are always looking for passionate and talented individuals. If you don't see a role that fits, feel free to send us your CV.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {jobOpenings.map((job, index) => (
                            <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                                <div>
                                    <h3 className="text-lg font-bold">{job.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                        <div className="flex items-center">
                                            <Building className="h-4 w-4 mr-1.5"/>
                                            {job.department}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1.5"/>
                                            {job.location}
                                        </div>
                                    </div>
                                </div>
                                <Button className="mt-4 md:mt-0">Apply Now</Button>
                            </div>
                        ))}

                         <div className="text-center p-6 bg-muted rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Don't See Your Role?</h3>
                            <p className="text-muted-foreground mb-4">We're always interested in hearing from talented people. Send us your resume!</p>
                            <Button variant="outline" asChild>
                                <a href="mailto:careers@houserent.co.ke">
                                    <Send className="h-4 w-4 mr-2"/>
                                    Submit Your CV
                                </a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
