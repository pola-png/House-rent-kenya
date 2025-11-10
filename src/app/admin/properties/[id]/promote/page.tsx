'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

  const weeklyRate = 5;

  useEffect(() => {
    if (propertyIdParam && user) {
      fetchProperty();
    }
  }, [propertyIdParam, user]);

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
      toast({ variant: 'destructive', title: 'Error', description: 'Property not found' });
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    alert('Submit clicked!');
    
    if (!screenshotFile || !user || !property) {
      alert('Missing data');
      toast({ variant: "destructive", title: "Error", description: "Missing required data" });
      return;
    }

    alert('Setting submitting true');
    setIsSubmitting(true);
    
    try {
      alert('Checking session');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('No session');
        toast({ variant: "destructive", title: "Error", description: "Please log in again" });
        setIsSubmitting(false);
        return;
      }
      
      alert('Session OK, starting upload');
    
    try {
      // Upload screenshot using existing API
      const fileName = `promotions/${user.uid}/${Date.now()}-${screenshotFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: fileName,
          contentType: screenshotFile.type,
          contentLength: screenshotFile.size,
        }),
      });

      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }

      const { uploadUrl, uploadHeaders, objectPath } = await uploadRes.json();
      
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: uploadHeaders || {},
        body: screenshotFile,
      });

      if (!putRes.ok) {
        throw new Error('File upload failed');
      }

      const screenshotUrl = objectPath;

      // Save to database
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          "propertyId": property.id,
          "propertyTitle": property.title || 'Untitled',
          "userId": user.uid,
          "userName": user.displayName || user.email,
          "userEmail": user.email,
          amount: promotionWeeks * weeklyRate,
          "paymentScreenshot": screenshotUrl,
          status: 'pending',
          "promotionType": `Featured - ${promotionWeeks} week${promotionWeeks > 1 ? 's' : ''}`,
        });

      if (error) throw error;

      alert('Success!');
      toast({ title: "Success!", description: "Promotion request submitted" });
      router.push('/admin/promotions');
    } catch (error: any) {
      alert('Error: ' + error.message);
      toast({ variant: "destructive", title: "Error", description: error.message || 'Failed to submit' });
    } finally {
      alert('Setting submitting false');
      setIsSubmitting(false);
    }
  };

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
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!screenshotFile || !property || isSubmitting}
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