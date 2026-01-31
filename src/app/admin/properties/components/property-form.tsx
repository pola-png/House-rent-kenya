"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Image as ImageIcon, X, Sparkles } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { getAccessTokenSync } from "@/lib/token-cache";

import { generateWithAI } from "@/lib/ai-service";

import { uploadToWasabi } from "@/lib/wasabi";


const DEBUG_FORM = true;
const dlog = (...args: any[]) => { if (DEBUG_FORM) console.log('[PropertyForm]', ...args); };

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  description: z.string().min(140, {
    message: "Description must be at least 140 characters.",
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
  keywords: z.string().min(3, {
    message: "Keywords must be at least 3 characters.",
  }),
  featured: z.boolean().default(false),
  latitude: z.coerce.number().min(-90).max(90).default(-1.286389),
  longitude: z.coerce.number().min(-180).max(180).default(36.817223),
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
  property?: Property;
}

const getAccessToken = async (): Promise<string | null> => {
  // 1) Try synchronous cache for instant availability
  try {
    const t = getAccessTokenSync();
    if (t) return t;
  } catch {}
  // 2) Fallback to supabase client
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.access_token) return data.session.access_token;
  } catch {}
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const m = baseUrl.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co/i);
        const ref = m?.[1];
        if (ref) {
          const key = `sb-${ref}-auth-token`;
          const raw = window.localStorage.getItem(key);
          if (raw) {
            const json = JSON.parse(raw);
            if (json?.access_token) return json.access_token as string;
            if (json?.currentSession?.access_token) return json.currentSession.access_token as string;
            if (json?.state?.currentSession?.access_token) return json.state.currentSession.access_token as string;
          }
        }
      } catch {}
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (!k) continue;
        if (k.includes('auth-token') || k.includes('supabase')) {
          try {
            const raw = window.localStorage.getItem(k);
            if (!raw) continue;
            const json = JSON.parse(raw);
            if (json?.access_token) return json.access_token as string;
            if (json?.currentSession?.access_token) return json.currentSession.access_token as string;
            if (json?.state?.currentSession?.access_token) return json.state.currentSession.access_token as string;
          } catch {}
        }
      }
    }
  } catch {}
  return null;
};

