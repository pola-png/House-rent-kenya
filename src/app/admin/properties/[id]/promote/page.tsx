'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { useEffect, useMemo, useState } from 'react';
import { useAutoRetry } from '@/hooks/use-auto-retry';
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
  propertyId?: string;
  property_title?: string;
  propertyTitle?: string;
  status?: string;
  weeks?: number;
  screenshot_url?: string;
  screenshotUrl?: string;
  created_at?: string;
  createdAt?: string;
}

export default function MergedPromotionPage() {
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retryTick, retryNow] = useAutoRetry(loadingList || isSubmitting || !user, [user]);

  const weeklyRate = 5;

  function log(...args: any[]) {
    console.log('[Promotion]', ...args);
  }

  // Fetch property if propertyId is in URL
  useEffect(() => {
    if (propertyIdParam && user) {
      fetchProperty();
    }
  }, [propertyIdParam, user]);

  // Add this useEffect to clean up object URLs
  useEffect(() => {
    return () => {
      if (screenshotPreview) {
        URL.revokeObjectURL(screenshotPreview);
      }
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
    }
  };

  async function presignWasabi(key: string, contentType: string, contentLength: number) {
    log('presign start', { key, contentType, contentLength });
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, contentType, contentLength }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = (await res.json()) as { url: string };
    log('presign ok', { key });
    return data;
  }

  async function uploadToWasabi(file: File) {
    const ext = file.name.split('.').pop() || 'jpg';
    const key = `promotions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { url } = await presignWasabi(key, file.type || 'image/jpeg', file.size);
    log('wasabi PUT start', { key });
    const put = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
    });
    if (!put.ok) throw new Error(`Wasabi PUT failed: ${put.status}`);
    log('wasabi PUT success', { key, status: put.status });
    const publicUrl = url.split('?')[0];
    return { key, url: publicUrl };
  }

  async function fetchWithTimeout(
    input: RequestInfo | URL,
    init: RequestInit & { timeoutMs?: number } = {}
  ) {
    const { timeoutMs = 30000, ...rest } = init;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      // @ts-ignore
      const res: Response = await fetch(input, { ...rest, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  }

  const handleSubmit = async () => {
    console.log("================== PROMOTION SUBMISSION START ==================");
    console.log('[Promote] Submit started', { screenshotFile: !!screenshotFile, user: !!user, property: !!property });
    
    if (!screenshotFile) {
      console.warn('[Promote] No screenshot file');
      toast({ variant: "destructive", title: "No Screenshot", description: "Please upload payment screenshot" });
      return;
    }

    if (!user || !property) {
      console.warn('[Promote] Missing user or property', { user: !!user, property: !!property });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log('[Promote] Uploading screenshot to Wasabi...', { fileName: screenshotFile.name, size: screenshotFile.size });
      toast({ title: "Uploading...", description: "Sending payment screenshot to admin." });

      // Upload image to Wasabi
      const up = await uploadToWasabi(screenshotFile);
      console.log('[Promote] Wasabi upload success:', up);

      const weeklyRate = 5;
      const amount = promotionWeeks * weeklyRate;
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token || null;

      // Try Method 1: API route
      try {
        console.log('[Promote] Trying API route...');
        const res = await fetchWithTimeout('/api/admin/promotions/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            propertyId: property.id,
            propertyTitle: property.title,
            weeks: promotionWeeks,
            screenshotUrl: up.url,
          }),
          timeoutMs: 15000,
        });

        if (res.ok) {
          const json = await res.json();
          console.log('[Promote] API success:', json);
          toast({ title: "Request Submitted!", description: "Admin will review your payment soon." });
          setScreenshotFile(null);
          setScreenshotPreview(null);
          setPromotionWeeks(1);
          setTimeout(() => router.push('/admin/promotions'), 1500);
          return;
        }
        console.warn('[Promote] API failed, trying direct insert...');
      } catch (apiError) {
        console.warn('[Promote] API error, trying direct insert:', apiError);
      }

      // Method 2: Direct Supabase insert to payment_requests
      try {
        console.log('[Promote] Trying payment_requests insert...');
        const { data, error } = await supabase
          .from('payment_requests')
          .insert({
            property_id: property.id,
            property_title: property.title || 'Untitled',
            user_id: user.uid,
            user_name: user.user_metadata?.full_name || user.email,
            user_email: user.email,
            amount: amount,
            payment_screenshot_url: up.url,
            status: 'pending',
            type: 'promotion',
            details: `Featured - ${promotionWeeks} week${promotionWeeks > 1 ? 's' : ''}`,
          })
          .select()
          .single();

        if (!error) {
          console.log('[Promote] payment_requests success:', data);
          toast({ title: "Request Submitted!", description: "Admin will review your payment soon." });
          setScreenshotFile(null);
          setScreenshotPreview(null);
          setPromotionWeeks(1);
          setTimeout(() => router.push('/admin/promotions'), 1500);
          return;
        }
        console.warn('[Promote] payment_requests failed, trying promotion_requests...');
      } catch (e) {
        console.warn('[Promote] payment_requests error:', e);
      }

      // Method 3: Try promotion_requests table
      try {
        console.log('[Promote] Trying promotion_requests insert...');
        const { data, error } = await supabase
          .from('promotion_requests')
          .insert({
            property_id: property.id,
            property_title: property.title || 'Untitled',
            user_id: user.uid,
            weeks: promotionWeeks,
            amount: amount,
            screenshot_url: up.url,
            status: 'pending',
          })
          .select()
          .single();

        if (!error) {
          console.log('[Promote] promotion_requests success:', data);
          toast({ title: "Request Submitted!", description: "Admin will review your payment soon." });
          setScreenshotFile(null);
          setScreenshotPreview(null);
          setPromotionWeeks(1);
          setTimeout(() => router.push('/admin/promotions'), 1500);
          return;
        }
        console.warn('[Promote] promotion_requests failed, trying promotions...');
      } catch (e) {
        console.warn('[Promote] promotion_requests error:', e);
      }

      // Method 4: Try promotions table
      try {
        console.log('[Promote] Trying promotions insert...');
        const { data, error } = await supabase
          .from('promotions')
          .insert({
            property_id: property.id,
            agent_id: user.uid,
            weeks: promotionWeeks,
            screenshot_url: up.url,
            status: 'pending',
          })
          .select()
          .single();

        if (!error) {
          console.log('[Promote] promotions success:', data);
          toast({ title: "Request Submitted!", description: "Admin will review your payment soon." });
          setScreenshotFile(null);
          setScreenshotPreview(null);
          setPromotionWeeks(1);
          setTimeout(() => router.push('/admin/promotions'), 1500);
          return;
        }
        throw new Error('All submission methods failed');
      } catch (e) {
        console.error('[Promote] All methods failed');
        throw e;
      }
    } catch (error: any) {
      console.error('[Promote] Full error:', error);
      const errorMsg = error?.message || error?.details || JSON.stringify(error);
      console.error('[Promote] Error message:', errorMsg);
      setSubmitError(errorMsg);
      toast({ variant: "destructive", title: "Submission Failed", description: errorMsg });
    } finally {
      setIsSubmitting(false);
      console.log("[Promote] Submission process finished.");
      console.log("================== PROMOTION SUBMISSION END ==================");
    }
  };

  async function fetchFirstAvailable(table: string, filter?: (q: any) => any) {
    let q: any = supabase.from(table).select('*').order('created_at', { ascending: false }).limit(50);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw error;
    return data as PromotionRow[];
  }

  async function loadList() {
    try {
      setLoadingList(true);
      setErrorMsg(null);

      const tries: Array<() => Promise<PromotionRow[]>> = [
        () => fetchFirstAvailable('promotions', (q) => (user?.uid ? q.eq('agent_id', user.uid) : q)),
        () => fetchFirstAvailable('promotion_requests', (q) => (user?.uid ? q.eq('user_id', user.uid) : q)),
        () =>
          fetchFirstAvailable('payment_requests', (q) =>
            (user?.uid ? q.eq('user_id', user.uid) : q).eq('type', 'promotion')
          ),
      ];

      for (const t of tries) {
        try {
          const result = await t();
          setRows(result || []);
          return;
        } catch (_) {}
      }
      setRows([]);
    } catch (e) {
      console.error('[Promotion] list load error', e);
      setErrorMsg(String((e as any)?.message || e));
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [retryTick, user?.uid]);

  const canSubmit = useMemo(() => {
    const hasFile = !!screenshotFile;
    const hasProperty = !!(propertyIdParam || property?.id);
    const notSubmitting = !isSubmitting;
    return hasFile && hasProperty && notSubmitting;
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
        {/* Promotion Form */}
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
                <Label htmlFor="screenshot">Screenshot</Label>
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
                disabled={!canSubmit || isSubmitting}
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

        {/* Promotion History */}
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
              ) : errorMsg ? (
                <div className="py-4 text-center text-red-600">{errorMsg}</div>
              ) : rows.length > 0 ? (
                <div className="space-y-4">
                  {rows.map((row) => (
                    <div key={row.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            {row.property_title || row.propertyTitle || 'Untitled Property'}
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
                      {(row.screenshot_url || row.screenshotUrl) ? (
                        <div className="mt-2">
                          <Image
                            src={row.screenshot_url || row.screenshotUrl || ''}
                            alt="Promotion screenshot"
                            width={100}
                            height={100}
                            className="rounded-md border object-cover"
                          />
                        </div>
                      ) : null}
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
