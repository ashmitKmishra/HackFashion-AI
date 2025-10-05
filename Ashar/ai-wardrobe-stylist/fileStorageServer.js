import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateRealisticOutfitPhoto, generateOutfitCollage } from './services/imageGenerationService.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for the React app
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000']
}));

app.use(express.json({ limit: '50mb' }));

// Directory paths for saving files
const BASE_DIR = path.join(__dirname, 'saved_data');
const WARDROBE_DIR = path.join(BASE_DIR, 'wardrobe');
const PERSONAL_PHOTOS_DIR = path.join(BASE_DIR, 'personal_photo');
const GEMINI_RECOMMENDATIONS_DIR = path.join(BASE_DIR, 'gemini_recommendation');

// Clear only gemini recommendations (utility function)
const clearRecommendations = async () => {
  try {
    // Remove only the gemini_recommendation directory
    await fs.rm(GEMINI_RECOMMENDATIONS_DIR, { recursive: true, force: true });
    console.log('🗑️ Previous recommendations cleared');
    
    // Recreate the recommendations directory
    await fs.mkdir(GEMINI_RECOMMENDATIONS_DIR, { recursive: true });
  } catch (error) {
    console.error('❌ Error clearing recommendations:', error);
  }
};

// Initialize storage directories
const initializeDirectories = async () => {
  try {
    await fs.mkdir(BASE_DIR, { recursive: true });
    await fs.mkdir(WARDROBE_DIR, { recursive: true });
    await fs.mkdir(PERSONAL_PHOTOS_DIR, { recursive: true });
    await fs.mkdir(GEMINI_RECOMMENDATIONS_DIR, { recursive: true });
    console.log('✅ Storage directories created successfully');
  } catch (error) {
    console.error('❌ Error creating storage directories:', error);
  }
};

// Convert base64 to buffer and save file
const saveBase64Image = async (base64Data, filePath, mimeType) => {
  try {
    const extension = mimeType.split('/')[1] || 'jpg';
    const fullPath = `${filePath}.${extension}`;
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(fullPath, buffer);
    console.log(`✅ Image saved: ${fullPath}`);
    return fullPath;
  } catch (error) {
    console.error('❌ Error saving image:', error);
    throw new Error('Failed to save image');
  }
};

