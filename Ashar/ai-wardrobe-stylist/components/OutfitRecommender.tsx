
import React from 'react';
import { Outfit } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface OutfitRecommenderProps {
  onRecommend: () => void;
  outfit: Outfit | null;
  isLoading: boolean;
  hasItems: boolean;
}

const OutfitRecommender: React.FC<OutfitRecommenderProps> = ({ onRecommend, outfit, isLoading, hasItems }) => {
  const outfitItems = outfit ? Object.values(outfit).filter(item => typeof item === 'object' && item !== null) : [];

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border-2 border-dashed border-gray-600 mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Daily Outfit Recommendation</h2>
      <div className="bg-gray-900 p-3 rounded-md mb-4 text-sm">
        <p><span className="font-semibold text-indigo-300">Weather:</span><span className="text-gray-300"> 72°F, Sunny with a light breeze.</span></p>
        <p><span className="font-semibold text-indigo-300">Calendar:</span><span className="text-gray-300"> 10am Team Meeting, 1pm Lunch with Alex.</span></p>
      </div>

      <button
        onClick={onRecommend}
        disabled={isLoading || !hasItems}
        className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        <SparklesIcon className="w-5 h-5 mr-2" />
        {isLoading ? 'Thinking...' : 'Recommend an Outfit'}
      </button>

      {!hasItems && (
          <p className="text-center text-sm text-yellow-400 mt-3">Add items to your wardrobe to get a recommendation.</p>
      )}

      {outfit && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white">Today's Look:</h3>
          <p className="text-gray-300 text-sm mt-1 mb-4 p-3 bg-gray-700/50 rounded-md border border-gray-600">
            <span className="font-bold text-indigo-300">AI Stylist:</span> "{outfit.reasoning}"
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {outfitItems.map(item => item && (
              <div key={item.id} className="bg-gray-700 rounded-lg p-2">
                <img
                  src={`data:image/png;base64,${item.processedImage}`}
                  alt={item.description}
                  className="w-full h-32 object-contain aspect-square"
                />
                <p className="text-white text-xs mt-2 text-center truncate">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitRecommender;
