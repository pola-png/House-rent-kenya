const callGemini = async (prompt: string): Promise<string> => {
  if (!prompt.trim()) return '';

  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.text || '';
    }
    
    throw new Error('Server request failed');
  } catch (error) {
    throw new Error('AI generation failed');
  }
};

export const generateWithAI = async (prompt: string): Promise<string> => {
  try {
    const text = await callGemini(prompt);
    return text;
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('AI service is currently unavailable. Please try again later.');
  }
};