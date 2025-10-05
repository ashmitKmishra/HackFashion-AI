import { GoogleGenAI } from "@google/genai";
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Gemini AI client
const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }
  
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

// Generate realistic photo of user wearing recommended outfit using Gemini 2.5 Flash Image
export const generateRealisticOutfitPhoto = async (
  personalPhotoBase64,
  outfitItems,
  outfitName,
  criteria,
  outputPath
) => {
  try {
    console.log('🎨 Generating realistic outfit photo with Gemini 2.0 Flash...');
    console.log('📊 Input validation:');
    console.log('- Personal photo base64 length:', personalPhotoBase64?.length || 0);
    console.log('- Outfit items count:', outfitItems?.length || 0);
    console.log('- Output path:', outputPath);
    
    // Validate inputs
    if (!personalPhotoBase64 || personalPhotoBase64.length < 100) {
      throw new Error('Invalid personal photo base64 data');
    }
    
    if (!outfitItems || outfitItems.length === 0) {
      throw new Error('No outfit items provided');
    }
    
    // Get Gemini client with explicit API key
    const ai = getGeminiClient();
     // Clean the personal photo base64 data
    const cleanPersonalPhoto = personalPhotoBase64.includes(',') 
      ? personalPhotoBase64.split(',')[1] 
      : personalPhotoBase64;
    
    console.log('🧹 Cleaned personal photo base64 length:', cleanPersonalPhoto.length);
    
    // Create detailed description of the outfit items
    const outfitDescription = outfitItems.map(item => 
      `${item.category}: ${item.description}`
    ).join(', ');

    // Create clothing item images for the prompt
    const clothingImages = outfitItems.map((item, index) => {
      const cleanImageData = item.image.includes(',') ? item.image.split(',')[1] : item.image;
      console.log(`🧹 Cleaned clothing item ${index + 1} base64 length:`, cleanImageData.length);
      
      return {
        inlineData: {
          mimeType: item.mimeType || "image/jpeg",
          data: cleanImageData,
        },
      };
    });

    // Create comprehensive prompt for realistic photo generation
    const prompt = [
      {
        text: `Create a realistic, high-quality photograph of the person from the reference photo wearing the exact clothing items shown in the additional images. 

IMPORTANT REQUIREMENTS:
- Use the person's exact face, body type, and physical features from the reference photo
- Replace their clothing with the specific items shown in the clothing images
- Ensure all clothing items fit naturally and realistically on their body
- Maintain the person's proportions and pose style
- Create a professional, well-lit photograph

OUTFIT DETAILS:
- Outfit Name: "${outfitName}"
- Items to wear: ${outfitDescription}
- Occasion: ${criteria.event}
- Weather: ${criteria.weather}
- Desired mood: ${criteria.mood}

STYLING GUIDELINES:
- Ensure proper fit and coordination of all clothing items
- Use appropriate styling for the ${criteria.event} occasion
- Consider ${criteria.weather} weather conditions in the styling
- Convey a ${criteria.mood} mood through pose and expression
- Use professional photography lighting and composition
- Background should be appropriate for the occasion

Please generate a realistic photo that looks like a professional fashion photograph, showing the person wearing all the specified clothing items in a way that's appropriate for the given occasion and weather.`
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanPersonalPhoto,
        },
      },
      ...clothingImages
    ];

    console.log('🤖 Calling Gemini 2.5 Flash Image to generate realistic outfit photo...');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    // Process the response and save generated images
    let imageSaved = false;
    
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log('📝 Gemini description:', part.text);
        
        // Save the description as well
        const descriptionPath = outputPath.replace('.png', '_description.txt');
        await fs.writeFile(descriptionPath, part.text);
      } else if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        await fs.writeFile(outputPath, buffer);
        console.log(`✅ Realistic outfit photo saved: ${outputPath}`);
        imageSaved = true;
      }
    }

    if (!imageSaved) {
      console.log('⚠️ No image was generated, only text description');
    }
    
    return { 
      success: true, 
      type: imageSaved ? 'realistic_photo' : 'description', 
      path: outputPath,
      model: 'gemini-2.5-flash-image'
    };
    
  } catch (error) {
    console.error('❌ Error generating realistic outfit photo:', error);
    throw new Error(`Failed to generate realistic outfit photo: ${error.message}`);
  }
};

