"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Star, Upload, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromotePropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [promotionWeeks, setPromotionWeeks] = useState(1);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const weeklyRate = 5;

  useEffect(() => {
    if (user && params.id) {
      fetchProperty();
    }
  }, [user, params.id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .eq('landlordId', user?.uid)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load property details."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
    }
  };

  const handleSubmitPromotion = async () => {
    if (!screenshotFile) {
      toast({
        variant: "destructive",
        title: "Screenshot Required",
        description: "Please upload a payment screenshot to proceed."
      });
      return;
    }

    if (!user || !property) return;

    setSubmitting(true);
    try {
      const fileExt = screenshotFile.name.split('.').pop();
      const fileName = `promotion-${user.uid}-${Date.now()}.${fileExt}`;
      const filePath = `promotion-screenshots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, screenshotFile);

      if (uploadError) throw uploadError;

      toast({
        title: "Promotion Request Submitted!",
        description: "An admin will review your payment and activate the promotion soon."
      });

      router.push('/admin/properties');
    } catch (error: any) {
      console.error('Error submitting promotion:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Could not submit promotion request."
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Property not found.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/properties">Back to My Listings</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline">Promote Property</h1>
          <p className="text-muted-foreground">{property.title}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Feature as "Pro"
          </CardTitle>
          <CardDescription>
            Promote this property on the homepage and at the top of search results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Benefits:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✓ Featured on homepage</li>
              <li>✓ Top position in search</li>
              <li>✓ Special "Pro" badge</li>
              <li>✓ 3x more visibility</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
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
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-2xl text-primary">${(promotionWeeks * weeklyRate)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="text-sm bg-primary/10 p-4 rounded-md">
              <p className="font-semibold mb-2">Step 1: M-Pesa Payment</p>
              <p>Send to: <span className="font-bold">+254704202939</span></p>
              <p>Name: <span className="font-bold">Edwin</span></p>
              <p>Amount: <span className="font-bold">${(promotionWeeks * weeklyRate)}</span></p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="screenshot-upload">Step 2: Upload Screenshot</Label>
              <Input 
                id="screenshot-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleScreenshotChange}
              />
              {screenshotFile && (
                <p className="text-xs text-muted-foreground">
                  {screenshotFile.name}
                </p>
              )}
            </div>

            <Button 
              onClick={handleSubmitPromotion} 
              disabled={!screenshotFile || submitting}
              className="w-full"
              size="lg"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Upload className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Admin will approve and activate your promotion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
