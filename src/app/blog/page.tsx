
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import placeholderImages from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Article } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPage() {
  const firestore = useFirestore();
  // We can re-use the 'articles' collection for the blog
  const articlesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'articles');
  }, [firestore]);

  const { data: blogPosts, isLoading } = useCollection<Article>(articlesQuery);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Newspaper className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Our Blog</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Insights, trends, and stories from the Kenyan real estate market.
          </p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-56 w-full" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts?.map(post => {
              const image = placeholderImages.placeholderImages.find(img => img.id === post.imageId);
              return (
                <Card key={post.id} className="flex flex-col overflow-hidden group">
                  <Link href="#" className="block">
                    <div className="relative h-56 w-full">
                      {image && (
                        <Image
                          src={image.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={image.imageHint}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold py-1 px-2 rounded">{post.category}</span>
                    </div>
                  </Link>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl h-16">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground flex-grow">{post.excerpt}</p>
                    <Button asChild variant="link" className="p-0 justify-start mt-4 h-auto">
                      <Link href="#">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
