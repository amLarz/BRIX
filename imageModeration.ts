import * as nsfwjs from 'nsfwjs';
import * as tf from '@tensorflow/tfjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const env = (import.meta as any).env;
const genAI = new GoogleGenerativeAI(env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface ImageModerationResult {
  isAllowed: boolean;
  reason?: string;
  scores?: { [key: string]: number };
}

let nsfwModel: any = null;

const loadNSFWModel = async () => {
  if (!nsfwModel) {
    nsfwModel = await nsfwjs.load();
  }
  return nsfwModel;
};

const fileToGenerativePart = async (blobUrl: string) => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: blob.type,
        },
      });
    };
    reader.readAsDataURL(blob);
  });
};

export const moderateImage = async (blobUrl: string): Promise<ImageModerationResult> => {
  try {
    // 1. Local NSFWJS Check
    const img = new Image();
    img.src = blobUrl;
    await new Promise((resolve) => (img.onload = resolve));

    const nsfw = await loadNSFWModel();
    const predictions = await nsfw.classify(img);
    
    const scores: { [key: string]: number } = {};
    predictions.forEach(p => {
      scores[p.className] = p.probability;
    });

    // Combined sexual content threshold
    const sexualContentScore = (scores['Porn'] || 0) + (scores['Hentai'] || 0) + (scores['Sexy'] || 0);
    
    if (sexualContentScore > 0.6) {
      return {
        isAllowed: false,
        reason: "Image contains inappropriate or explicit content.",
        scores
      };
    }

    // 2. Gemini Political Mockery & Neutrality Check
    const env = (import.meta as any).env;
    if (!env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
      console.warn("Gemini API key missing. Skipping political mockery check.");
      return { isAllowed: true, scores };
    }

    const imagePart = await fileToGenerativePart(blobUrl);
    const prompt = `
      Analyze this image for the website "BRIX", a transparency platform for infrastructure projects.
      The community guidelines prohibit:
      1. Mockery or inflammatory depictions of politicians or public figures.
      2. Partisan political caricatures or biased political messaging.
      3. Red-tagging imagery or symbols associated with terrorism or rebellion.
      4. Graphic violence or hate speech.

      Is this image appropriate for a neutral, professional infrastructure transparency's platform?
      Respond with strictly JSON: 
      { "isAllowed": boolean, "reason": "concise explanation if blocked" }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response (Gemini sometimes wraps it in markdown blocks)
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      const moderation = JSON.parse(jsonMatch[0]);
      if (!moderation.isAllowed) {
        return {
          isAllowed: false,
          reason: moderation.reason || "Image violates community neutrality and professionalism guidelines.",
          scores
        };
      }
    }

    return { isAllowed: true, scores };
  } catch (error) {
    console.error("Image moderation error:", error);
    // Fail safe: allow if moderation fails, or you could choose to block.
    // Given it's a transparency platform, blocking might be safer if the check fails.
    return { isAllowed: true };
  }
};
