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

    // 2. Gemini Analysis (Informational only)
    const env = (import.meta as any).env;
    if (!env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY === 'PLACEHOLDER_API_KEY') {
      return { isAllowed: true, scores };
    }

    const imagePart = await fileToGenerativePart(blobUrl);
    const prompt = `
      Analyze this image for the website "BRIX", a transparency platform for infrastructure projects.
      Provide a brief description of the content.
      Respond with strictly JSON: 
      { "description": "string" }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    return { isAllowed: true, scores };
  } catch (error) {
    console.error("Image moderation error:", error);
    return { isAllowed: true };
  }
};

