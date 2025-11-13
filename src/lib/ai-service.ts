import { GoogleGenerativeAI } from '@google/generative-ai';

const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('AI service not configured');
  }
  return apiKey;
};

export const generateWithAI = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenerativeAI(apiKey);
  
  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-lite'
  ];
  
  let lastError;
  
  for (const modelName of models) {
    try {
      if (!prompt) continue;
      const model = ai.getGenerativeModel({ model: modelName });
      const response = await model.generateContent(prompt);
      return response.response.text();
    } catch (error) {
      lastError = error;
      continue;
    }
  }
  
  throw new Error(lastError?.message || 'All models failed');
};