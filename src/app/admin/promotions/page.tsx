"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadToWasabi } from "@/lib/wasabi";
import { useAuth } from "@/hooks/use-auth-supabase";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PromotionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [propertyId, setPropertyId] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [weeks, setWeeks] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    setSubmitError("");
    
    if (!user) {
      setSubmitError("You must be logged in");
      return;
    }

    if (!file) {
      setSubmitError("Please attach a screenshot");
      return;
    }
    if (!propertyId.trim()) {
      setSubmitError("Please provide a property ID");
      return;
    }

    setSubmitting(true);
    try {
      // Upload to Wasabi
      const key = `promotions/${user.uid}/${Date.now()}-${file.name}`;
      const screenshotUrl = await uploadToWasabi(file, { key });

      // Insert to Supabase
      const { error } = await supabase
        .from('payment_requests')
        .insert([{
          propertyId: propertyId.trim(),
          propertyTitle: propertyTitle.trim() || 'Untitled',
          userId: user.uid,
          amount: weeks * 5,
          paymentScreenshot: screenshotUrl,
          status: 'pending',
          promotionType: `Featured - ${weeks} week${weeks > 1 ? 's' : ''}`,
          createdAt: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({ title: "Success", description: "Promotion request submitted" });
      setFile(null);
      setWeeks(1);
      setPropertyId("");
      setPropertyTitle("");
    } catch (error: any) {
      console.error('Error:', error);
      setSubmitError(error?.message || "Submission failed");
      toast({ variant: "destructive", title: "Error", description: error?.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please log in to submit a promotion request</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Promote Property</CardTitle>
          <CardDescription>Submit a promotion request for your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="propertyId">Property ID *</Label>
            <Input
              id="propertyId"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              placeholder="Enter property ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyTitle">Property Title</Label>
            <Input
              id="propertyTitle"
              value={propertyTitle}
              onChange={(e) => setPropertyTitle(e.target.value)}
              placeholder="Enter property title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeks">Number of Weeks *</Label>
            <Input
              id="weeks"
              type="number"
              min="1"
              max="52"
              value={weeks}
              onChange={(e) => setWeeks(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <p className="text-xs text-muted-foreground">KES {weeks * 5} total</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Payment Screenshot *</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
            />
            {file && <p className="text-xs text-green-600">✓ {file.name}</p>}
          </div>

          {submitError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{submitError}</div>}

          <Button onClick={handleSubmit} disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Promotion
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}