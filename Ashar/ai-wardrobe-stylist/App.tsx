import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Wardrobe from './components/Wardrobe';
import OutfitGenerator from './components/OutfitGenerator';
import OutfitSuggestions from './components/OutfitSuggestions';
import { AlertIcon } from './components/icons';
import { categorizeClothingItems, generateOutfits } from './services/geminiService';
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
      
      setWardrobe(prev => [...prev, ...newItems]);

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

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during outfit generation.');
    } finally {
      setIsGenerating(false);
    }
  }, [wardrobe]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 flex items-center" role="alert">
            <AlertIcon className="w-5 h-5 mr-3" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <ImageUploader onUpload={handleImageUpload} isCategorizing={isCategorizing} />
        <Wardrobe items={wardrobe} />
        <OutfitGenerator onGenerate={handleGenerateOutfits} isGenerating={isGenerating} hasWardrobe={wardrobe.length > 0} />
        <OutfitSuggestions outfits={outfits} />
      </main>
    </div>
  );
}

export default App;
