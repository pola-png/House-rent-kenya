"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadToWasabi } from "@/lib/wasabi";
import { useToast } from "@/hooks/use-toast";

export default function NewDevelopmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/admin/developments/new");
  }, [loading, user, router]);

  const onUpload = async (files: FileList | null) => {
    if (!files || !user) return;
    try {
      const arr = Array.from(files);
      const uploaded: string[] = [];
      for (const f of arr) {
        const key = `developments/${user.uid}/${Date.now()}-${f.name}`;
        const url = await uploadToWasabi(f, { key });
        uploaded.push(url);
      }
      setImages((prev) => [...prev, ...uploaded]);
      toast({ title: "Uploaded", description: `${uploaded.length} image(s) added` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Upload failed", description: e?.message || "Try again" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSave = async () => {
    if (!user) return;
    if (!title.trim() || !description.trim()) {
      toast({ variant: "destructive", title: "Missing info", description: "Title and description are required" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("developments").insert({
        title,
        description,
        city: city || null,
        location: location || null,
        images,
        landlordId: user.uid,
      });
      if (error) throw error;
      toast({ title: "Saved", description: "Development posted" });
      router.push("/admin/dashboard");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Save failed", description: e?.message || "Try again" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Post a Development</h1>
        <p className="text-muted-foreground">Create a new development entry visible to users</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Fill in development information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kilimani Heights – Phase 2" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Project overview, amenities, timelines..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Nairobi" />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Kilimani" />
            </div>
          </div>
          <div>
            <Label>Images</Label>
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => onUpload(e.target.files)} />
            </div>
            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((src) => (
                  <img key={src} src={src} alt="preview" className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
          <div className="pt-2">
            <Button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save Development"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

