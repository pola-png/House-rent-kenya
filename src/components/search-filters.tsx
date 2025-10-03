"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";

const propertyTypes = ["Apartment", "House", "Townhouse", "Condo", "Villa"];
const amenities = [
  "Swimming Pool", "Gym", "Garden", "Parking", "Pet Friendly", "Furnished"
];

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([50000, 500000]);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <SlidersHorizontal className="h-5 w-5" />
          Filter Properties
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Keyword..." className="pl-10" />
        </div>
        
        <Accordion type="multiple" defaultValue={['type', 'price']} className="w-full">
          <AccordionItem value="type">
            <AccordionTrigger className="font-bold">Property Type</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {propertyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="price">
            <AccordionTrigger className="font-bold">Price Range</AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Ksh {priceRange[0].toLocaleString()}</span>
                <span>Ksh {priceRange[1].toLocaleString()}</span>
              </div>
              <Slider
                defaultValue={priceRange}
                max={1000000}
                step={10000}
                onValueChange={(value) => setPriceRange(value)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="beds">
            <AccordionTrigger className="font-bold">Bedrooms</AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button key={num} variant="outline" size="sm">{num} {num > 1 ? 'Beds' : 'Bed'}</Button>
                ))}
                 <Button variant="outline" size="sm">5+ Beds</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="baths">
            <AccordionTrigger className="font-bold">Bathrooms</AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button key={num} variant="outline" size="sm">{num} {num > 1 ? 'Baths' : 'Bath'}</Button>
                ))}
                 <Button variant="outline" size="sm">5+ Baths</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="amenities">
            <AccordionTrigger className="font-bold">Amenities</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox id={`amenity-${amenity}`} />
                  <Label htmlFor={`amenity-${amenity}`} className="font-normal">{amenity}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col gap-2">
          <Button size="lg">Apply Filters</Button>
          <Button variant="ghost">Clear Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
