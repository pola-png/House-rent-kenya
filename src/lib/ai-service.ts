const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'sk-your-openai-key-here';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBytiBEktDdWwh6tOF_GYZT_Ds7kCOvXvs';

const callOpenAI = async (prompt: string): Promise<string> => {
  if (!prompt.trim()) return '';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
};

const callGemini = async (prompt: string): Promise<string> => {
  if (!prompt.trim()) return '';

  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-001'];
  
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
      }
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('Gemini API error');
};

export const generateWithAI = async (prompt: string): Promise<string> => {
  try {
    const text = await callOpenAI(prompt);
    return text;
  } catch (openaiError) {
    console.error('OpenAI failed, trying Gemini:', openaiError);
    
    try {
      const text = await callGemini(prompt);
      return text;
    } catch (geminiError) {
      console.error('Both AI services failed:', { openaiError, geminiError });
      
      if (openaiError?.message?.includes('401') || geminiError?.message?.includes('401')) {
        throw new Error('AI service not configured. Please check API keys.');
      }
      
      throw new Error('AI services are currently unavailable. Please try again later.');
    }
  }
};
