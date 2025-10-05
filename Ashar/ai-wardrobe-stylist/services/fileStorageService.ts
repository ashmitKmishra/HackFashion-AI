import { ClothingItem, OutfitSuggestion } from '../types';

// Backend file storage service URL
const FILE_STORAGE_API = 'http://localhost:3001/api';

// Initialize storage directories (via backend)
export const requestStorageAccess = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${FILE_STORAGE_API}/health`);
    if (response.ok) {
      console.log('✅ File storage service is available');
      return true;
    } else {
      console.error('❌ File storage service is not available');
      return false;
    }
  } catch (error) {
    console.error('❌ Error connecting to file storage service:', error);
    return false;
  }
};

export const initializeStorageDirectories = async (): Promise<void> => {
  await requestStorageAccess();
};

// Save wardrobe photos
export const saveWardrobePhotos = async (wardrobeItems: ClothingItem[]): Promise<void> => {
  try {
    const response = await fetch(`${FILE_STORAGE_API}/save-wardrobe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wardrobeItems }),
    });

    if (!response.ok) {
      throw new Error('Failed to save wardrobe photos');
    }

    const result = await response.json();
    console.log(`✅ ${result.message}`);
  } catch (error) {
    console.error('❌ Error saving wardrobe photos:', error);
    throw new Error('Failed to save wardrobe photos');
  }
};

// Save personal photo
export const savePersonalPhoto = async (base64Image: string, mimeType: string): Promise<void> => {
  try {
    const response = await fetch(`${FILE_STORAGE_API}/save-personal-photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, mimeType }),
    });

    if (!response.ok) {
      throw new Error('Failed to save personal photo');
    }

    const result = await response.json();
    console.log(`✅ ${result.message}`);
  } catch (error) {
    console.error('❌ Error saving personal photo:', error);
    throw new Error('Failed to save personal photo');
  }
};

// Save Gemini outfit recommendation
export const saveOutfitRecommendation = async (
  recommendation: OutfitSuggestion,
  wardrobeItems: ClothingItem[],
  criteria: any,
  personalPhoto?: string | null
): Promise<void> => {
  try {
    const response = await fetch(`${FILE_STORAGE_API}/save-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recommendation, wardrobeItems, criteria, personalPhoto }),
    });

    if (!response.ok) {
      throw new Error('Failed to save outfit recommendation');
    }

    const result = await response.json();
    console.log(`✅ ${result.message}`);
  } catch (error) {
    console.error('❌ Error saving outfit recommendation:', error);
    throw new Error('Failed to save outfit recommendation');
  }
};

// Get storage statistics
export const getStorageStats = async (): Promise<{
  wardrobeSessions: number;
  personalPhotos: number;
  recommendations: number;
}> => {
  try {
    const response = await fetch(`${FILE_STORAGE_API}/storage-stats`);
    
    if (!response.ok) {
      throw new Error('Failed to get storage stats');
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error('❌ Error getting storage stats:', error);
    return { wardrobeSessions: 0, personalPhotos: 0, recommendations: 0 };
  }
};

// Update storage statistics (not needed with backend, but keeping for compatibility)
export const updateStorageStats = (type: 'wardrobe' | 'personal' | 'recommendation'): void => {
  // Backend handles this automatically, but we keep this function for compatibility
  console.log(`📊 Storage stats updated for: ${type}`);
};
