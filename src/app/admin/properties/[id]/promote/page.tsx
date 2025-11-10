'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { uploadToWasabi } from '@/lib/wasabi';

export default function PromotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const propertyIdParam = searchParams?.get('propertyId') || null;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(!!propertyIdParam);
  const [promotionWeeks, setPromotionWeeks] = useState(1);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const weeklyRate = 5;

  useEffect(() => {
    if (propertyIdParam && user) {
      fetchProperty();
    }
  }, [propertyIdParam, user]);

  useEffect(() => {
    return () => {
      if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    };
  }, [screenshotPreview]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyIdParam)
        .eq('landlord_id', user?.uid)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Property not found' });
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    
    if (!screenshotFile || !user || !property) {
      console.log('Missing data:', { screenshotFile: !!screenshotFile, user: !!user, property: !!property });
      toast({ variant: "destructive", title: "Error", description: "Missing required data" });
      return;
    }

    console.log('Setting isSubmitting to true');
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const amount = promotionWeeks * weeklyRate;
      
      console.log('Starting upload process...', {
        userId: user.uid,
        propertyId: property.id,
        fileName: screenshotFile.name,
        fileSize: screenshotFile.size,
        fileType: screenshotFile.type
      });
      
      toast({ title: "Uploading...", description: "Uploading payment screenshot." });
      
      const fileName = `promotions/${user.uid}/${Date.now()}-${screenshotFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
      console.log('Upload path:', fileName);
      
      // Test API first
      console.log('Testing upload API...');
      const testResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: fileName,
          contentType: screenshotFile.type,
          contentLength: screenshotFile.size,
        }),
      });
      
      console.log('API test response:', testResponse.status, testResponse.statusText);
      
      if (!testResponse.ok) {
        const errorData = await testResponse.json().catch(() => ({}));
        console.log('API error:', errorData);
        throw new Error(`Upload API failed: ${errorData.error || testResponse.statusText}`);
      }
      
      const uploadData = await testResponse.json();
      console.log('Upload data received:', uploadData);
      
      // Now do the actual upload
      console.log('Uploading to Wasabi...');
      const putResponse = await fetch(uploadData.uploadUrl, {
        method: 'PUT',
        headers: uploadData.uploadHeaders || {},
        body: screenshotFile,
      });
      
      console.log('PUT response:', putResponse.status, putResponse.statusText);
      
      if (!putResponse.ok) {
        throw new Error(`File upload failed: ${putResponse.statusText}`);
      }
      
      const screenshotUrl = uploadData.objectPath;
      console.log('Screenshot uploaded successfully:', screenshotUrl);
      
      toast({ title: "Saving...", description: "Saving promotion request." });
      
      const insertData = {
        "propertyId": property.id,
        "propertyTitle": property.title || 'Untitled',
        "userId": user.uid,
        "userName": user.displayName || user.email,
        "userEmail": user.email,
        amount: amount,
        "paymentScreenshot": screenshotUrl,
        status: 'pending',
        "promotionType": `Featured - ${promotionWeeks} week${promotionWeeks > 1 ? 's' : ''}`,
      };
      
      console.log('Inserting data:', insertData);
      
      const { data, error } = await supabase
        .from('payment_requests')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Database insert successful:', data);
      
      toast({ title: "Request Submitted!", description: "Admin will review your payment soon." });
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setPromotionWeeks(1);
      setTimeout(() => router.push('/admin/promotions'), 1500);
    } catch (error: any) {
      console.error('Full error details:', error);
      const errorMsg = error?.message || error?.details || 'Submission failed';
      setSubmitError(errorMsg);
      toast({ variant: "destructive", title: "Submission Failed", description: errorMsg });
    } finally {
      console.log('Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  const canSubmit = useMemo(() => {
    const hasFile = !!screenshotFile;
    const hasProperty = !!(propertyIdParam || property?.id);
    const notSubmitting = !isSubmitting;
    const result = hasFile && hasProperty && notSubmitting;
    
    console.log('canSubmit check:', {
      hasFile,
      hasProperty,
      notSubmitting,
      result,
      propertyIdParam,
      propertyId: property?.id,
      isSubmitting
    });
    
    return result;
  }, [screenshotFile, propertyIdParam, property?.id, isSubmitting]);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/properties">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Promote Property</CardTitle>
          <CardDescription>Boost your property visibility with featured placement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {propertyIdParam && loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : property ? (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">{property.title}</h3>
              <p className="text-sm text-muted-foreground">
                {property.location}, {property.city}
              </p>
            </div>
          ) : propertyIdParam ? (
            <div className="p-4 bg-red-100 rounded-lg">
              <p className="text-sm">Property not found</p>
            </div>
          ) : null}

          <div>
            <Label htmlFor="weeks">Number of Weeks</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Input
                type="range"
                id="weeks"
                min="1"
                max="12"
                value={promotionWeeks}
                onChange={(e) => setPromotionWeeks(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-lg font-semibold w-10">{promotionWeeks}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              ${weeklyRate} per week • Total: ${(promotionWeeks * weeklyRate).toFixed(2)}
            </p>
          </div>

          <div>
            <Label htmlFor="screenshot">Payment Screenshot</Label>
            <div className="mt-2 flex items-center space-x-4">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('screenshot')?.click()}
                disabled={isSubmitting}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Screenshot
              </Button>
              {screenshotPreview && (
                <Image
                  src={screenshotPreview}
                  alt="Screenshot preview"
                  width={100}
                  height={100}
                  className="rounded-md border object-cover"
                />
              )}
            </div>
            {submitError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">Error Details:</p>
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}
          </div>

          <Button
            onClick={(e) => {
              console.log('Button clicked!', { canSubmit, disabled: !canSubmit });
              e.preventDefault();
              if (canSubmit) {
                handleSubmit();
              } else {
                console.log('Button disabled, cannot submit');
              }
            }}
            disabled={!canSubmit}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Promotion'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
