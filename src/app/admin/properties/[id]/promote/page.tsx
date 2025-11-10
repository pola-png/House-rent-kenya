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

interface PromotionRow {
  id: string;
  property_id?: string;
  property_title?: string;
  status?: string;
  weeks?: number;
  screenshot_url?: string;
  created_at?: string;
}

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
  const [rows, setRows] = useState<PromotionRow[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const weeklyRate = 5;

  useEffect(() => {
    if (propertyIdParam && user) {
      fetchProperty();
    }
  }, [propertyIdParam, user]);

  useEffect(() => {
    if (user) loadList();
  }, [user]);

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
    console.log('[Promote] Starting submission');
    
    if (!screenshotFile) {
      toast({ variant: "destructive", title: "No Screenshot", description: "Please upload payment screenshot" });
      return;
    }

    if (!user || !property) {
      toast({ variant: "destructive", title: "Error", description: "Missing user or property data" });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const amount = promotionWeeks * weeklyRate;
      
      console.log('[Promote] Submitting...');
      const { data, error } = await supabase
        .from('payment_requests')
        .insert({
          property_id: property.id,
          property_title: property.title || 'Untitled',
          user_id: user.uid,
          user_name: user.displayName || user.email,
          user_email: user.email,
          amount: amount,
          payment_screenshot_url: 'pending_upload',
          status: 'pending',
          type: 'promotion',
          details: `Featured - ${promotionWeeks} week${promotionWeeks > 1 ? 's' : ''}`,
        })
        .select()
        .single();

      if (error) {
        console.error('[Promote] DB Error:', error);
        throw error;
      }

      console.log('[Promote] Success:', data);
      toast({ title: "Request Submitted!", description: "Admin will review your payment soon." });
      setScreenshotFile(null);
      setScreenshotPreview(null);
      setPromotionWeeks(1);
      setTimeout(() => router.push('/admin/promotions'), 1500);
    } catch (error: any) {
      console.error('[Promote] Error:', error);
      const errorMsg = error?.message || 'Submission failed';
      setSubmitError(errorMsg);
      toast({ variant: "destructive", title: "Submission Failed", description: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  async function loadList() {
    try {
      setLoadingList(true);
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('user_id', user?.uid)
        .eq('type', 'promotion')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      console.error('[Promotion] list load error', e);
    } finally {
      setLoadingList(false);
    }
  }

  const canSubmit = useMemo(() => {
    return !!screenshotFile && !!(propertyIdParam || property?.id) && !isSubmitting;
  }, [screenshotFile, propertyIdParam, property?.id, isSubmitting]);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/properties">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Promote Property</CardTitle>
              <CardDescription>Boost your property's visibility with featured placement</CardDescription>
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
                  <p className="mt-2 text-sm text-red-600">{submitError}</p>
                )}
              </div>

              <Button
                onClick={handleSubmit}
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

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Promotion History</CardTitle>
              <CardDescription>Your recent promotion requests</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingList ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : rows.length > 0 ? (
                <div className="space-y-4">
                  {rows.map((row) => (
                    <div key={row.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {row.property_title || 'Untitled Property'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {row.weeks} week{row.weeks !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          row.status === 'approved' ? 'bg-green-100 text-green-800' :
                          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {row.status || 'unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  No promotions found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
