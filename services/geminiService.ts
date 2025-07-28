import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getWordHint(word: string): Promise<string> {
  try {
    const prompt = `Provide a concise, one-sentence hint for the 5-letter English word '${word}'. The hint must not contain the word itself or any of its letters. The hint should be clever and relate to the word's meaning or common usage.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate hint from Gemini API.');
  }
}
