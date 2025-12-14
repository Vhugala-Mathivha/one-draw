import { GoogleGenAI, Type } from "@google/genai";
import { OracleResponse, SELECTION_COUNT, TOTAL_NUMBERS } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askOracle = async (prompt: string): Promise<OracleResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The user is playing a lottery game (picking ${SELECTION_COUNT} unique numbers from 1 to ${TOTAL_NUMBERS}). 
      They are asking the 'Oracle' for luck with this prompt: "${prompt}".
      
      Generate ${SELECTION_COUNT} unique lucky integer numbers.
      Also provide a mystical, short, cryptic, or inspiring 1-sentence reason why these numbers match their vibe.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            numbers: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER },
              description: `Exactly ${SELECTION_COUNT} unique integers between 1 and ${TOTAL_NUMBERS}`,
            },
            reason: {
              type: Type.STRING,
              description: "A short mystical explanation.",
            },
          },
          required: ["numbers", "reason"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle");
    
    const data = JSON.parse(text) as OracleResponse;
    return data;
  } catch (error) {
    console.error("Oracle error:", error);
    // Fallback if AI fails
    const fallbackNumbers = new Set<number>();
    while(fallbackNumbers.size < SELECTION_COUNT) {
      fallbackNumbers.add(Math.floor(Math.random() * TOTAL_NUMBERS) + 1);
    }
    return {
      numbers: Array.from(fallbackNumbers),
      reason: "The cosmic mists were too thick, but Fate has still cast your lot."
    };
  }
};
