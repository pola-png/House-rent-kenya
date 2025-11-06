import { NextResponse } from 'next/server';
import type { AppRouteHandlerFn } from 'next/dist/server/route-modules/app-route/module';

export const POST: AppRouteHandlerFn = async (request, _context) => {
  try {
    const { prompt, type } = await request.json();
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('Gemini API key not found in environment variables');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const models = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro'
    ];
    let response;
    let lastError;
    
    for (const model of models) {
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }]
            })
          }
        );
        
        if (response.ok) break;
        
        const errorData = await response.json();
        console.error(`Gemini API error for ${model}:`, errorData);
        lastError = errorData;
      } catch (error) {
        console.error(`Network error for ${model}:`, error);
        lastError = error;
        continue;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`All Gemini models failed. Last error: ${lastError?.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!generatedText) {
      console.error('No text generated from Gemini API:', data);
      throw new Error('No content generated');
    }

    return NextResponse.json({ text: generatedText, type });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
};
