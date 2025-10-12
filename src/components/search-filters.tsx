
"use client";

import { useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; 

const propertyTypes = ["Apartment", "House", "Townhouse", "Condo", "Villa"];
const amenitiesList = [
  "Swimming Pool", "Gym", "Garden", "Parking", "Pet Friendly", "Furnished"
];

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current values from URL
  const urlKeyword = searchParams.get('q') || '';
  const urlMinPrice = searchParams.get('min_price');
  const urlMaxPrice = searchParams.get('max_price');
  const propertyTypeParam = searchParams.get('property_type');
  const propertyTypeParams = searchParams.getAll('property_type');
  const allSelectedTypes = propertyTypeParam ? [propertyTypeParam, ...propertyTypeParams.filter(p => p !== propertyTypeParam)] : propertyTypeParams;
  const selectedTypes = allSelectedTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1).toLowerCase());
  const selectedBeds = searchParams.get('beds');
  const selectedBaths = searchParams.get('baths');
  const selectedAmenities = searchParams.getAll('amenities');
  
  // State for immediate input, initialized from URL
  const [keyword, setKeyword] = useState(urlKeyword);
  const [priceRange, setPriceRange] = useState([
    urlMinPrice ? parseInt(urlMinPrice, 10) : 0,
    urlMaxPrice ? parseInt(urlMaxPrice, 10) : 1000000
  ]);
  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedPriceRange = useDebounce(priceRange, 500);
  
  // Sync state when URL changes (from external navigation)
  useEffect(() => {
    if (urlKeyword !== keyword) setKeyword(urlKeyword);
  }, [urlKeyword]);
  
  useEffect(() => {
    const newMin = urlMinPrice ? parseInt(urlMinPrice, 10) : 0;
    const newMax = urlMaxPrice ? parseInt(urlMaxPrice, 10) : 1000000;
    if (newMin !== priceRange[0] || newMax !== priceRange[1]) {
      setPriceRange([newMin, newMax]);
    }
  }, [urlMinPrice, urlMaxPrice]);
  
  const createQueryString = useCallback((paramsToUpdate: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key); // Clear existing values for this key
        value.forEach(v => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });
    return params.toString();
  }, [searchParams]);

  useEffect(() => {
    if (debouncedKeyword !== urlKeyword && keyword === debouncedKeyword) {
      router.push(pathname + '?' + createQueryString({ q: debouncedKeyword || null }), { scroll: false });
    }
  }, [debouncedKeyword]);

  useEffect(() => {
    const currentMin = urlMinPrice ? parseInt(urlMinPrice, 10) : 0;
    const currentMax = urlMaxPrice ? parseInt(urlMaxPrice, 10) : 1000000;
    if (debouncedPriceRange[0] !== currentMin || debouncedPriceRange[1] !== currentMax) {
      router.push(pathname + '?' + createQueryString({ 
        min_price: debouncedPriceRange[0] > 0 ? String(debouncedPriceRange[0]) : null, 
        max_price: debouncedPriceRange[1] < 1000000 ? String(debouncedPriceRange[1]) : null 
      }), { scroll: false });
    }
  }, [debouncedPriceRange, urlMinPrice, urlMaxPrice, pathname, router, createQueryString]);

  const handleCheckboxChange = (key: string, value: string, checked: boolean) => {
    const currentValues = searchParams.getAll(key);
    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    router.push(pathname + '?' + createQueryString({ [key]: newValues }), { scroll: false });
  };
  
  const handleRadioChange = (key: string, value: string | null) => {
    router.push(pathname + '?' + createQueryString({ [key]: value }), { scroll: false });
  };

  const clearFilters = () => {
    // Preserve listing type (rent/buy) from home page when clearing filters
    const listingType = searchParams.get('type');
    const preservedParams = listingType ? `?type=${listingType}` : '';
    router.push(pathname + preservedParams, { scroll: false });
    setKeyword('');
    setPriceRange([0, 1000000]);
  };


  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-headline">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filter Properties</span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4"/>
              Clear
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Show active filters from home page */}
        {(searchParams.get('q') || searchParams.get('beds') || searchParams.get('min_price') || searchParams.get('max_price') || selectedTypes.length > 0) && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs font-medium text-blue-800 mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-1">
              {searchParams.get('q') && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  "{searchParams.get('q')}"
                </span>
              )}
              {selectedTypes.map(type => (
                <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
              {searchParams.get('beds') && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {searchParams.get('beds')}+ beds
                </span>
              )}
              {(searchParams.get('min_price') || searchParams.get('max_price')) && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  Ksh {searchParams.get('min_price') || '0'} - {searchParams.get('max_price') || '1M+'}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search location, property type..." 
              className="pl-10" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          {keyword && (
            <div className="text-xs text-muted-foreground">
              Searching for: <span className="font-medium">"{keyword}"</span>
            </div>
          )}
        </div>
        
        <Accordion type="multiple" defaultValue={['type', 'price']} className="w-full">
          <AccordionItem value="type">
            <AccordionTrigger className="font-bold">Property Type</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {propertyTypes.map((type) => {
                const isChecked = selectedTypes.includes(type);
                return (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleCheckboxChange('property_type', type.toLowerCase(), !!checked)}
                    />
                    <Label htmlFor={`type-${type}`} className="font-normal">{type}</Label>
                  </div>
                );
              })
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
                value={priceRange}
                max={1000000}
                min={0}
                step={10000}
                onValueChange={setPriceRange}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="beds">
            <AccordionTrigger className="font-bold">Bedrooms</AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button 
                    key={num} 
                    variant={selectedBeds === String(num) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRadioChange('beds', selectedBeds === String(num) ? null : String(num))}
                    >
                      {num}+ Bed{num !== 1 ? 's' : ''}
                    </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="baths">
            <AccordionTrigger className="font-bold">Bathrooms</AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="flex flex-wrap gap-2">
                 {[1, 2, 3, 4, 5].map((num) => (
                  <Button 
                    key={num} 
                    variant={selectedBaths === String(num) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRadioChange('baths', selectedBaths === String(num) ? null : String(num))}
                    >
                      {num}+ Bath{num !== 1 ? 's' : ''}
                    </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="amenities">
            <AccordionTrigger className="font-bold">Amenities</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={(checked) => handleCheckboxChange('amenities', amenity, !!checked)}
                  />
                  <Label htmlFor={`amenity-${amenity}`} className="font-normal">{amenity}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
