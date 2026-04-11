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
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

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

  const generateTitle = async () => {
    setIsGeneratingTitle(true);
    try {
      const prompt = `Generate a catchy, SEO-optimized property listing title for a ${formData.bedrooms}-bedroom ${formData.propertyType} in ${formData.location}, ${formData.city}. Keep it under 80 characters. Only return the title.`;
      const title = await generateWithAI(prompt);
      
      setGeneratedContent(prev => ({ ...prev, title: title.trim() } as AIGeneratedContent));
      onApplyTitle(title.trim());
      
      toast({
        title: "Title Generated!",
        description: "AI-generated title has been applied to your form.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate title. Please try again.",
      });
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      const prompt = `Write a compelling property description for a ${formData.bedrooms}-bedroom, ${formData.bathrooms}-bathroom ${formData.propertyType} in ${formData.location}, ${formData.city}. Price: Ksh ${formData.price.toLocaleString()}. Amenities: ${formData.amenities || 'standard amenities'}. Make it engaging with paragraphs and bullet points.`;
      const description = await generateWithAI(prompt);
      
      setGeneratedContent(prev => ({ ...prev, description } as AIGeneratedContent));
      onApplyDescription(description);
      
      toast({
        title: "Description Generated!",
        description: "AI-generated description has been applied to your form.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate description. Please try again.",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const generateKeywords = async () => {
    setIsGeneratingKeywords(true);
    try {
      const prompt = `Generate 10-15 SEO keywords for a ${formData.bedrooms}-bedroom ${formData.propertyType} in ${formData.location}, ${formData.city}. Return as comma-separated list only.`;
      const keywords = await generateWithAI(prompt);
      
      setGeneratedContent(prev => ({ ...prev, keywords: keywords.trim() } as AIGeneratedContent));
      onApplyKeywords(keywords.trim());
      
      toast({
        title: "Keywords Generated!",
        description: "AI-generated keywords have been applied to your form.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate keywords. Please try again.",
      });
    } finally {
      setIsGeneratingKeywords(false);
    }
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



  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium">AI Content Generator</span>
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
          Beta
        </Badge>
      </div>

      {/* Title Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Property Title</label>
        <div className="text-xs text-gray-500 mb-2">Create an engaging title for your property listing</div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateTitle}
          disabled={isGeneratingTitle || !formData.propertyType || !formData.location}
          className="w-full"
        >
          {isGeneratingTitle ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          {isGeneratingTitle ? 'Generating Title...' : 'Generate AI Title'}
        </Button>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Property Description</label>
        <div className="text-xs text-gray-500 mb-2">Generate a detailed description highlighting key features</div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateDescription}
          disabled={isGeneratingDescription || !formData.propertyType || !formData.location}
          className="w-full"
        >
          {isGeneratingDescription ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          {isGeneratingDescription ? 'Generating Description...' : 'Generate AI Description'}
        </Button>
      </div>

      {/* SEO Keywords Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">SEO Keywords</label>
        <div className="text-xs text-gray-500 mb-2">Generate relevant keywords to improve search visibility</div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateKeywords}
          disabled={isGeneratingKeywords || !formData.propertyType || !formData.location}
          className="w-full"
        >
          {isGeneratingKeywords ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          {isGeneratingKeywords ? 'Generating Keywords...' : 'Generate AI Keywords'}
        </Button>
      </div>

      {!formData.propertyType || !formData.location ? (
        <div className="text-center py-4 text-muted-foreground">
          <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Fill in property type and location to enable AI generation</p>
        </div>
      ) : null}
    </div>
  );
}