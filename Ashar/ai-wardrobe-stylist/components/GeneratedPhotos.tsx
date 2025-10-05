import React, { useState, useEffect } from 'react';

interface GeneratedPhoto {
  collageUrl: string;
  realisticPhotoUrl: string;
  timestamp: string;
  outfitName: string;
}

const GeneratedPhotos: React.FC = () => {
  const [photo, setPhoto] = useState<GeneratedPhoto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the generated outfit collage
  const loadGeneratedPhotos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const collageUrl = `http://localhost:3001/api/get-generated-photo?type=collage&t=${timestamp}`;
      const realisticUrl = `http://localhost:3001/api/get-generated-photo?type=realistic&t=${timestamp}`;
      
      setPhoto({
        collageUrl,
        realisticPhotoUrl: realisticUrl,
        timestamp: new Date().toISOString(),
        outfitName: 'Generated Outfit'
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading generated photos:', error);
      setError('Failed to load generated photos');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGeneratedPhotos();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] bg-clip-text text-transparent mb-4">
          Loading Generated Photos...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f5d4] mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-[#b6c3d9]">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] bg-clip-text text-transparent mb-4 text-center">
        Generated Photos
      </h2>
      
      <div className="bg-[#05060a]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#00f5d4]/20">
        {photo && (
          <div className="space-y-6">
            {/* Outfit Collage Display */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#f7f8fb] flex items-center gap-2">
                🎨 Fashion Collage
              </h3>
              <div className="relative rounded-lg overflow-hidden border-2 border-[#00f5d4]/30 shadow-xl">
                <img
                  src={photo.collageUrl}
                  alt="AI-Generated Outfit Collage"
                  className="w-full h-auto object-contain bg-[#0b0f1a]"
                  onError={(e) => {
                    console.error('Failed to load collage image');
                    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%230b0f1a" width="400" height="400"/><text fill="%23b6c3d9" font-size="16" x="50%" y="50%" text-anchor="middle">Image not available</text></svg>';
                  }}
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#00f5d4]/10 p-4 rounded-lg border border-[#00f5d4]/20">
                <h4 className="font-semibold text-[#f7f8fb] mb-2">📷 Realistic Photo</h4>
                <p className="text-xs text-[#b6c3d9] mb-2">
                  AI-generated photo of you wearing the outfit
                </p>
                <a
                  href={photo.realisticPhotoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00f5d4] text-xs hover:underline"
                >
                  View Realistic Photo →
                </a>
              </div>
              
              <div className="bg-[#784BA0]/10 p-4 rounded-lg border border-[#784BA0]/20">
                <h4 className="font-semibold text-[#f7f8fb] mb-2">💾 Saved Location</h4>
                <p className="text-xs text-[#b6c3d9]">
                  All photos saved to:<br/>
                  <code className="text-[#00f5d4]">saved_data/gemini_recommendation/recommendations/</code>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedPhotos;
