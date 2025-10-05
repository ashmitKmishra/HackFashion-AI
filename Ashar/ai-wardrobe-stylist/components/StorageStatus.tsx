import React, { useState, useEffect } from 'react';
import { getStorageStats } from '../services/fileStorageService';

interface StorageStats {
  wardrobeSessions: number;
  personalPhotos: number;
  recommendations: number;
}

const StorageStatus: React.FC = () => {
  const [stats, setStats] = useState<StorageStats>({ wardrobeSessions: 0, personalPhotos: 0, recommendations: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const currentStats = await getStorageStats();
      setStats(currentStats);
    };
    
    loadStats();
    
    // Refresh stats every 5 seconds
    const interval = setInterval(loadStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const totalSaved = stats.wardrobeSessions + stats.personalPhotos + stats.recommendations;

  if (totalSaved === 0) {
    return null; // Don't show if nothing has been saved yet
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg transition-all duration-300 ${
          isVisible ? 'w-64 p-4' : 'w-12 h-12 p-2 cursor-pointer'
        }`}
        onClick={() => !isVisible && setIsVisible(true)}
      >
        {isVisible ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm">📁 Saved Files</h3>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVisible(false);
                }}
                className="text-white hover:text-gray-200 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>👕 Wardrobe Sessions:</span>
                <span className="font-medium">{stats.wardrobeSessions}</span>
              </div>
              <div className="flex justify-between">
                <span>📸 Personal Photos:</span>
                <span className="font-medium">{stats.personalPhotos}</span>
              </div>
              <div className="flex justify-between">
                <span>✨ Recommendations:</span>
                <span className="font-medium">{stats.recommendations}</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/20">
              <div className="text-xs text-center opacity-80">
                Files saved to gemini_recommendation/
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-lg">📁</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageStatus;
