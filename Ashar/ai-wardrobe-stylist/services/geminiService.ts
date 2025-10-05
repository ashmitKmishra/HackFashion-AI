import { GoogleGenAI, Type } from "@google/genai";
import type { ClothingItem, OutfitCriteria, OutfitSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface CategorizedItem {
  category: string;
  description: string;
}

const fileToGenerativePart = (
  data: string,
  mimeType: string
) => {
  return {
    inlineData: {
      data,
      mimeType,
    },
  };
};

export const categorizeClothingItems = async (
  images: { data: string; mimeType: string }[]
): Promise<CategorizedItem[]> => {
  try {
    const imageParts = images.map((img) =>
      fileToGenerativePart(img.data, img.mimeType)
    );

    const prompt = `Analyze these images of clothing items. For each image, in the exact same order they are provided, identify its category and provide a brief, descriptive name.

    Valid categories are: 'Top', 'Bottom', 'Outerwear', 'Accessory', 'Shoes', 'Full Body'.

    Return the result as a valid JSON array of objects. Each object must have two keys: "category" and "description". Do not include any other text, explanations, or markdown formatting outside of the JSON array.
    Example for two images:
    [
      { "category": "Top", "description": "Blue short-sleeve t-shirt" },
      { "category": "Bottom", "description": "Light-wash denim jeans" }
    ]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [ ...imageParts, { text: prompt } ] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "The category of the clothing item.",
              },
              description: {
                type: Type.STRING,
                description: "A brief description of the clothing item.",
              },
            },
          },
        },
      },
    });

    const resultText = response.text.trim();
    const resultJson = JSON.parse(resultText);
    return resultJson as CategorizedItem[];
  } catch (error) {
    console.error("Error categorizing clothing:", error);
    throw new Error("Failed to categorize images. Please check the console for details.");
  }
};


export const generateOutfits = async (
  wardrobe: ClothingItem[],
  criteria: OutfitCriteria
): Promise<OutfitSuggestion> => {
  try {
    const wardrobeDescriptions = wardrobe.map(item => `- ${item.description} (Category: ${item.category})`).join('\n');
    
    const prompt = `
    You are an expert fashion stylist. Based on the following user criteria and available wardrobe, create one stylish outfit combination.

    **User Criteria:**
    - Event: ${criteria.event}
    - Weather: ${criteria.weather}
    - Desired Mood: ${criteria.mood}

    **Available Wardrobe Items:**
    ${wardrobeDescriptions}

    **Instructions:**
    1.  Select appropriate items from the provided wardrobe list.
    2.  Provide a creative name for the outfit.
    3.  Write a brief justification explaining why the outfit works for the user's criteria.
    4.  The 'itemDescriptions' in your response MUST EXACTLY MATCH the descriptions from the 'Available Wardrobe Items' list. Do not alter them.
    5.  Return ONLY a valid JSON object. Do not include markdown formatting or any other text.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'A creative name for the outfit.'
            },
            itemDescriptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'An array of exact descriptions of items used in the outfit.'
            },
            justification: {
              type: Type.STRING,
              description: 'An explanation of why this outfit is a good choice.'
            }
          }
        }
      }
    });

    const resultText = response.text.trim();
    return JSON.parse(resultText) as OutfitSuggestion;
  } catch (error) {
    console.error("Error generating outfits:", error);
    throw new Error("Failed to generate outfits. Please check your wardrobe and try again.");
  }
};
