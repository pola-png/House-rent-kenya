"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-supabase";
import { Loader2, Upload } from "lucide-react";

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
    console.log("=== SUBMIT START ===");
    setSubmitError("");
    
    if (!user) {
      console.log("No user");
      setSubmitError("You must be logged in");
      return;
    }

    if (!file) {
      console.log("No file");
      setSubmitError("Please attach a screenshot");
      return;
    }
    if (!propertyId.trim()) {
      console.log("No propertyId");
      setSubmitError("Please provide a property ID");
      return;
    }

    setSubmitting(true);
    try {
      console.log("Getting auth token...");
      const { data: { session } } = await (await import("@/lib/supabase")).supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error("No auth token");
      }

      console.log("Creating FormData...");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("propertyId", propertyId.trim());
      formData.append("propertyTitle", propertyTitle.trim() || "Untitled");
      formData.append("weeks", weeks.toString());

      console.log("Calling API endpoint...");
      const response = await fetch("/api/admin/promotions/submit", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      toast({ title: "Success", description: "Promotion request submitted" });
      setFile(null);
      setWeeks(1);
      setPropertyId("");
      setPropertyTitle("");
    } catch (error: any) {
      console.error("=== ERROR ===", error);
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