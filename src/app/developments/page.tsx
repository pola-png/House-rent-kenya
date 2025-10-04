
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import placeholderImages from "@/lib/placeholder-images.json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const developments = [
  {
    id: 1,
    title: "Riverside Square",
    location: "Riverside, Nairobi",
    priceRange: "From Ksh 12M",
    description: "Experience luxury living with stunning river views. A mix of 1, 2, and 3-bedroom apartments with world-class amenities.",
    imageId: "hero_main",
    status: "Selling Fast",
  },
  {
    id: 2,
    title: "Diani Beach Villas",
    location: "Diani, Kwale",
    priceRange: "From Ksh 25M",
    description: "Exclusive beachfront villas offering a serene and luxurious coastal lifestyle. Private pools and direct beach access.",
    imageId: "city_mombasa",
    status: "New Release",
  },
  {
    id: 3,
    title: "Kilimani Heights",
    location: "Kilimani, Nairobi",
    priceRange: "From Ksh 8.5M",
    description: "Modern apartments in the heart of Kilimani. Perfect for urban professionals seeking convenience and style.",
    imageId: "property_3_1",
    status: "Under Construction",
  },
   {
    id: 4,
    title: "The Lavington Grand",
    location: "Lavington, Nairobi",
    priceRange: "From Ksh 18M",
    description: "Elegant townhouses with spacious gardens, ideal for families. Located in a secure and prestigious neighborhood.",
    imageId: "property_2_1",
    status: "Selling Fast",
  },
  {
    id: 5,
    title: "Nakuru Golf Estate",
    location: "Nakuru",
    priceRange: "From Ksh 15M",
    description: "A premier gated community centered around a lush golf course. Offering a tranquil and secure environment for your family.",
    imageId: "city_nakuru",
    status: "New Release",
  },
   {
    id: 6,
    title: "Runda Paradise",
    location: "Runda, Nairobi",
    priceRange: "From Ksh 45M",
    description: "Luxurious ambassadorial homes in one of Nairobi's most exclusive suburbs. Unmatched elegance and privacy.",
    imageId: "property_4_1",
    status: "Limited Units",
  },
];

export default function DevelopmentsPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Building className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline">New Developments</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover the latest and most exciting new property developments in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developments.map((dev) => {
            const image = placeholderImages.placeholderImages.find(img => img.id === dev.imageId);
            return (
              <Card key={dev.id} className="flex flex-col overflow-hidden group">
                <Link href="#" className="block">
                  <div className="relative h-60 w-full">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={dev.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Badge variant="secondary" className="absolute top-3 left-3">{dev.status}</Badge>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-2xl font-headline">{dev.title}</h3>
                        <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1.5"/>
                            <span>{dev.location}</span>
                        </div>
                    </div>
                  </div>
                </Link>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <p className="text-muted-foreground flex-grow mb-4">{dev.description}</p>
                   <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm text-muted-foreground">Starting From</p>
                            <p className="font-bold text-lg text-primary">{dev.priceRange}</p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="#">
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                   </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
