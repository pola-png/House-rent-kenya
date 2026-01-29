"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Wand2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  title: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  city: string;
  amenities: string;
  price: number;
}

interface AIGeneratedContent {
  title: string;
  description: string;
  keywords: string;
}

interface AISEOSimpleProps {
  formData: FormData;
  onApplyTitle: (title: string) => void;
  onApplyDescription: (description: string) => void;
  onApplyKeywords: (keywords: string) => void;
}

export function AISEOSimple({ formData, onApplyTitle, onApplyDescription, onApplyKeywords }: AISEOSimpleProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAIContent = async () => {
    setIsGenerating(true);
    
    try {
      const titlePrompt = `Generate a catchy, SEO-optimized property listing title for a ${formData.bedrooms}-bedroom ${formData.propertyType} in ${formData.location}, ${formData.city}. Keep it under 80 characters. Only return the title.`;
      
      const descPrompt = `Write a compelling property description for a ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom ${formData.propertyType} in ${formData.location}, ${formData.city}. Price: Ksh ${formData.price.toLocaleString()}. Amenities: ${formData.amenities || 'standard amenities'}. Make it engaging with paragraphs and bullet points.`;
      
      const keywordsPrompt = `Generate 10-15 SEO keywords for a ${formData.bedrooms}-bedroom ${formData.propertyType} in ${formData.location}, ${formData.city}. Return as comma-separated list only.`;

      const generateWithAI = async (prompt: string) => {
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.text || '';
        }
        
        throw new Error('AI generation failed');
      };

      const [title, description, keywords] = await Promise.all([
        generateWithAI(titlePrompt),
        generateWithAI(descPrompt),
        generateWithAI(keywordsPrompt)
      ]);
      
      const aiContent: AIGeneratedContent = {
        title: title.trim(),
        description: description,
        keywords: keywords.trim()
      };
      
      setGeneratedContent(aiContent);
      
      toast({
        title: "AI Content Generated!",
        description: "Review and apply the AI-generated content to your listing.",
      });
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate AI content. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTitle = (data: FormData): string => {
    const templates = [
      `Stunning ${data.bedrooms}BR ${data.propertyType} in Prime ${data.location}`,
      `Luxury ${data.bedrooms}-Bedroom ${data.propertyType} | ${data.location}, ${data.city}`,
      `Modern ${data.bedrooms}BR ${data.propertyType} with Premium Amenities - ${data.location}`,
      `Spacious ${data.bedrooms}-Bedroom ${data.propertyType} in Exclusive ${data.location}`,
      `Premium ${data.bedrooms}BR ${data.propertyType} | Heart of ${data.location}`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generateDescription = (data: FormData): string => {
    const amenitiesList = data.amenities.split(',').map(a => a.trim()).filter(Boolean);
    const amenitiesText = amenitiesList.length > 0 
      ? `Enjoy premium amenities including ${amenitiesList.slice(0, 3).join(', ')}${amenitiesList.length > 3 ? ' and more' : ''}.`
      : 'This property offers excellent amenities for comfortable living.';

    return `Discover this exceptional ${data.bedrooms}-bedroom, ${data.bathrooms}-bathroom ${data.propertyType.toLowerCase()} located in the prestigious ${data.location} area of ${data.city}. 

This beautifully designed property offers modern living at its finest, featuring spacious rooms, contemporary finishes, and thoughtful layouts that maximize both comfort and functionality. ${amenitiesText}

Perfect for ${data.bedrooms <= 2 ? 'professionals, couples, or small families' : 'families or those seeking extra space'}, this property combines convenience with luxury living. The prime location provides easy access to shopping centers, restaurants, schools, and major transport links.

Key Features:
• ${data.bedrooms} spacious bedrooms with ample natural light
• ${data.bathrooms} modern bathroom${data.bathrooms > 1 ? 's' : ''} with quality fixtures
• Prime location in ${data.location}
• ${amenitiesList.length > 0 ? amenitiesList.join('\n• ') : 'Premium amenities'}

Don't miss this opportunity to secure a premium property in one of ${data.city}'s most sought-after neighborhoods. Contact us today to schedule a viewing!`;
  };

  const generateKeywords = (data: FormData): string => {
    const baseKeywords = [
      `${data.bedrooms} bedroom ${data.propertyType.toLowerCase()}`,
      `${data.location.toLowerCase()} property`,
      `${data.city.toLowerCase()} rental`,
      `modern ${data.propertyType.toLowerCase()}`,
      `luxury accommodation`,
      `premium location`,
      `spacious living`,
      `contemporary design`
    ];

    const amenityKeywords = data.amenities.split(',')
      .map(a => a.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 3);

    return [...baseKeywords, ...amenityKeywords].join(', ');
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
      });
    }
  };

  const applyTitle = () => {
    if (generatedContent) {
      onApplyTitle(generatedContent.title);
      toast({
        title: "Title Applied!",
        description: "AI-generated title has been applied to your form.",
      });
    }
  };

  const applyDescription = () => {
    if (generatedContent) {
      onApplyDescription(generatedContent.description);
      toast({
        title: "Description Applied!",
        description: "AI-generated description has been applied to your form.",
      });
    }
  };

  const applyKeywords = () => {
    if (generatedContent) {
      onApplyKeywords(generatedContent.keywords);
      toast({
        title: "Keywords Applied!",
        description: "AI-generated keywords have been applied to your form.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium">AI Content Generator</span>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
            Beta
          </Badge>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateAIContent}
          disabled={isGenerating || !formData.propertyType || !formData.location}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Generating...' : 'Generate AI Content'}
        </Button>
      </div>

      {generatedContent && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-purple-900">AI-Generated Content</h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-purple-800">Title</label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={applyTitle}
                      className="text-xs px-2 py-1 h-7"
                    >
                      Apply
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.title, 'Title')}
                      className="h-7 w-7 p-0"
                    >
                      {copied === 'Title' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <p className="text-sm bg-white p-2 rounded border">{generatedContent.title}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-purple-800">Description</label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={applyDescription}
                      className="text-xs px-2 py-1 h-7"
                    >
                      Apply
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.description, 'Description')}
                      className="h-7 w-7 p-0"
                    >
                      {copied === 'Description' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="text-sm bg-white p-2 rounded border max-h-32 overflow-y-auto">
                  {generatedContent.description.split('\n').map((line, index) => (
                    <p key={index} className={line.trim() === '' ? 'mb-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-purple-800">SEO Keywords</label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={applyKeywords}
                      className="text-xs px-2 py-1 h-7"
                    >
                      Apply
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.keywords, 'Keywords')}
                      className="h-7 w-7 p-0"
                    >
                      {copied === 'Keywords' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <p className="text-sm bg-white p-2 rounded border">{generatedContent.keywords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!generatedContent && !isGenerating && (
        <div className="text-center py-4 text-muted-foreground">
          <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Fill in property details and click "Generate AI Content" to create optimized listings</p>
        </div>
      )}
    </div>
  );
}