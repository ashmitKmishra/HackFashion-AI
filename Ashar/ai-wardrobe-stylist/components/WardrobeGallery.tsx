
import React from 'react';
import { ClothingItem } from '../types';
import WardrobeIcon from './icons/WardrobeIcon';

interface WardrobeGalleryProps {
  items: ClothingItem[];
}

const WardrobeGallery: React.FC<WardrobeGalleryProps> = ({ items }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">My Wardrobe ({items.length})</h2>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 border-2 border-dashed border-gray-700 rounded-lg py-20">
          <WardrobeIcon className="w-16 h-16 mb-4" />
          <p className="text-lg font-medium">Your wardrobe is empty.</p>
          <p>Upload some clothes to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[80vh] overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg bg-gray-700 shadow-md">
              <img
                src={`data:image/png;base64,${item.processedImage}`}
                alt={item.description}
                className="w-full h-48 object-contain aspect-square p-2 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/60 p-2">
                <p className="text-white text-xs font-medium truncate">{item.description}</p>
                 <p className="text-gray-300 text-xs">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WardrobeGallery;
