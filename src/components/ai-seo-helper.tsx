'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateSEODescription, generateAIKeywords, getSEOScore, optimizeTitle } from '@/lib/ai-seo';

interface AISEOHelperProps {
  propertyData: {
    title: string;
    description: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    location: string;
    city: string;
    amenities: string[];
    price: number;
  };
  onApply: (data: { title: string; description: string; keywords: string }) => void;
}

export function AISEOHelper({ propertyData, onApply }: AISEOHelperProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    title: string;
    description: string;
    keywords: string;
    score: number;
    tips: string[];
  } | null>(null);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      // Generate optimized content
      const optimizedTitle = optimizeTitle(
        propertyData.title,
        propertyData.location,
        propertyData.propertyType
      );

      const optimizedDescription = await generateSEODescription(propertyData);
      const keywords = await generateAIKeywords({
        title: optimizedTitle,
        description: optimizedDescription,
        location: propertyData.location,
        city: propertyData.city,
        propertyType: propertyData.propertyType,
      });

      const { score, suggestions: tips } = getSEOScore(
        optimizedTitle,
        optimizedDescription,
        keywords
      );

      setSuggestions({
        title: optimizedTitle,
        description: optimizedDescription,
        keywords,
        score,
        tips,
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestions = () => {
    if (suggestions) {
      onApply({
        title: suggestions.title,
        description: suggestions.description,
        keywords: suggestions.keywords,
      });
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI SEO Optimizer
        </CardTitle>
        <CardDescription>
          Generate SEO-optimized title, description, and keywords based on Google trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={generateSuggestions}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>Generating...</>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Generate SEO Suggestions
            </>
          )}
        </Button>

        {suggestions && (
          <div className="space-y-4">
            {/* SEO Score */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-semibold">SEO Score</span>
              <Badge variant={suggestions.score >= 80 ? 'default' : 'secondary'}>
                {suggestions.score}/100
              </Badge>
            </div>

            {/* Optimized Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Optimized Title</label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{suggestions.title}</p>
              </div>
            </div>

            {/* Optimized Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Optimized Description</label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{suggestions.description}</p>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-sm font-medium">SEO Keywords</label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{suggestions.keywords}</p>
              </div>
            </div>

            {/* Tips */}
            {suggestions.tips.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">SEO Tips</label>
                <div className="space-y-2">
                  {suggestions.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Button */}
            <Button onClick={applySuggestions} className="w-full" variant="default">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Apply SEO Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
