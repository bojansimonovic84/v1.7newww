
import { GoogleGenAI } from "@google/genai";
import type { OrderDetails } from '../types';
import { saveOrder } from './supabase';
import { BOT_KNOWLEDGE_BASE } from './botKnowledge';

/**
 * THE FREQUENCY CODE™ | Neural Interface
 * Strictly follows the direct process.env.API_KEY usage rules.
 */
export const generateMeditationScript = async (details: OrderDetails): Promise<string> => {
  try {
    // Initialize exactly when needed to ensure fresh environment access
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a high-end, bespoke meditation blueprint for ${details.name}. 
      Manifestation Goal: ${details.detailedGoal}. 
      Vocal Resonance: ${details.voice}. 
      Tone: Luxurious, authoritative, scientific.`,
      config: {
        systemInstruction: "You are the Senior Manifestation Architect for THE FREQUENCY CODE™. Generate a professional script. Focus on present-tense affirmations.",
      },
    });

    const script = response.text || "Neural blueprint transmission locked.";
    await saveOrder(details, script);
    return script;
  } catch (error) {
    console.error("Neural Sync Error:", error);
    return "Drafting foundation manually. Studio protocol active.";
  }
};

export const chatWithSupport = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> => {
    try {
        // Create new instance per call for maximum reliability on Vercel
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                ...history.map(h => ({ role: h.role, parts: h.parts })),
                { role: 'user', parts: [{ text: message }] }
            ],
            config: {
                systemInstruction: BOT_KNOWLEDGE_BASE,
                temperature: 0.7,
            }
        });
        return response.text || "Synchronizing with studio servers...";
    } catch (error: any) {
        console.error("Chat sync failed:", error);
        return "The neural link is experiencing lag. Please ensure your API_KEY is correctly set in Vercel and then REDEPLOY your app.";
    }
}
