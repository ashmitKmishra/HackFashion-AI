import React, { useState } from 'react';
import type { OutfitCriteria } from '../types';
import { SparklesIcon } from './icons';
import Spinner from './Spinner';

interface OutfitGeneratorProps {
  onGenerate: (criteria: OutfitCriteria) => void;
  isGenerating: boolean;
  hasWardrobe: boolean;
}

const OutfitGenerator: React.FC<OutfitGeneratorProps> = ({ onGenerate, isGenerating, hasWardrobe }) => {
  const [criteria, setCriteria] = useState<OutfitCriteria>({
    event: 'Casual hangout',
    weather: 'Sunny and warm, about 75°F',
    mood: 'Relaxed and confident',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(criteria);
  };
  
  if (!hasWardrobe) {
    return null;
  }

  return (
    <div className="bg-[#05060a]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg mt-8 border border-[#00f5d4]/20">
      <h2 className="text-xl font-semibold text-[#f7f8fb] mb-4 flex items-center">
        <SparklesIcon className="w-6 h-6 mr-2 text-[#00f5d4]" />
        Step 3: Get Outfit Ideas
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event" className="block text-sm font-medium text-[#b6c3d9]">Event / Occasion</label>
            <input type="text" name="event" id="event" value={criteria.event} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-[#00f5d4]/30 bg-[#0b0f1a] text-[#f7f8fb] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00f5d4] focus:border-transparent sm:text-sm" />
          </div>
          <div>
            <label htmlFor="weather" className="block text-sm font-medium text-[#b6c3d9]">Weather</label>
            <input type="text" name="weather" id="weather" value={criteria.weather} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-[#00f5d4]/30 bg-[#0b0f1a] text-[#f7f8fb] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00f5d4] focus:border-transparent sm:text-sm" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="mood" className="block text-sm font-medium text-[#b6c3d9]">Desired Mood</label>
            <input type="text" name="mood" id="mood" value={criteria.mood} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-[#00f5d4]/30 bg-[#0b0f1a] text-[#f7f8fb] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00f5d4] focus:border-transparent sm:text-sm" />
          </div>
        </div>
        <button
          type="submit"
          disabled={isGenerating || !hasWardrobe}
          className="w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] text-white font-semibold rounded-md shadow-lg hover:shadow-[#00f5d4]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <Spinner className="w-5 h-5 mr-2" />
              Generating Outfit...
            </>
          ) : (
            'Generate Outfit'
          )}
        </button>
      </form>
    </div>
  );
};

export default OutfitGenerator;
