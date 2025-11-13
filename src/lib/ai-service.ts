const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('AI service not configured');
  }
  return apiKey;
};

export const generateWithAI = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  
  const models = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];
  
  let response;
  let lastError;
  
  for (const model of models) {
    try {
      if (!prompt) continue;
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      if (response.ok) break;
      lastError = await response.json();
    } catch (error) {
      lastError = error;
      continue;
    }
  }
  
  if (!response || !response.ok) {
    throw new Error(lastError?.error?.message || 'All models failed');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  if (!text) throw new Error('No content generated');
  
  return text;
};