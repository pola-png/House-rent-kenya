"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Bed, Bath, Maximize, MapPin } from "lucide-react";
import Image from "next/image";
import type { Property } from "@/lib/types";

interface PropertyComparisonProps {
  properties: Property[];
}

export function PropertyComparison({ properties }: PropertyComparisonProps) {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

  const addToComparison = (property: Property) => {
    if (selectedProperties.length < 3 && !selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const removeFromComparison = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };

  if (selectedProperties.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select up to 3 properties to compare</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Properties ({selectedProperties.length}/3)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedProperties.map((property) => (
            <div key={property.id} className="relative border rounded-lg p-4">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeFromComparison(property.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="space-y-3">
                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  {property.images[0] ? (
                    <Image src={property.images[0]} alt={property.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="bg-muted h-full flex items-center justify-center">No Image</div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold truncate">{property.title}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {property.location}
                  </div>
                </div>

                <div className="text-lg font-bold text-primary">
                  Ksh {property.price.toLocaleString()}
                  {property.status === 'For Rent' && <span className="text-sm font-normal">/month</span>}
                </div>

                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3" />
                    {property.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3" />
                    {property.bathrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-3 w-3" />
                    {property.area} ft²
                  </div>
                </div>

                <Badge variant="outline">{property.status}</Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
          <Button variant="outline" onClick={() => setSelectedProperties([])}>
            Clear All
          </Button>
          <Button>View Detailed Comparison</Button>
        </div>
      </CardContent>
    </Card>
  );
}