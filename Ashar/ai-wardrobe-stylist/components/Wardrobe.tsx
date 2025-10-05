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
    <div className="bg-[#05060a]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mt-8 border border-[#00f5d4]/20">
      <h2 className="text-xl font-semibold text-[#f7f8fb] mb-4 flex items-center">
        <WardrobeIcon className="w-6 h-6 mr-2 text-[#00f5d4]" />
        Step 2: Your Virtual Wardrobe
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-[#00f5d4]/30 rounded-lg overflow-hidden shadow-lg bg-[#0b0f1a] hover:border-[#ff3cac]/50 transition-all duration-300">
            <img src={item.image} alt={item.description} className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="font-semibold text-sm text-[#f7f8fb] truncate">{item.description}</p>
              <p className="text-xs text-[#00f5d4] bg-[#00f5d4]/10 px-2 py-0.5 rounded-full inline-block mt-1 border border-[#00f5d4]/30">{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