// Generate detailed outfit description for visualization
export const generateOutfitDescription = async (
  personalPhotoBase64,
  outfitItems,
  outfitName,
  criteria,
  outputPath
) => {
  try {
    console.log('🎨 Generating detailed outfit description...');
    
    // Get Gemini client with explicit API key
    const ai = getGeminiClient();
    
    // Clean the personal photo base64 data
    const cleanPersonalPhoto = personalPhotoBase64.includes(',') 
      ? personalPhotoBase64.split(',')[1] 
      : personalPhotoBase64;
    
    // Create detailed description of the outfit
    const outfitDescription = outfitItems.map(item => 
      `${item.category}: ${item.description}`
    ).join(', ');
    
    // Create a comprehensive prompt for outfit description
    const prompt = [
      {
        text: `Analyze this person's photo and create a detailed description for generating a realistic photo of them wearing this specific outfit: ${outfitDescription}. 

Style Requirements:
- Event/Occasion: ${criteria.event}
- Weather: ${criteria.weather}
- Desired Mood: ${criteria.mood}
- Outfit Name: "${outfitName}"

Please provide:
1. A detailed description of the person's physical features (face, hair, body type, skin tone)
2. A comprehensive description of how each clothing item should look on them
3. Styling suggestions for the complete look
4. Pose and setting recommendations for ${criteria.event}
5. Lighting and photography style suggestions

Create a prompt that could be used with an AI image generator to create a realistic, high-quality photo of this person wearing the recommended outfit.`
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanPersonalPhoto,
        },
      },
    ];

    console.log('🤖 Calling Gemini to analyze and create outfit description...');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    // Get the text response
    const textResponse = response.candidates[0].content.parts
      .filter(part => part.text)
      .map(part => part.text)
      .join('\n');
    
    // Create comprehensive outfit visualization guide
    const visualizationGuide = `
OUTFIT VISUALIZATION GUIDE
==========================
Generated: ${new Date().toLocaleString()}

Outfit: ${outfitName}
Items: ${outfitDescription}

Event: ${criteria.event}
Weather: ${criteria.weather}
Mood: ${criteria.mood}

AI ANALYSIS AND RECOMMENDATIONS:
${textResponse}

IMAGE GENERATION PROMPT:
"Create a high-quality, realistic photograph of ${textResponse.includes('person') ? 'the person described above' : 'a person'} wearing the exact outfit specified: ${outfitDescription}. The photo should be perfect for ${criteria.event} in ${criteria.weather} weather, conveying a ${criteria.mood} mood. Use professional photography techniques with excellent lighting and composition."

STYLING NOTES:
- Ensure all clothing items are clearly visible and well-fitted
- Use appropriate color coordination and styling
- Consider the event context: ${criteria.event}
- Weather-appropriate styling for: ${criteria.weather}
- Overall mood should be: ${criteria.mood}
`;
    
    await fs.writeFile(outputPath, visualizationGuide);
    console.log(`✅ Outfit visualization guide saved: ${outputPath}`);
    
    return { 
      success: true, 
      type: 'guide', 
      path: outputPath,
      description: textResponse
    };
    
  } catch (error) {
    console.error('❌ Error generating outfit description:', error);
    throw new Error(`Failed to generate outfit description: ${error.message}`);
  }
};

// Generate outfit collage with individual items using Gemini 2.5 Flash Image
export const generateOutfitCollage = async (
  personalPhotoBase64,
  outfitItems,
  outfitName,
  criteria,
  outputPath
) => {
  try {
    console.log('🎨 Creating outfit collage with Gemini 2.0 Flash...');
    
    // Get Gemini client with explicit API key
    const ai = getGeminiClient();
    
    // Clean the personal photo base64 data
    const cleanPersonalPhoto = personalPhotoBase64.includes(',') 
      ? personalPhotoBase64.split(',')[1] 
      : personalPhotoBase64;
    
    // Convert outfit items to base64 images for the prompt
    const itemImages = outfitItems.map((item, index) => {
      const cleanImageData = item.image.includes(',') ? item.image.split(',')[1] : item.image;
      return {
        inlineData: {
          mimeType: item.mimeType || "image/jpeg",
          data: cleanImageData,
        },
      };
    });

    const prompt = [
      {
        text: `Create a stylish fashion collage that combines:
1. The person from the reference photo (center/main focus)
2. The clothing items arranged artistically around them
3. A cohesive, magazine-style layout

OUTFIT DETAILS:
- Name: "${outfitName}"
- Items: ${outfitItems.map(item => item.description).join(', ')}
- For: ${criteria.event}
- Weather: ${criteria.weather}
- Mood: ${criteria.mood}

DESIGN REQUIREMENTS:
- Use modern fashion magazine layout principles
- Clean, professional aesthetic with good spacing
- Complementary background that doesn't distract
- Fashion-forward presentation style
- High quality and sharp details
- Color coordination between all elements
- Professional typography if text is included

Create an inspiring fashion collage that showcases how these items work together as an outfit.`
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanPersonalPhoto,
        },
      },
      ...itemImages
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    // Save the generated collage
    let imageSaved = false;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        await fs.writeFile(outputPath, buffer);
        console.log(`✅ Outfit collage saved: ${outputPath}`);
        imageSaved = true;
      } else if (part.text) {
        // Save description if provided
        const descriptionPath = outputPath.replace('.png', '_collage_description.txt');
        await fs.writeFile(descriptionPath, part.text);
      }
    }

    if (!imageSaved) {
      console.log('⚠️ No collage image was generated');
    }
    
    return { success: true, type: imageSaved ? 'collage' : 'collage_description', path: outputPath };
    
  } catch (error) {
    console.error('❌ Error generating outfit collage:', error);
    throw new Error(`Failed to generate outfit collage: ${error.message}`);
  }
};
