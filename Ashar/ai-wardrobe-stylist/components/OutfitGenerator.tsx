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
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
        Step 3: Get Outfit Ideas
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event" className="block text-sm font-medium text-gray-700">Event / Occasion</label>
            <input type="text" name="event" id="event" value={criteria.event} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="weather" className="block text-sm font-medium text-gray-700">Weather</label>
            <input type="text" name="weather" id="weather" value={criteria.weather} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="mood" className="block text-sm font-medium text-gray-700">Desired Mood</label>
            <input type="text" name="mood" id="mood" value={criteria.mood} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        <button
          type="submit"
          disabled={isGenerating || !hasWardrobe}
          className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
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
