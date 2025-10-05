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
       <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Personalized Outfit</h2>
       <div className="space-y-8">
        {outfits.map((outfit, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">{outfit.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
              {outfit.items.map(item => (
                <div key={item.id} className="text-center">
                  <img src={item.image} alt={item.description} className="w-full h-32 object-cover rounded-md shadow-sm border" />
                  <p className="text-xs mt-2 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Stylist's Note:</h4>
              <p className="text-sm text-gray-600 italic mt-1">{outfit.justification}</p>
            </div>
          </div>
        ))}
       </div>
    </div>
  );
};

export default OutfitSuggestions;
