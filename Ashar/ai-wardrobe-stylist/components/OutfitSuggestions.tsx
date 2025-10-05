import React, { useState } from 'react';
import type { DisplayOutfit } from '../types';

interface OutfitSuggestionsProps {
  outfits: DisplayOutfit[];
  personalPhoto?: string | null;
  onGenerateWithPhoto?: (outfit: DisplayOutfit) => Promise<void>;
}

const OutfitSuggestions: React.FC<OutfitSuggestionsProps> = ({ 
  outfits, 
  personalPhoto, 
  onGenerateWithPhoto 
}) => {
  const [generatingPhotoIndex, setGeneratingPhotoIndex] = useState<number | null>(null);

  if (outfits.length === 0) {
    return null;
  }

  const handleGenerateWithPhoto = async (outfit: DisplayOutfit, index: number) => {
    if (!onGenerateWithPhoto) return;
    
    setGeneratingPhotoIndex(index);
    try {
      await onGenerateWithPhoto(outfit);
    } catch (error) {
      console.error('Error generating photo:', error);
    } finally {
      setGeneratingPhotoIndex(null);
    }
  };

  return (
    <div className="mt-8">
       <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] bg-clip-text text-transparent mb-4 text-center">Your Personalized Outfit</h2>
       <div className="space-y-8">
        {outfits.map((outfit, index) => (
          <div key={index} className="bg-[#05060a]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#00f5d4]/20">
            <h3 className="text-xl font-semibold text-[#00f5d4] mb-4">{outfit.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {outfit.items.map(item => (
                <div key={item.id} className="text-center">
                  <img src={item.image} alt={item.description} className="w-full h-32 object-cover rounded-md shadow-sm border border-[#00f5d4]/30" />
                  <p className="text-xs mt-2 text-[#b6c3d9]">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-[#f7f8fb]">Stylist's Note:</h4>
              <p className="text-sm text-[#b6c3d9] italic mt-1">{outfit.justification}</p>
            </div>
            
            {/* Generate with Personal Photo Button */}
            {personalPhoto && onGenerateWithPhoto && (
              <div className="mt-6 pt-4 border-t border-[#00f5d4]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#ff3cac]/30">
                      <img 
                        src={personalPhoto} 
                        alt="Your photo" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f7f8fb]">Ready to see yourself in this outfit?</p>
                      <p className="text-xs text-[#b6c3d9]">Generate a realistic photo with AI</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerateWithPhoto(outfit, index)}
                    disabled={generatingPhotoIndex === index}
                    className="bg-gradient-to-r from-[#ff3cac] to-[#784BA0] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:from-[#ff3cac]/80 hover:to-[#784BA0]/80 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                  >
                    {generatingPhotoIndex === index ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>📸</span>
                        <span>Generate My Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* No Personal Photo Message */}
            {!personalPhoto && (
              <div className="mt-6 pt-4 border-t border-[#00f5d4]/20">
                <div className="bg-[#ff3cac]/10 border border-[#ff3cac]/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📸</span>
                    <div>
                      <p className="text-sm font-medium text-[#f7f8fb]">Want to see yourself in this outfit?</p>
                      <p className="text-xs text-[#b6c3d9]">Upload a personal photo to generate realistic images with AI</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
       </div>
    </div>
  );
};

export default OutfitSuggestions;
