import React from 'react';
import type { DisplayOutfit } from '../types';

interface OutfitSuggestionsProps {
  outfits: DisplayOutfit[];
}

const OutfitSuggestions: React.FC<OutfitSuggestionsProps> = ({ outfits }) => {
  if (outfits.length === 0) {
    return null;
  }

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
            <div>
              <h4 className="font-semibold text-[#f7f8fb]">Stylist's Note:</h4>
              <p className="text-sm text-[#b6c3d9] italic mt-1">{outfit.justification}</p>
            </div>
          </div>
        ))}
       </div>
    </div>
  );
};

export default OutfitSuggestions;
