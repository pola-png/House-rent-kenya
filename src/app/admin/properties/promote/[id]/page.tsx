"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

export default function PromotePropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [promotionWeeks, setPromotionWeeks] = useState(1);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const weeklyRate = 5;

  useEffect(() => {
    if (user && params?.id) {
      fetchProperty();
    }
  }, [user, params?.id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params?.id)
        .eq('landlordId', user?.uid)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({ variant: "destructive", title: "Error", description: "Property not found" });
      router.push('/admin/properties');
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

  const handleSubmit = async () => {
    if (!screenshotFile) {
      toast({ variant: "destructive", title: "No Screenshot", description: "Please upload payment screenshot" });
      return;
    }

    if (!user || !property) return;

    setIsSubmitting(true);
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

      toast({ title: "Request Submitted!", description: "Admin will review your payment soon." });
      router.push('/admin/promotions');
    } catch (error: any) {
      console.error('Promotion request error:', error);
      toast({ variant: "destructive", title: "Submission Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/properties">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Promote Property</CardTitle>
          <CardDescription>Boost your property's visibility with featured placement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">{property.title}</h3>
            <p className="text-sm text-muted-foreground">{property.location}, {property.city}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="weeks">Number of Weeks</Label>
              <Input
                id="weeks"
                type="number"
                min="1"
                value={promotionWeeks}
                onChange={(e) => setPromotionWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-2"
              />
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-2xl font-bold">${(promotionWeeks * weeklyRate).toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">${weeklyRate} per week</p>
            </div>
          </div>

          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold">Payment Instructions</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Payment via M-Pesa</span></p>
              <p><span className="font-medium">Send Money to:</span> +254706060684</p>
              <p><span className="font-medium">Name:</span> House Rent Kenya</p>
              <p><span className="font-medium">Amount:</span> ${(promotionWeeks * weeklyRate).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleScreenshotChange}
            />
            {screenshotPreview && (
              <div className="relative w-full h-48 mt-4 border rounded-lg overflow-hidden">
                <Image
                  src={screenshotPreview}
                  alt="Payment Screenshot Preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !screenshotFile}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" />Submit for Approval</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
