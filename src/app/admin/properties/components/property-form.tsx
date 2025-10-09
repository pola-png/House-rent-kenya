"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Image as ImageIcon, X, Upload } from "lucide-react";
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

// Mock user data
import users from "@/lib/docs/users.json";
const currentUser = users.find(u => u.role === 'agent');


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
  propertyType: z.enum(["Apartment", "House", "Condo", "Townhouse", "Villa"]),
  amenities: z.string().min(3),
  status: z.enum(["For Rent", "For Sale", "Short Let", "Land", "Rented"]),
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


  const defaultValues: Partial<PropertyFormValues> = property
    ? {
        ...property,
        amenities: property.amenities.join(", "),
        keywords: property.keywords || "",
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

  async function onSubmit(data: PropertyFormValues) {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Auth Error",
        description: "No agent user found in mock data.",
      });
      return;
    }
    
    toast({
        title: "Submitting...",
        description: "Your property is being saved.",
    });

    try {
        // This is a mock submission. In a real app, you'd save to a database.
        console.log("Form data submitted:", data);
        
        if (property) {
            toast({
                title: "Success!",
                description: "Property has been updated successfully.",
            });
            router.push(`/admin/properties`);
        } else {
            toast({
                title: "Success!",
                description: "Property has been created successfully.",
            });
            router.push('/admin/properties');
        }
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newImageFiles = [...imageFiles, ...newFiles];
      setImageFiles(newImageFiles);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
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
  
  const handleSendForApproval = () => {
    if (!screenshotFile) {
        toast({
            variant: "destructive",
            title: "No Screenshot",
            description: "Please upload a screenshot of your payment to proceed.",
        });
        return;
    }
    toast({
        title: "Screenshot Sent!",
        description: "An admin has been notified. Your chat will appear in the 'Messages' tab upon approval.",
    });
    // In a real app, you would navigate to the messages page with the new ticket.
    router.push('/admin/messages');
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
                    <CardTitle>SEO</CardTitle>
                    <CardDescription>Improve your listing's visibility on search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
