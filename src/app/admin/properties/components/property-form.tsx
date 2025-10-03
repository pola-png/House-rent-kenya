"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Property } from "@/lib/types";
import { generatePropertyDescription } from "@/ai/flows/generate-property-description";
import { optimizeListingSEO } from "@/ai/flows/optimize-listing-seo";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  price: z.coerce.number().positive(),
  location: z.string().min(2),
  city: z.string().min(2),
  bedrooms: z.coerce.number().int().min(1),
  bathrooms: z.coerce.number().int().min(1),
  area: z.coerce.number().positive(),
  type: z.enum(["Apartment", "House", "Condo", "Townhouse", "Villa"]),
  amenities: z.string().min(3),
  status: z.enum(["For Rent", "Rented"]),
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  property?: Property;
}

export function PropertyForm({ property }: PropertyFormProps) {
  const { toast } = useToast();
  const [isGeneratingDesc, setIsGeneratingDesc] = React.useState(false);
  const [isOptimizingSeo, setIsOptimizingSeo] = React.useState(false);
  const [seoScore, setSeoScore] = React.useState<number | null>(property ? 75 : null);

  const defaultValues: Partial<PropertyFormValues> = property
    ? {
        ...property,
        amenities: property.amenities.join(", "),
      }
    : {
        status: "For Rent",
        type: "Apartment",
      };

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: PropertyFormValues) {
    toast({
        title: "Submitting...",
        description: "Property data is being saved.",
    });
    console.log(data);
    // Here you would typically call an API to save the data
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
        title: "Success!",
        description: "Property has been saved successfully.",
    });
  }

  const handleGenerateDescription = async () => {
    setIsGeneratingDesc(true);
    try {
      const currentValues = form.getValues();
      const result = await generatePropertyDescription({
        propertyType: currentValues.type,
        location: currentValues.location,
        bedrooms: currentValues.bedrooms,
        bathrooms: currentValues.bathrooms,
        amenities: currentValues.amenities,
        additionalFeatures: currentValues.title,
      });
      form.setValue("description", result.description, { shouldValidate: true });
      toast({
        title: "Description Generated",
        description: "The AI-powered description has been filled in.",
      });
    } catch (error) {
      console.error("Failed to generate description:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate AI description.",
      });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleSeoOptimize = async () => {
      setIsOptimizingSeo(true);
      try {
        const currentValues = form.getValues();
        const result = await optimizeListingSEO({
            listingTitle: currentValues.title,
            listingDescription: currentValues.description,
            listingKeywords: '',
            propertyType: currentValues.type,
            propertyLocation: currentValues.location,
            numberOfBedrooms: currentValues.bedrooms,
            numberOfBathrooms: currentValues.bathrooms,
            amenities: currentValues.amenities,
        });
        form.setValue("title", result.optimizedTitle, { shouldValidate: true });
        form.setValue("description", result.optimizedDescription, { shouldValidate: true });
        setSeoScore(result.seoScore);
        toast({
          title: "SEO Optimized",
          description: `Listing optimized! New SEO score: ${result.seoScore}/100`,
        });

      } catch (error) {
        console.error("Failed to optimize SEO:", error);
         toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to optimize SEO.",
        });
      } finally {
        setIsOptimizingSeo(false);
      }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>
                  Enter the main details of the property.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Luxury 3-Bedroom Apartment in Kilimani" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Description</span>
                         <Button type="button" variant="ghost" size="sm" onClick={handleGenerateDescription} disabled={isGeneratingDesc}>
                            {isGeneratingDesc ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Wand2 className="mr-2 h-4 w-4" />
                            )}
                            Generate with AI
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about the property"
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Features</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (Ksh/month)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="150000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a property type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Condo">Condo</SelectItem>
                            <SelectItem value="Townhouse">Townhouse</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (sqft)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="2200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <FormControl>
                        <Input placeholder="Pool, Gym, Parking..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of amenities.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Neighborhood/Area</FormLabel>
                        <FormControl>
                            <Input placeholder="Kilimani, Nairobi" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="Nairobi" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Listing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="For Rent">For Rent</SelectItem>
                          <SelectItem value="Rented">Rented</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>SEO Optimization</CardTitle>
                    <CardDescription>Improve your listing's visibility on search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {seoScore !== null && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <FormLabel>SEO Score</FormLabel>
                                <span className="text-lg font-bold text-primary">{seoScore}/100</span>
                            </div>
                            <Progress value={seoScore} />
                        </div>
                    )}
                    <Button type="button" className="w-full" onClick={handleSeoOptimize} disabled={isOptimizingSeo}>
                       {isOptimizingSeo ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Optimize with AI
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {property ? "Save Changes" : "Create Property"}
        </Button>
      </form>
    </Form>
  );
}
