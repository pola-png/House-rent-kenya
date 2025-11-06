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

export default function NewBlogPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Advice");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/admin/blog/new");
  }, [loading, user, router]);

  const onUpload = async (file: File | null) => {
    if (!file || !user) return;
    try {
      const key = `blog-covers/${user.uid}/${Date.now()}-${file.name}`;
      const url = await uploadToWasabi(file, { key });
      setCoverUrl(url);
      toast({ title: "Cover uploaded" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Upload failed", description: e?.message || "Try again" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSave = async () => {
    if (!title.trim() || !excerpt.trim()) {
      toast({ variant: "destructive", title: "Missing info", description: "Title and excerpt are required" });
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        title,
        excerpt,
        category,
        image_url: coverUrl, // common naming
        imageId: coverUrl,   // keep compatibility with existing type
        author_id: user?.uid,
        created_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("articles").insert(payload);
      if (error) throw error;
      toast({ title: "Published", description: "Blog post created" });
      router.push("/admin/blog");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Save failed", description: e?.message || "Try again" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">New Blog Post</h1>
        <p className="text-muted-foreground">Write and publish a new article</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>Fill in article information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., How to Find Affordable Rentals in Nairobi" />
          </div>
          <div>
            <Label>Excerpt</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={4} placeholder="Short summary shown on the blog list" />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Advice, Market, Tips..." />
          </div>
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <input ref={fileRef} type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0] || null)} />
            {coverUrl && (
              <div className="mt-2">
                <img src={coverUrl} alt="cover" className="w-full max-w-xs rounded" />
              </div>
            )}
          </div>
          <div className="pt-2">
            <Button onClick={onSave} disabled={saving}>{saving ? "Publishing..." : "Publish"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

