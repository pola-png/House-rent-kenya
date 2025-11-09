"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth-supabase";
import { Loader2, Upload } from "lucide-react";

export default function PromotionsPage() {
  const { user } = useAuth();
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
      toast({ variant: "destructive", title: "Error", description: "Please log in first" });
      return;
    }

    if (!file) {
      setSubmitError("Please attach a screenshot");
      return;
    }
    if (!propertyId) {
      setSubmitError("Please provide a property ID");
      return;
    }

    setSubmitting(true);
    try {
      console.log('Starting upload...', { fileName: file.name, size: file.size, userId: user.uid });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `promotion-${propertyId}-${Date.now()}.${fileExt}`;
      const filePath = `promotions/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, { upsert: true });

      console.log('Upload response:', { uploadError, uploadData });
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      const { error: insertError, data: insertData } = await supabase
        .from('payment_requests')
        .insert([{
          propertyId,
          propertyTitle: propertyTitle || 'Untitled',
          userId: user.uid,
          amount: weeks * 5,
          paymentScreenshot: publicUrl,
          status: 'pending',
          promotionType: `Featured - ${weeks} week${weeks > 1 ? 's' : ''}`,
          createdAt: new Date().toISOString()
        }]);

      console.log('Insert response:', { insertError, insertData });
      if (insertError) throw new Error(`Database insert failed: ${insertError.message}`);

      toast({ title: "Success", description: "Promotion request submitted" });
      setFile(null);
      setWeeks(1);
      setPropertyId("");
      setPropertyTitle("");
    } catch (error: any) {
      console.error('Full error:', error);
      setSubmitError(error?.message || "Submission failed");
      toast({ variant: "destructive", title: "Error", description: error?.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Promote Property</CardTitle>
          <CardDescription>Submit a promotion request for your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="propertyId">Property ID</Label>
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
            <Label htmlFor="weeks">Number of Weeks</Label>
            <Input
              id="weeks"
              type="number"
              min="1"
              value={weeks}
              onChange={(e) => setWeeks(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot">Payment Screenshot</Label>
            <Input
              id="screenshot"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
            />
          </div>

          {submitError && <div className="text-sm text-red-600">{submitError}</div>}

          <Button onClick={handleSubmit} disabled={submitting || !user} className="w-full">
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