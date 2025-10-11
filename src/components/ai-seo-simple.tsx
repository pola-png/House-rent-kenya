'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateSEODescription, generateAIKeywords, optimizeTitle } from '@/lib/ai-seo';
import { useToast } from '@/hooks/use-toast';

interface AISEOSimpleProps {
  formData: {
    title: string;
    description: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    location: string;
    city: string;
    amenities: string;
    price: number;
  };
  onApply: (data: { title: string; description: string; keywords: string }) => void;
}

export function AISEOSimple({ formData, onApply }: AISEOSimpleProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.title || !formData.location || !formData.city) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in title, location, and city first.',
      });
      return;
    }

    setLoading(true);
    try {
      const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
      
      const optimizedTitle = optimizeTitle(
        formData.title,
        formData.location,
        formData.propertyType
      );

      const optimizedDescription = await generateSEODescription({
        ...formData,
        amenities: amenitiesArray,
      });

      const keywords = await generateAIKeywords({
        title: optimizedTitle,
        description: optimizedDescription,
        location: formData.location,
        city: formData.city,
        propertyType: formData.propertyType,
      });

      onApply({
        title: optimizedTitle,
        description: optimizedDescription,
        keywords,
      });

      toast({
        title: 'SEO Optimized!',
        description: 'Your listing has been optimized for search engines.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate SEO content.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGenerate}
      disabled={loading}
      className="w-full"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate AI SEO Content
        </>
      )}
    </Button>
  );
}