// API endpoint to save wardrobe photos
app.post('/api/save-wardrobe', async (req, res) => {
  try {
    const { wardrobeItems } = req.body;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sessionDir = path.join(WARDROBE_DIR, `session_${timestamp}`);
    await fs.mkdir(sessionDir, { recursive: true });
    
    const savedFiles = [];
    
    // Save each wardrobe item
    for (let i = 0; i < wardrobeItems.length; i++) {
      const item = wardrobeItems[i];
      const filename = `${i + 1}_${item.category}_${item.description.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const filePath = path.join(sessionDir, filename);
      
      // Extract base64 data (remove data:image/... prefix if present)
      const base64Data = item.image.includes(',') ? item.image.split(',')[1] : item.image;
      
      const savedPath = await saveBase64Image(base64Data, filePath, item.mimeType);
      savedFiles.push(savedPath);
    }
    
    // Save wardrobe metadata
    const metadata = {
      timestamp,
      totalItems: wardrobeItems.length,
      items: wardrobeItems.map((item, index) => ({
        index: index + 1,
        id: item.id,
        category: item.category,
        description: item.description,
        mimeType: item.mimeType
      }))
    };
    
    const metadataPath = path.join(sessionDir, 'wardrobe_metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    
    res.json({ 
      success: true, 
      message: `Saved ${wardrobeItems.length} wardrobe photos`,
      sessionDir,
      savedFiles
    });
  } catch (error) {
    console.error('❌ Error saving wardrobe photos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to save personal photo
app.post('/api/save-personal-photo', async (req, res) => {
  try {
    const { base64Image, mimeType } = req.body;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `personal_photo_${timestamp}`;
    const filePath = path.join(PERSONAL_PHOTOS_DIR, filename);
    
    // Extract base64 data (remove data:image/... prefix if present)
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    
    const savedPath = await saveBase64Image(base64Data, filePath, mimeType);
    
    res.json({ 
      success: true, 
      message: 'Personal photo saved successfully',
      savedPath
    });
  } catch (error) {
    console.error('❌ Error saving personal photo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to save Gemini outfit recommendation
app.post('/api/save-recommendation', async (req, res) => {
  try {
    // Clear only previous recommendations when generating new outfit
    await clearRecommendations();
    
    const { recommendation, wardrobeItems, criteria, personalPhoto } = req.body;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save personal photo if provided (this will replace the existing one)
    if (personalPhoto) {
      // Clear existing personal photos first
      try {
        const personalContents = await fs.readdir(PERSONAL_PHOTOS_DIR);
        for (const file of personalContents) {
          if (file.startsWith('personal_photo_')) {
            await fs.unlink(path.join(PERSONAL_PHOTOS_DIR, file));
          }
        }
      } catch (error) {
        // Directory might be empty or not exist
      }
      
      const personalFilename = `personal_photo`;
      const personalFilePath = path.join(PERSONAL_PHOTOS_DIR, personalFilename);
      
      // Extract base64 data and mime type from personal photo
      const [mimeInfo, base64Data] = personalPhoto.split(',');
      const mimeType = mimeInfo.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
      
      await saveBase64Image(base64Data, personalFilePath, mimeType);
    }
    
    // Don't save wardrobe again - keep existing wardrobe data
    // Only save the recommendation
    const sessionDir = path.join(GEMINI_RECOMMENDATIONS_DIR, 'recommendations');
    await fs.mkdir(sessionDir, { recursive: true });
    
    // Save recommendation data
    const recommendationData = {
      timestamp,
      outfitName: recommendation.name,
      justification: recommendation.justification,
      criteria,
      selectedItems: recommendation.itemDescriptions,
      fullWardrobe: wardrobeItems.map(item => ({
        id: item.id,
        category: item.category,
        description: item.description,
        selected: recommendation.itemDescriptions.includes(item.description)
      }))
    };
    
    // Save recommendation JSON
    const jsonPath = path.join(sessionDir, 'recommendation.json');
    await fs.writeFile(jsonPath, JSON.stringify(recommendationData, null, 2));
    
    // Save images of selected items
    const selectedItemsDir = path.join(sessionDir, 'selected_items');
    await fs.mkdir(selectedItemsDir, { recursive: true });
    
    const savedSelectedFiles = [];
    let itemIndex = 1;
    
    for (const itemDescription of recommendation.itemDescriptions) {
      const wardrobeItem = wardrobeItems.find(item => item.description === itemDescription);
      if (wardrobeItem) {
        const filename = `${itemIndex}_${wardrobeItem.category}_${wardrobeItem.description.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const filePath = path.join(selectedItemsDir, filename);
        
        const base64Data = wardrobeItem.image.includes(',') ? wardrobeItem.image.split(',')[1] : wardrobeItem.image;
        const savedPath = await saveBase64Image(base64Data, filePath, wardrobeItem.mimeType);
        savedSelectedFiles.push(savedPath);
        itemIndex++;
      }
    }
    
    // Create a summary text file
    const summaryText = `
GEMINI OUTFIT RECOMMENDATION
==========================
Generated: ${new Date().toLocaleString()}

Outfit Name: ${recommendation.name}

User Criteria:
- Event: ${criteria.event}
- Weather: ${criteria.weather}
- Mood: ${criteria.mood}

Selected Items:
${recommendation.itemDescriptions.map((item, index) => `${index + 1}. ${item}`).join('\n')}

Gemini's Justification:
${recommendation.justification}

Total wardrobe items available: ${wardrobeItems.length}
Items selected for this outfit: ${recommendation.itemDescriptions.length}
`;
    
    const summaryPath = path.join(sessionDir, 'recommendation_summary.txt');
    await fs.writeFile(summaryPath, summaryText);
    
    // Generate AI outfit visualization if personal photo is available
    let visualizationResult = null;
    if (personalPhoto) {
      try {
        console.log('🎨 Generating AI outfit visualization...');
        console.log('📸 Personal photo available, length:', personalPhoto.length);
        
        // Extract base64 data from personal photo
        const personalPhotoBase64 = personalPhoto.includes(',') ? personalPhoto.split(',')[1] : personalPhoto;
        console.log('📸 Base64 data extracted, length:', personalPhotoBase64.length);
        
        // Get filtered wardrobe items
        const selectedItems = wardrobeItems.filter(item => recommendation.itemDescriptions.includes(item.description));
        console.log('👔 Selected items for generation:', selectedItems.length);
        
        // Generate realistic outfit photo using Gemini 2.5 Flash Image
        const visualizationPath = path.join(sessionDir, 'realistic_outfit_photo.png');
        console.log('🎯 Attempting to generate realistic photo at:', visualizationPath);
        
        visualizationResult = await generateRealisticOutfitPhoto(
          personalPhotoBase64,
          selectedItems,
          recommendation.name,
          criteria,
          visualizationPath
        );
        
        console.log('✅ Realistic photo generation result:', visualizationResult);
        
        // Also generate outfit collage
        const collagePath = path.join(sessionDir, 'outfit_collage.png');
        console.log('🎯 Attempting to generate collage at:', collagePath);
        
        const collageResult = await generateOutfitCollage(
          personalPhotoBase64,
          selectedItems,
          recommendation.name,
          criteria,
          collagePath
        );
        
        console.log('✅ Collage generation result:', collageResult);
        console.log('✅ AI outfit visualizations generated successfully');
        
      } catch (genError) {
        console.error('⚠️ Failed to generate outfit visualization:', genError);
        console.error('⚠️ Full error details:', genError.message);
        console.error('⚠️ Error stack:', genError.stack);
        // Don't fail the entire request if image generation fails
      }
    } else {
      console.log('⚠️ No personal photo provided, skipping image generation');
    }
    
    res.json({ 
      success: true, 
      message: 'Outfit recommendation saved successfully',
      sessionDir,
      savedSelectedFiles,
      visualization: visualizationResult
    });
  } catch (error) {
    console.error('❌ Error saving outfit recommendation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get generated photo
app.get('/api/get-generated-photo', async (req, res) => {
  try {
    const { type } = req.query;
    const recommendationsDir = path.join(GEMINI_RECOMMENDATIONS_DIR, 'recommendations');
    
    let filePath;
    if (type === 'collage') {
      filePath = path.join(recommendationsDir, 'outfit_collage.png');
    } else if (type === 'realistic') {
      filePath = path.join(recommendationsDir, 'realistic_outfit_photo.png');
    } else {
      return res.status(400).json({ error: 'Invalid photo type' });
    }
    
    // Check if file exists
    try {
      await fs.access(filePath);
      res.sendFile(filePath);
    } catch {
      res.status(404).json({ error: 'Photo not found. Please generate an outfit first.' });
    }
  } catch (error) {
    console.error('❌ Error serving generated photo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'File storage service is running' });
});

// Initialize directories and start server
initializeDirectories().then(() => {
  app.listen(PORT, () => {
    console.log(`📁 File storage service running on http://localhost:${PORT}`);
    console.log(`💾 Files will be saved to: ${BASE_DIR}`);
  });
});
