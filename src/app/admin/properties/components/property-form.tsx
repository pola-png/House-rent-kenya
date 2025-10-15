"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Image as ImageIcon, X, Upload, Sparkles } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
import type { Property } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { AISEOSimple } from "@/components/ai-seo-simple";


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
  propertyType: z.enum(["Apartment", "House", "Condo", "Townhouse", "Villa", "Bedsitter"]),
  amenities: z.string().min(3),
  status: z.enum(["For Rent", "For Sale", "Short Let", "Land", "Rented", "Sold"]),
  keywords: z.string().optional(),
  featured: z.boolean().default(false),
  latitude: z.coerce.number().min(-90).max(90).default(-1.286389),
  longitude: z.coerce.number().min(-180).max(180).default(36.817223),
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  property?: Property;
}

export function PropertyForm({ property }: PropertyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isPromotionOpen, setIsPromotionOpen] = React.useState(false);
  const [promotionWeeks, setPromotionWeeks] = React.useState(1);
  const weeklyRate = 5;
  const [screenshotFile, setScreenshotFile] = React.useState<File | null>(null);
  const [isGeneratingTitle, setIsGeneratingTitle] = React.useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = React.useState(false);


  const defaultValues: Partial<PropertyFormValues> = property
    ? {
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        city: property.city,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        propertyType: property.propertyType,
        status: property.status,
        amenities: Array.isArray(property.amenities) ? property.amenities.join(", ") : property.amenities,
        keywords: property.keywords || "",
        featured: property.featured || false,
        latitude: property.latitude || -1.286389,
        longitude: property.longitude || 36.817223,
      }
    : {
        title: "",
        description: "",
        price: 0,
        location: "",
        city: "Nairobi",
        bedrooms: 1,
        bathrooms: 1,
        area: 0,
        amenities: "",
        status: "For Rent",
        propertyType: "Apartment",
        keywords: "",
        featured: false,
      };

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { user } = useAuth();

  const generateAIDescription = async (onChange: (value: string) => void) => {
    const currentData = {
      propertyType: form.getValues('propertyType'),
      bedrooms: form.getValues('bedrooms'),
      bathrooms: form.getValues('bathrooms'),
      location: form.getValues('location'),
      city: form.getValues('city'),
      amenities: form.getValues('amenities') || '',
      price: form.getValues('price')
    };

    if (!currentData.propertyType || !currentData.location) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in property type and location first.",
      });
      return;
    }

    setIsGeneratingDesc(true);
    toast({
      title: "Generating AI Description...",
      description: "Please wait while we create your property description.",
    });

    try {
      const prompt = `Write a compelling, professional property description for a ${currentData.bedrooms}-bedroom, ${currentData.bathrooms}-bathroom ${currentData.propertyType} in ${currentData.location}, ${currentData.city}. Price: Ksh ${currentData.price.toLocaleString()}. Amenities: ${currentData.amenities || 'standard amenities'}. Make it engaging, highlight key features, and include a call to action. Format with paragraphs and bullet points for key features.`;

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBytiBEktDdWwh6tOF_GYZT_Ds7kCOvXvs';
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!text) throw new Error('No content generated');
      
      onChange(text);
      
      toast({
        title: "AI Description Generated!",
        description: "Your property description has been created successfully.",
      });
    } catch (error: any) {
      console.error('AI Description Error:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Could not generate description. Please try again.",
      });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const generateAITitle = async (onChange: (value: string) => void) => {
    const currentData = {
      propertyType: form.getValues('propertyType'),
      bedrooms: form.getValues('bedrooms'),
      location: form.getValues('location'),
      city: form.getValues('city')
    };

    if (!currentData.propertyType || !currentData.location) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in property type and location first.",
      });
      return;
    }

    setIsGeneratingTitle(true);
    try {
      const prompt = `Generate a catchy, SEO-optimized property listing title for a ${currentData.bedrooms}-bedroom ${currentData.propertyType} in ${currentData.location}, ${currentData.city}. Keep it under 80 characters, professional, and attention-grabbing. Only return the title, nothing else.`;

      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBytiBEktDdWwh6tOF_GYZT_Ds7kCOvXvs';
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!text) throw new Error('No content generated');
      
      onChange(text.trim());
      
      toast({
        title: "AI Title Generated!",
        description: "Your property title has been created successfully.",
      });
    } catch (error: any) {
      console.error('AI Title Error:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Could not generate title. Please try again.",
      });
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  async function onSubmit(data: PropertyFormValues) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Auth Error",
        description: "You must be logged in to post a property.",
      });
      router.push("/login");
      return;
    }

    if (!user.phoneNumber) {
      toast({
        variant: "destructive",
        title: "Phone Number Required",
        description: "Please add your phone number in your profile before posting properties.",
      });
      router.push("/admin/profile");
      return;
    }
    
    toast({
        title: "Submitting...",
        description: "Your property is being saved.",
    });

    try {
        const uploadedImageUrls: string[] = [];
        
        for (const file of imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.uid}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `properties/${fileName}`;

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('user-uploads')
            .upload(filePath, file, { upsert: true });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            if (uploadError.message.includes('not found')) {
              toast({
                variant: "destructive",
                title: "Storage Error",
                description: "Storage bucket not configured. Property will be posted without images.",
              });
              break;
            }
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('user-uploads')
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl);
        }

        const propertyData = {
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          city: data.city,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          propertyType: data.propertyType,
          amenities: data.amenities.split(',').map(a => a.trim()),
          status: data.status,
          keywords: data.keywords || '',
          featured: false,
          latitude: data.latitude,
          longitude: data.longitude,
          landlordId: user.uid,
          images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
          ]
        };
        
        if (property) {
            const finalPropertyData = {
              ...propertyData,
              images: uploadedImageUrls.length > 0 ? uploadedImageUrls : property.images
            };

            const { error } = await supabase
              .from('properties')
              .update(finalPropertyData)
              .eq('id', property.id)
              .eq('landlordId', user.uid);
            
            if (error) throw error;
            
            toast({
                title: "Success!",
                description: "Property has been updated successfully.",
            });
        } else {
            const { error } = await supabase
              .from('properties')
              .insert([propertyData]);
            
            if (error) throw error;
            
            toast({
                title: "Success!",
                description: "Property has been created successfully.",
            });
        }
        
        router.push('/admin/properties');
        router.refresh();

    } catch (e: any) {
        console.error("Error saving property: ", e);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not save property.",
        });
    }
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
  };
  
  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
    }
  };
  
  const handleSendForApproval = async () => {
    if (!screenshotFile) {
        toast({
            variant: "destructive",
            title: "No Screenshot",
            description: "Please upload a screenshot of your payment to proceed.",
        });
        return;
    }

    if (!property?.id) {
        toast({
            variant: "destructive",
            title: "Property Required",
            description: "Please save the property first before requesting promotion.",
        });
        return;
    }

    if (!user) return;

    try {
        toast({ title: "Uploading...", description: "Sending payment screenshot to admin." });

        const fileExt = screenshotFile.name.split('.').pop();
        const fileName = `payment-${user.uid}-${Date.now()}.${fileExt}`;
        const filePath = `payment-screenshots/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('user-uploads')
          .upload(filePath, screenshotFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('user-uploads')
          .getPublicUrl(filePath);

        const { error: insertError } = await supabase
          .from('payment_requests')
          .insert([{
            propertyId: property.id,
            propertyTitle: property.title,
            userId: user.uid,
            userName: user.displayName || user.email,
            userEmail: user.email,
            amount: promotionWeeks * weeklyRate,
            paymentScreenshot: publicUrl,
            status: 'pending',
            promotionType: `Featured - ${promotionWeeks} week${promotionWeeks > 1 ? 's' : ''}`,
            createdAt: new Date().toISOString()
          }]);

        if (insertError) throw insertError;

        toast({
            title: "Request Submitted!",
            description: "Admin will review your payment and approve your promotion soon.",
        });
        
        router.push('/admin/promotions');
    } catch (error: any) {
        console.error('Promotion request error:', error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error.message || "Could not submit promotion request.",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                      <FormLabel className="flex items-center justify-between">
                        <span>Title</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateAITitle(field.onChange)}
                          disabled={isGeneratingTitle || !form.watch('propertyType') || !form.watch('location')}
                        >
                          {isGeneratingTitle ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                          {isGeneratingTitle ? 'Generating...' : 'AI Generate'}
                        </Button>
                      </FormLabel>
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateAIDescription(field.onChange)}
                          disabled={isGeneratingDesc || !form.watch('propertyType') || !form.watch('location')}
                        >
                          {isGeneratingDesc ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                          {isGeneratingDesc ? 'Generating...' : 'AI Generate'}
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
                      <FormLabel>Price (Ksh)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="150000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Property Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-wrap gap-2 pt-2"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Apartment" id="r-apartment" />
                                </FormControl>
                                <Label htmlFor="r-apartment" className="font-normal">Apartment</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="House" id="r-house" />
                                </FormControl>
                                <Label htmlFor="r-house" className="font-normal">House</Label>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Condo" id="r-condo" />
                                </FormControl>
                                <Label htmlFor="r-condo" className="font-normal">Condo</Label>
                              </FormItem>
                               <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Townhouse" id="r-townhouse" />
                                </FormControl>
                                <Label htmlFor="r-townhouse" className="font-normal">Townhouse</Label>
                              </FormItem>
                               <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Villa" id="r-villa" />
                                </FormControl>
                                <Label htmlFor="r-villa" className="font-normal">Villa</Label>
                              </FormItem>
                               <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Bedsitter" id="r-bedsitter" />
                                </FormControl>
                                <Label htmlFor="r-bedsitter" className="font-normal">Bedsitter</Label>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
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
                    <FormItem className="md:col-span-2">
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
                            <Input placeholder="Kilimani" {...field} />
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
                <CardTitle>Listing Settings</CardTitle>
                <CardDescription>Configure visibility for this listing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>Listing Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 pt-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="For Rent" id="r-for-rent"/>
                            </FormControl>
                            <Label htmlFor="r-for-rent" className="font-normal">For Rent</Label>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="For Sale" id="r-for-sale"/>
                            </FormControl>
                            <Label htmlFor="r-for-sale" className="font-normal">For Sale</Label>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Short Let" id="r-short-let"/>
                            </FormControl>
                            <Label htmlFor="r-short-let" className="font-normal">Short Let</Label>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Land" id="r-land"/>
                            </FormControl>
                            <Label htmlFor="r-land" className="font-normal">Land</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Rented" id="r-rented"/>
                            </FormControl>
                            <Label htmlFor="r-rented" className="font-normal">Rented</Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Promotion</CardTitle>
                <CardDescription>Boost your property's visibility.</CardDescription>
              </CardHeader>
              <CardContent>
                <Collapsible open={isPromotionOpen} onOpenChange={setIsPromotionOpen}>
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <CollapsibleTrigger asChild>
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4 cursor-pointer">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Feature as "Pro"</FormLabel>
                            <FormDescription>
                              Promote this property on the homepage and at the top of search results.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} aria-readonly />
                          </FormControl>
                        </div>
                      </CollapsibleTrigger>
                    )}
                  />
                  <CollapsibleContent className="space-y-6 pt-6">
                    <Separator />
                    <p className="font-semibold">Choose your promotion plan:</p>
                    <div className="flex items-center gap-4">
                      <div className="grid gap-2 flex-1">
                        <Label htmlFor="promotion-weeks">Number of Weeks</Label>
                        <Input 
                          id="promotion-weeks" 
                          type="number" 
                          min="1" 
                          value={promotionWeeks} 
                          onChange={(e) => setPromotionWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                      </div>
                      <div className="text-right">
                          <p className="text-sm text-muted-foreground">Price</p>
                          <p className="font-bold text-lg">${(promotionWeeks * weeklyRate).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-center bg-muted p-4 rounded-md">
                      <p className="font-semibold mb-2">1. Complete Payment via M-Pesa</p>
                      <p>Send Money to: <span className="font-bold">+254704202939</span></p>
                      <p>Name: <span className="font-bold">Edwin</span></p>
                      <p>Amount: <span className="font-bold">${(promotionWeeks * weeklyRate).toLocaleString()}</span></p>
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="screenshot-upload">2. Upload Payment Screenshot</Label>
                        <Input id="screenshot-upload" type="file" accept="image/png, image/jpeg" onChange={handleScreenshotChange} />
                        {screenshotFile && <p className="text-xs text-muted-foreground">File: {screenshotFile.name}</p>}
                    </div>
                    <Button type="button" className="w-full" onClick={handleSendForApproval}>
                       <Upload className="mr-2 h-4 w-4" />
                       Send Screenshot to Admin for Approval
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
                <CardDescription>Upload high-quality images of your property.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={src}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Add more</p>
                      </div>
                      <input
                        id="dropzone-file"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleImageChange}
                        accept="image/png, image/jpeg, image/gif"
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>AI SEO Optimization</CardTitle>
                    <CardDescription>Generate SEO-optimized content with one click.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AISEOSimple
                      formData={{
                        title: form.watch('title') || '',
                        description: form.watch('description') || '',
                        propertyType: form.watch('propertyType') || 'Apartment',
                        bedrooms: form.watch('bedrooms') || 1,
                        bathrooms: form.watch('bathrooms') || 1,
                        location: form.watch('location') || '',
                        city: form.watch('city') || 'Nairobi',
                        amenities: form.watch('amenities') || '',
                        price: form.watch('price') || 0,
                      }}
                      onApply={(data) => {
                        form.setValue('title', data.title);
                        form.setValue('description', data.description);
                        form.setValue('keywords', data.keywords);
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., apartment for rent, Kilimani" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
            </Card>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {property ? "Save Changes" : "Post My Property"}
        </Button>
      </form>
    </Form>
  );
}
