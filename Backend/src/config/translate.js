import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = {
  preferred: "gemini-3.1-flash-lite-preview",
  alternate: "gemini-3-flash-preview",
  fallback : "gemini-2.5-flash"
};

let preferredHealthy = true;

export const translateMsg = async (text, history, targetLang) => {
  const payload = {
    config: { systemInstruction: "Silent translator. Output ONLY translation." },
    contents: [{ role: 'user', parts: [{ text: `Context: ${history}\nTarget: ${targetLang}\nTranslate: "${text}"` }] }]
  }
  try {

    const modelsToUse = preferredHealthy
      ? [ai.models.generateContent({ model: MODELS.preferred, ...payload }),
        ai.models.generateContent({ model: MODELS.alternate, ...payload }),
        ai.models.generateContent({ model: MODELS.fallback, ...payload })]

      : [ai.models.generateContent({ model: MODELS.alternate, ...payload }),
        ai.models.generateContent({ model: MODELS.fallback, ...payload })]
    
    const response = await Promise.any(modelsToUse);

    return response?.text?.trim?.() || null;

  } catch (error) {
    preferredHealthy = false;
    setTimeout(() => { preferredHealthy = true; }, 5*60*1000);

    return null;
  }
};