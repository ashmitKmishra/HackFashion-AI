import React from 'react';
import type { ClothingItem } from '../types';
import { WardrobeIcon } from './icons';

interface WardrobeProps {
  items: ClothingItem[];
}

const Wardrobe: React.FC<WardrobeProps> = ({ items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <WardrobeIcon className="w-6 h-6 mr-2 text-indigo-500" />
        Step 2: Your Virtual Wardrobe
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50">
            <img src={item.image} alt={item.description} className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="font-semibold text-sm text-gray-800 truncate">{item.description}</p>
              <p className="text-xs text-gray-600 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full inline-block mt-1">{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
