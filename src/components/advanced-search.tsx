"use client";

import { useState } from "react";
import { Search, MapPin, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function AdvancedSearch() {
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [50000, 500000],
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [] as string[],
    furnished: false,
    parking: false,
    petFriendly: false
  });

  const amenitiesList = [
    "Swimming Pool", "Gym", "Security", "Generator", "WiFi", 
    "Air Conditioning", "Balcony", "Garden", "Elevator"
  ];

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Advanced Search</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Location (e.g., Kilimani, Westlands)"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="pl-10"
            />
          </div>

          <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.bedrooms} onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Price Range: Ksh {filters.priceRange[0].toLocaleString()} - Ksh {filters.priceRange[1].toLocaleString()}</label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
            max={1000000}
            min={10000}
            step={10000}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((amenity) => (
              <Badge
                key={amenity}
                variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleAmenity(amenity)}
              >
                {amenity}
                {filters.amenities.includes(amenity) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="furnished"
              checked={filters.furnished}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, furnished: !!checked }))}
            />
            <label htmlFor="furnished" className="text-sm">Furnished</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="parking"
              checked={filters.parking}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, parking: !!checked }))}
            />
            <label htmlFor="parking" className="text-sm">Parking</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="petFriendly"
              checked={filters.petFriendly}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, petFriendly: !!checked }))}
            />
            <label htmlFor="petFriendly" className="text-sm">Pet Friendly</label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            Search Properties
          </Button>
          <Button variant="outline" onClick={() => setFilters({
            location: "",
            priceRange: [50000, 500000],
            propertyType: "",
            bedrooms: "",
            bathrooms: "",
            amenities: [],
            furnished: false,
            parking: false,
            petFriendly: false
          })}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}