export function PropertyForm({ property }: PropertyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [lastError, setLastError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = React.useState(false);

  const generateAIKeywords = async (onChange: (value: string) => void) => {
    const currentData = {
      propertyType: form.getValues('propertyType'),
      bedrooms: form.getValues('bedrooms'),
      location: form.getValues('location'),
      city: form.getValues('city'),
    };

    const missingFields = [];
    if (!currentData.propertyType) missingFields.push('Property Type');
    if (!currentData.bedrooms || currentData.bedrooms < 1) missingFields.push('Bedrooms');
    if (!currentData.location?.trim()) missingFields.push('Location');
    if (!currentData.city?.trim()) missingFields.push('City');

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.join(', ')}`,
      });
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const prompt = `Generate 10-15 SEO keywords for a ${currentData.bedrooms}-bedroom ${currentData.propertyType} in ${currentData.location}, ${currentData.city}. Return as comma-separated list only.`;
      const text = await generateWithAI(prompt);
      onChange(text.trim());
      
      toast({
        title: "Keywords Generated!",
        description: "SEO keywords have been created successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || 'Could not generate keywords.',
      });
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  // Promotion section removed
  const [isGeneratingTitle, setIsGeneratingTitle] = React.useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = React.useState(false);

  // Form validation function
  const isFormValid = () => {
    const title = form.watch('title');
    const description = form.watch('description');
    const keywords = form.watch('keywords');
    const hasImages = imagePreviews.length > 0 || (property?.images && property.images.length > 0);
    
    return title?.trim() && description?.trim() && keywords?.trim() && hasImages;
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const title = form.watch('title');
    const description = form.watch('description');
    const keywords = form.watch('keywords');
    const hasImages = imagePreviews.length > 0 || (property?.images && property.images.length > 0);
    
    const missingFields = [];
    if (!title?.trim()) missingFields.push('Title');
    if (!description?.trim()) missingFields.push('Description');
    if (!keywords?.trim()) missingFields.push('Keywords');
    if (!hasImages) missingFields.push('Property Images');
    
    if (missingFields.length > 0) {
      // Trigger form validation to show red errors
      form.trigger();
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: `Please fill all required fields: ${missingFields.join(', ')}`,
      });
      return;
    }
    
    form.handleSubmit(onSubmit)(e);
  };


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
      price: form.getValues('price'),
      area: form.getValues('area')
    };

    // Validate all Property Features are filled
    const missingFields = [];
    if (!currentData.propertyType) missingFields.push('Property Type');
    if (!currentData.bedrooms || currentData.bedrooms < 1) missingFields.push('Bedrooms');
    if (!currentData.bathrooms || currentData.bathrooms < 1) missingFields.push('Bathrooms');
    if (!currentData.area || currentData.area <= 0) missingFields.push('Area');
    if (!currentData.price || currentData.price <= 0) missingFields.push('ice');
    if (!currentData.location?.trim()) missingFields.push('Location');
    if (!currentData.city?.trim()) missingFields.push('City');
    if (!currentData.amenities?.trim()) missingFields.push('Amenities');

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Complete Property Features Required",
        description: `Please fill in all Property Features first: ${missingFields.join(', ')}`,
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

      const text = await generateWithAI(prompt);
      onChange(text);
      
      toast({
        title: "AI Description Generated!",
        description: "Your property description has been created successfully.",
      });
    } catch (error: any) {
      console.error('AI Description Error:', error);
      const errorMessage = error.message === 'AI service not configured' 
        ? 'AI service is not available. Please contact support.'
        : error.message || 'Could not generate description. Please try again.';
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
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
      city: form.getValues('city'),
      bathrooms: form.getValues('bathrooms'),
      area: form.getValues('area'),
      price: form.getValues('price'),
      amenities: form.getValues('amenities') || ''
    };

    // Validate all Property Features are filled
    const missingFields = [];
    if (!currentData.propertyType) missingFields.push('Property Type');
    if (!currentData.bedrooms || currentData.bedrooms < 1) missingFields.push('Bedrooms');
    if (!currentData.bathrooms || currentData.bathrooms < 1) missingFields.push('Bathrooms');
    if (!currentData.area || currentData.area <= 0) missingFields.push('Area');
    if (!currentData.price || currentData.price <= 0) missingFields.push('ice');
    if (!currentData.location?.trim()) missingFields.push('Location');
    if (!currentData.city?.trim()) missingFields.push('City');
    if (!currentData.amenities?.trim()) missingFields.push('Amenities');

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Complete Property Features Required",
        description: `Please fill in all Property Features first: ${missingFields.join(', ')}`,
      });
      return;
    }

    setIsGeneratingTitle(true);
    try {
      const prompt = `Generate a catchy, SEO-optimized property listing title for a ${currentData.bedrooms}-bedroom ${currentData.propertyType} in ${currentData.location}, ${currentData.city}. Keep it under 80 characters, professional, and attention-grabbing. Only return the title, nothing else.`;

      const text = await generateWithAI(prompt);
      onChange(text.trim());
      
      toast({
        title: "AI Title Generated!",
        description: "Your property title has been created successfully.",
      });
    } catch (error: any) {
      console.error('AI Title Error:', error);
      const errorMessage = error.message === 'AI service not configured' 
        ? 'AI service is not available. Please contact support.'
        : error.message || 'Could not generate title. Please try again.';
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      });
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingImages, setIsUploadingImages] = React.useState(false);



  async function onSubmit(data: PropertyFormValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsUploadingImages(true);
    toast({ title: "Saving property...", description: "Please wait." });
    dlog('Submit started', { isEdit: Boolean(property?.id) });
    setLastError(null);

    try {
      if (!user) {
        throw new Error("You must be logged in.");
      }

      if (!user.phoneNumber) {
        router.push('/admin/profile');
        throw new Error("Please add your phone number to your profile before creating a property.");
      }

      // Upload any newly added images (keep existing on edit)
      const uploadedImageUrls = await uploadImages(imageFiles);
      dlog('Uploaded image URLs:', uploadedImageUrls);
      const existingImageUrls = Array.isArray(property?.images) ? (property!.images as string[]) : [];
      // De-duplicate while preserving order
      const allImageUrls = Array.from(new Set([...(existingImageUrls || []), ...uploadedImageUrls]));
      setIsUploadingImages(false);
      dlog('All images aggregated:', allImageUrls);

      // Sanitize numeric fields (handle values like "30,000")
      const toNumber = (v: any, fallback = 0) => {
        if (typeof v === 'number') return v;
        const n = Number(String(v ?? '').replace(/,/g, '').trim());
        return Number.isFinite(n) ? n : fallback;
      };

      const propertyPayload = {
        title: data.title,
        description: data.description,
        price: toNumber(data.price, 0),
        propertyType: data.propertyType,
        bedrooms: toNumber(data.bedrooms, 1),
        bathrooms: toNumber(data.bathrooms, 1),
        area: toNumber(data.area, 0),
        location: data.location,
        city: data.city,
        latitude: toNumber(data.latitude, -1.286389),
        longitude: toNumber(data.longitude, 36.817223),
        images: allImageUrls,
        amenities: data.amenities.split(",").map((s) => s.trim()),
        landlordId: user.uid,
        status: data.status,
        featured: data.featured || false,
        keywords: data.keywords || '',
      } as any;

      console.log('[PropertyForm] Payload ready', { isEdit: Boolean(property?.id), payload: propertyPayload });

      setLastError(null);

      let savedId: string | null = null;
      // Try server route first; if token missing/fails, fall back to client Supabase insert
      dlog('Retrieving session token...');
      const tokenTimeoutMs = 3000;
      const tokenTimeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), tokenTimeoutMs));
      const maybeToken = await Promise.race<[string | null, null]>([
        (async () => await getAccessToken())() as any,
        tokenTimeout as any,
      ]);
      const accessToken = (maybeToken as any) || null;
      if (accessToken) {
        try { console.log('[PropertyForm] Access token present (len):', String(accessToken).length); } catch {}
        // Server-side save using service role (no REST from browser)
        const controller = new AbortController();
        // Allow extra time on slower networks
        const to = setTimeout(() => controller.abort(), 15000);
        console.log('[PropertyForm] Calling /api/admin/properties/save');
        const saveRes = await fetch('/api/admin/properties/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify({ ...(property?.id ? { id: property.id } : {}), ...propertyPayload }),
          signal: controller.signal,
        }).catch((e) => {
          console.error('[PropertyForm] Save request error:', e);
          if ((e as any)?.name === 'AbortError') {
            throw new Error('Save timed out. Please check your connection and try again.');
          }
          throw e;
        });
        clearTimeout(to);
        try { console.log('[PropertyForm] Save status:', saveRes.status); } catch {}
        const parseError = async () => {
          try {
            const json = await saveRes.clone().json();
            return json?.error || json?.message || JSON.stringify(json);
          } catch {
            const txt = await saveRes.text();
            return txt;
          }
        };
        if (!saveRes.ok) {
          const msg = await parseError();
          throw new Error(msg || `Save failed (${saveRes.status})`);
        }
        const saved = await saveRes.json().catch(() => ({}));
        console.log('[PropertyForm] Save response', saved);
        savedId = saved?.id || saved?.data?.id || null;
      } else {
        dlog('Token missing or timed out Ã¢â‚¬â€ falling back to client Supabase save');
        // Client-side save (requires properties RLS OFF or policy allowing anon insert)
        let saved: any = null;
        const clientSaveTimeoutMs = 15000;
        if (property?.id) {
          dlog('Client save: update path');
          const updatePromise = supabase
            .from('properties')
            .update({ ...propertyPayload, updatedAt: new Date().toISOString() })
            .eq('id', property.id)
            .select('*')
            .single();
          const { data, error } = await Promise.race([
            updatePromise,
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Client save timed out')), clientSaveTimeoutMs)),
          ]);
          if (error) throw new Error(error.message);
          saved = data;
        } else {
          dlog('Client save: insert path');
          const insertPromise = supabase
            .from('properties')
            .insert([{ ...propertyPayload, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }])
            .select('*')
            .single();
          const { data, error } = await Promise.race([
            insertPromise,
            new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Client save timed out')), clientSaveTimeoutMs)),
          ]);
          if (error) throw new Error(error.message);
          saved = data;
        }
        console.log('[PropertyForm] Client save response', saved);
        savedId = saved?.id || null;
      }

      // Promotion flow moved to Admin > Promotions page

      // Skip revalidation for faster posting
      // Background revalidation will be handled after redirect

      toast({
        title: `Property ${property?.id ? 'Updated' : 'Created'}`,
        description: `Your property has been successfully ${property?.id ? 'updated' : 'saved'}. Redirecting to your listings...`,
      });

      // Immediate redirect - let background processes handle the rest
      router.push(`/admin/properties`);
      
      // Background revalidation (non-blocking)
      setTimeout(async () => {
        try {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              ...(process.env.NEXT_PUBLIC_REVALIDATE_TOKEN
                ? { 'x-revalidate-token': process.env.NEXT_PUBLIC_REVALIDATE_TOKEN }
                : {}),
            },
            body: JSON.stringify({ tags: ['properties:list', savedId ? `property:${savedId}` : undefined].filter(Boolean) }),
          });
        } catch {}
      }, 100);
    } catch (error: any) {
      console.error('Error saving property:', error);
      dlog('Error (catch) saving property:', error?.message, error);
      let description = 'Could not save the property. Please try again.';
      if (error.message?.includes('Invalid or expired session')) {
        description = 'Your session has expired. Please log in again.';
        router.push('/login');
      } else if (error.message === 'Please add your phone number to your profile before creating a property.') {
        description = error.message;
      } else if (error.message === 'You must be logged in.') {
        description = error.message;
      } else if (error.message) {
        description = `Database error: ${error.message}`;
      }
      setLastError(description);
      toast({ variant: 'destructive', title: 'Operation Failed', description });
    } finally {
      setIsSubmitting(false);
      setIsUploadingImages(false);
      dlog('Submit finished');
    }
  }



  const uploadImages = async (files: File[]) => {
    if (files.length === 0) return [];

    console.log(`Uploading ${files.length} images...`);
    dlog('uploadImages called with', files.length, 'file(s)');
    const uploadPromises = files.map(async (file, index) => {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
      const fileName = `properties/${user?.uid}/${Date.now()}-${sanitizedName}`;
      try {
        console.log(`Uploading image ${index + 1}:`, fileName);
        const publicUrl = await uploadToWasabi(file, fileName);
        console.log(`Image ${index + 1} uploaded:`, publicUrl);
        return publicUrl;
      } catch (error: any) {
        console.error(`Image ${index + 1} upload failed:`, error);
        throw new Error(`Image upload failed: ${error.message}`);
      }
    });

    const urls = await Promise.all(uploadPromises);
    dlog('All image uploads complete. Count:', urls.length);
    return urls;
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    const newFiles = Array.from(files);
    setImageFiles(prev => [...prev, ...newFiles]);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    dlog('handleImageChange added files:', newFiles.length, 'total now:', imageFiles.length + newFiles.length);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
  };
  

      
  return (
    <Form {...form}>
      <form onSubmit={validateAndSubmit} className="space-y-8">
        {lastError && (
          <div className="rounded-md border border-red-300 bg-red-50 text-red-800 p-3 text-sm">
            {lastError}
          </div>
        )}
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
                        <Input 
                          placeholder="Enter property title" 
                          {...field} 
                        />
                      </FormControl>
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateAITitle(field.onChange)}
                          disabled={isGeneratingTitle || !form.watch('propertyType') || !form.watch('location')}
                          className="w-full"
                        >
                          {isGeneratingTitle ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                          )}
                          {isGeneratingTitle ? 'Generating Title...' : 'Generate AI Title'}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter property description"
                          className="resize-y min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => generateAIDescription(field.onChange)}
                          disabled={isGeneratingDesc || !form.watch('propertyType') || !form.watch('location')}
                          className="w-full"
                        >
                          {isGeneratingDesc ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                          )}
                          {isGeneratingDesc ? 'Generating Description...' : 'Generate AI Description'}
                        </Button>
                      </div>
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
                    <CardTitle>SEO Keywords</CardTitle>
                    <CardDescription>Keywords help your property appear in search results.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter SEO keywords" 
                              {...field} 
                            />
                          </FormControl>
                          <div className="mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => generateAIKeywords(field.onChange)}
                              disabled={isGeneratingKeywords || !form.watch('propertyType') || !form.watch('location')}
                              className="w-full"
                            >
                              {isGeneratingKeywords ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Sparkles className="h-4 w-4 mr-2" />
                              )}
                              {isGeneratingKeywords ? 'Generating Keywords...' : 'Generate AI Keywords'}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CardContent>
            </Card>
          </div>
        </div>

        <Button 
          type="submit"
          size="lg" 
          disabled={isSubmitting || isUploadingImages}
        >
            {(isSubmitting || isUploadingImages) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploadingImages ? "Uploading Images..." : isSubmitting ? "Saving Property..." : property ? "Save Changes" : "Post My Property"}
        </Button>
      </form>
    </Form>
  );
}



