"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type ArticleRow = {
  id: string;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export default function AdminBlogListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<ArticleRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login?redirect=/admin/blog");
  }, [loading, user, router]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("articles").select("*").order('created_at', { ascending: false });
        if (error) throw error;
        setRows(data as ArticleRow[]);
      } catch (e) {
        setRows([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Blog Posts</h1>
          <p className="text-muted-foreground">Manage published articles</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">New Post</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-6 w-3/4 mt-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(rows || []).map((row) => (
            <Card key={row.id} className="overflow-hidden">
              {row.image_url && (
                <div className="relative h-40 w-full">
                  <img src={row.image_url} alt={row.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{row.title}</CardTitle>
                {row.category && <CardDescription>{row.category}</CardDescription>}
              </CardHeader>
              <CardContent>
                {row.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{row.excerpt}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

