import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import DualImageUploader from './components/DualImageUploader';
import Wardrobe from './components/Wardrobe';
import OutfitGenerator from './components/OutfitGenerator';
import OutfitSuggestions from './components/OutfitSuggestions';
import VoiceStylist from './components/VoiceStylist';
import { AlertIcon } from './components/icons';
import { categorizeClothingItems, generateOutfits } from './services/geminiService';
import { 
  saveWardrobePhotos, 
  savePersonalPhoto, 
  saveOutfitRecommendation,
  updateStorageStats
} from './services/fileStorageService';
import type { ClothingItem, OutfitCriteria, OutfitSuggestion, DisplayOutfit } from './types';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

function App() {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<DisplayOutfit[]>([]);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWaitingForData, setIsWaitingForData] = useState(true);
  const [showVoiceStylist, setShowVoiceStylist] = useState(false);

  // Check URL params on mount - auto-show Voice Stylist if ?mode=voice
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'voice') {
      setShowVoiceStylist(true);
    }
  }, []);

  // Load images from localStorage on mount
  useEffect(() => {
    const loadWardrobeFromStorage = async () => {
      console.log('🔍 Checking localStorage for saved wardrobe...');
      const wardrobeReady = localStorage.getItem('wardrobeReady');
      const savedImages = localStorage.getItem('wardrobeImages');
      const savedPersonalPhoto = localStorage.getItem('personalPhoto');
      
      // Load personal photo if available
      if (savedPersonalPhoto) {
        setPersonalPhoto(savedPersonalPhoto);
        console.log('✅ Personal photo loaded from storage');
      }
      
      console.log('wardrobeReady:', wardrobeReady);
      console.log('savedImages count:', savedImages ? JSON.parse(savedImages).length : 0);
      
      if (wardrobeReady === 'true' && savedImages) {
        try {
          const images = JSON.parse(savedImages);
          console.log('✅ Found saved images:', images.length);
          
          if (images && images.length > 0) {
            setIsCategorizing(true);
            setError(null);
            
            console.log('🤖 Starting AI categorization...');
            
            // Convert saved images to the format needed for categorization
            const imagePayloads = images.map((img: any) => ({
              data: img.data.split(',')[1], // Remove data:image/... prefix
              mimeType: img.type,
            }));

            const categorizedData = await categorizeClothingItems(imagePayloads);
            console.log('✅ Categorization complete:', categorizedData);
            
            const newItems: ClothingItem[] = categorizedData.map((item, index) => ({
              id: crypto.randomUUID(),
              image: images[index].data, // Use the full data URL
              mimeType: images[index].type,
              category: item.category,
              description: item.description,
            }));
               setWardrobe(newItems);
          console.log('✅ Wardrobe loaded with', newItems.length, 'items');
          
          // Save wardrobe photos to file system
          try {
            await saveWardrobePhotos(newItems);
            updateStorageStats('wardrobe');
            console.log('✅ Wardrobe photos saved to gemini_recommendation folder');
          } catch (saveError) {
            console.error('⚠️ Failed to save wardrobe photos:', saveError);
            // Don't throw error, just log it - the app should continue working
          }
          
          // Clear the flag so we don't reload on refresh
          localStorage.removeItem('wardrobeReady');
          }
        } catch (err: any) {
          console.error('❌ Error loading wardrobe from storage:', err);
          setError(err.message || 'Failed to load wardrobe from storage.');
        } finally {
          setIsCategorizing(false);
        }
      } else {
        console.log('ℹ️ No saved wardrobe found');
      }
    };

    loadWardrobeFromStorage();
    
    // Stop waiting after 3 seconds if no data received
    const timeout = setTimeout(() => {
      setIsWaitingForData(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  // Listen for postMessage from main app
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin for security (accept both 3000 and 3001)
      if (!event.origin.startsWith('http://localhost:')) {
        console.log('Ignoring message from unknown origin:', event.origin);
        return;
      }

      console.log('📨 Received message from', event.origin, ':', event.data);

      if (event.data.type === 'LOAD_WARDROBE' && event.data.images) {
        const images = event.data.images;
        console.log('✅ Received', images.length, 'images via postMessage');

        try {
          setIsCategorizing(true);
          setError(null);

          // Convert images to the format needed for categorization
          const imagePayloads = images.map((img: any) => ({
            data: img.data.split(',')[1], // Remove data:image/... prefix
            mimeType: img.type,
          }));

          console.log('🤖 Starting AI categorization...');
          const categorizedData = await categorizeClothingItems(imagePayloads);
          console.log('✅ Categorization complete:', categorizedData);

          const newItems: ClothingItem[] = categorizedData.map((item, index) => ({
            id: crypto.randomUUID(),
            image: images[index].data,
            mimeType: images[index].type,
            category: item.category,
            description: item.description,
          }));

          setWardrobe(newItems);
          setIsWaitingForData(false);
          console.log('✅ Wardrobe loaded with', newItems.length, 'items from postMessage');

          // Save wardrobe photos to file system
          try {
            await saveWardrobePhotos(newItems);
            updateStorageStats('wardrobe');
            console.log('✅ Wardrobe photos saved to gemini_recommendation folder');
          } catch (saveError) {
            console.error('⚠️ Failed to save wardrobe photos:', saveError);
            // Don't throw error, just log it - the app should continue working
          }

        } catch (err: any) {
          console.error('❌ Error processing wardrobe from postMessage:', err);
          setError(err.message || 'Failed to process wardrobe data.');
        } finally {
          setIsCategorizing(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    console.log('👂 Listening for postMessage from main app...');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleImageUpload = useCallback(async (files: File[]) => {
    setIsCategorizing(true);
    setError(null);
    setOutfits([]);

    try {
      const imagePayloads = await Promise.all(
        files.map(async (file) => ({
          data: await fileToBase64(file),
          mimeType: file.type,
          originalUrl: URL.createObjectURL(file), // For immediate display
        }))
      );

      const categorizedData = await categorizeClothingItems(
        imagePayloads.map(p => ({ data: p.data, mimeType: p.mimeType }))
      );
      
      if (imagePayloads.length !== categorizedData.length) {
        throw new Error("Mismatch between uploaded images and categorized results.");
      }

      const newItems: ClothingItem[] = categorizedData.map((item, index) => ({
        id: crypto.randomUUID(),
        image: `data:${imagePayloads[index].mimeType};base64,${imagePayloads[index].data}`,
        mimeType: imagePayloads[index].mimeType,
        category: item.category,
        description: item.description,
      }));
      
      setWardrobe(prev => {
        const updatedWardrobe = [...prev, ...newItems];
        
        // Save wardrobe photos to file system (async, don't wait)
        saveWardrobePhotos(updatedWardrobe)
          .then(() => {
            updateStorageStats('wardrobe');
            console.log('✅ Wardrobe photos saved to gemini_recommendation folder');
          })
          .catch((saveError) => {
            console.error('⚠️ Failed to save wardrobe photos:', saveError);
          });
        
        return updatedWardrobe;
      });

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during categorization.');
    } finally {
      setIsCategorizing(false);
    }
  }, []);
  
  const handleGenerateOutfits = useCallback(async (criteria: OutfitCriteria) => {
    if (wardrobe.length < 3) {
      setError("Please add at least 3 items to your wardrobe to generate outfits.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setOutfits([]);

    try {
      const suggestion: OutfitSuggestion = await generateOutfits(wardrobe, criteria);
      
      const wardrobeMap = new Map(wardrobe.map(item => [item.description, item]));
      
      const displayOutfit: DisplayOutfit = {
        name: suggestion.name,
        justification: suggestion.justification,
        items: suggestion.itemDescriptions
          .map(desc => wardrobeMap.get(desc))
          .filter((item): item is ClothingItem => item !== undefined),
      };

      setOutfits([displayOutfit]);

      // Save outfit recommendation to file system
      try {
        await saveOutfitRecommendation(suggestion, wardrobe, criteria, personalPhoto);
        updateStorageStats('recommendation');
        console.log('✅ Outfit recommendation saved (only recommendations cleared)');
      } catch (saveError) {
        console.error('⚠️ Failed to save outfit recommendation:', saveError);
        // Don't throw error, just log it - the app should continue working
      }

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during outfit generation.');
    } finally {
      setIsGenerating(false);
    }
  }, [wardrobe]);

  // Handle personal photo upload
  const handlePersonalPhotoUpload = useCallback(async (file: File) => {
    try {
      const photoData = await fileToBase64(file);
      const photoUrl = `data:${file.type};base64,${photoData}`;
      setPersonalPhoto(photoUrl);
      
      // Store in localStorage for persistence
      localStorage.setItem('personalPhoto', photoUrl);
      console.log('✅ Personal photo saved to localStorage');
      
      // Save personal photo to file system
      try {
        await savePersonalPhoto(photoUrl, file.type);
        updateStorageStats('personal');
        console.log('✅ Personal photo saved to gemini_recommendation folder');
      } catch (saveError) {
        console.error('⚠️ Failed to save personal photo to file system:', saveError);
        // Don't throw error, just log it - the app should continue working
      }
    } catch (error) {
      console.error('❌ Error processing personal photo:', error);
      setError('Failed to save personal photo. Please try again.');
    }
  }, []);

  // Handle generating outfit with personal photo
  const handleGenerateOutfitWithPhoto = useCallback(async (outfit: DisplayOutfit) => {
    if (!personalPhoto) {
      setError("Please upload a personal photo first.");
      return;
    }

    try {
      console.log('🎨 Generating realistic outfit photo...');
      
      // Create a mock OutfitSuggestion from DisplayOutfit for the backend
      const suggestion: OutfitSuggestion = {
        name: outfit.name,
        justification: outfit.justification,
        itemDescriptions: outfit.items.map(item => item.description)
      };
      
      // Create default criteria for photo generation
      const criteria = {
        event: 'general',
        weather: 'mild',
        mood: 'confident'
      };
      
      // Save outfit recommendation with photo generation
      await saveOutfitRecommendation(suggestion, wardrobe, criteria, personalPhoto);
      updateStorageStats('recommendation');
      console.log('✅ Realistic outfit photo generated and saved!');
      
      // Show success and update state
      setError(null);
      setHasGeneratedPhotos(true);
      
      // Show success notification
      setSuccessMessage("Your realistic outfit photo has been generated! Check the saved_data/gemini_recommendation folder to view your AI-generated images.");
      setShowSuccessNotification(true);
      
    } catch (err: any) {
      console.error('❌ Error generating outfit photo:', err);
      setError(`Failed to generate outfit photo: ${err.message}`);
    }
  }, [personalPhoto, wardrobe]);

  return (
    <div className="min-h-screen bg-[#0b0f1a]">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 flex items-center" role="alert">
            <AlertIcon className="w-5 h-5 mr-3" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {/* Loading state while waiting for postMessage */}
        {isWaitingForData && wardrobe.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-[#00f5d4]/20 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-transparent border-t-[#00f5d4] rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] bg-clip-text text-transparent">
                Loading Your Wardrobe...
              </h3>
              <p className="text-[#b6c3d9] text-sm">Preparing your items for AI categorization</p>
            </div>
          </div>
        )}
        
        {/* Only show DualImageUploader if not waiting and wardrobe is empty */}
        {!isWaitingForData && wardrobe.length === 0 && (
          <DualImageUploader 
            onWardrobeUpload={handleImageUpload} 
            onPersonalPhotoUpload={handlePersonalPhotoUpload}
            isCategorizing={isCategorizing} 
          />
        )}
        
        {showVoiceStylist ? (
          <div>
            <button
              onClick={() => setShowVoiceStylist(false)}
              className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              ← Back to Wardrobe
            </button>
            <VoiceStylist wardrobe={wardrobe} />
          </div>
        ) : (
          <>
            <Wardrobe items={wardrobe} />
            {wardrobe.length > 0 && (
              <div className="text-center my-8">
                <button
                  onClick={() => setShowVoiceStylist(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] text-white font-bold text-lg rounded-lg hover:opacity-90 shadow-lg"
                >
                  🎤 Try Voice Stylist
                </button>
              </div>
            )}
            <OutfitGenerator onGenerate={handleGenerateOutfits} isGenerating={isGenerating} hasWardrobe={wardrobe.length > 0} />
            <OutfitSuggestions outfits={outfits} />
          </>
        )}
      </main>
      
      {/* Storage Status Component */}
      <StorageStatus />
      
      {/* Success Notification */}
      {showSuccessNotification && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setShowSuccessNotification(false)}
        />
      )}
    </div>
  );
}

export default App;
