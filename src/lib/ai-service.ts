const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBytiBEktDdWwh6tOF_GYZT_Ds7kCOvXvs';

const callGemini = async (prompt: string): Promise<string> => {
  if (!prompt.trim()) return '';

  const models = ['gemini-3-flash-preview', 'gemini-2.5-flash'];
  
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      } else if (response.status === 429) {
        // Rate limited, wait before trying next model
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('Gemini API error');
};

export const generateWithAI = async (prompt: string): Promise<string> => {
  try {
    const text = await callGemini(prompt);
    return text;
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    if ((error as any)?.message?.includes('401')) {
      throw new Error('AI service not configured. Please check API key.');
    }
    
    throw new Error('AI service is currently unavailable. Please try again later.');
  }
};
