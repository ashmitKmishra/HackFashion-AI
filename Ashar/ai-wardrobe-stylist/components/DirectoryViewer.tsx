import React, { useState } from 'react';

const DirectoryViewer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const directoryStructure = `
📁 gemini_recommendation/
├── 📁 wardrobe_photos/
│   └── 📁 session_YYYY-MM-DDTHH-MM-SS/
│       ├── 1_Top_Blue_short_sleeve_t_shirt.jpg
│       ├── 2_Bottom_Light_wash_denim_jeans.jpg
│       ├── 3_Shoes_White_sneakers.jpg
│       └── wardrobe_metadata.json
├── 📁 personal_photos/
│   └── personal_photo_YYYY-MM-DDTHH-MM-SS.jpg
└── 📁 recommendations/
    └── 📁 recommendation_YYYY-MM-DDTHH-MM-SS/
        ├── recommendation.json
        ├── recommendation_summary.txt
        └── 📁 selected_items/
            ├── 1_Top_Blue_short_sleeve_t_shirt.jpg
            └── 2_Bottom_Light_wash_denim_jeans.jpg
  `;

  return (
    <div className="bg-gray-800 text-gray-200 p-4 rounded-lg shadow-lg mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>📁</span>
          File Storage Structure
        </h3>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-3">
            All your photos and Gemini's recommendations are automatically saved to:
          </p>
          <pre className="text-xs font-mono bg-gray-900 p-3 rounded overflow-x-auto whitespace-pre">
            {directoryStructure.trim()}
          </pre>
          <div className="mt-3 text-xs text-gray-400">
            <p><strong>📁 wardrobe_photos/</strong>: All clothing items with metadata</p>
            <p><strong>📁 personal_photos/</strong>: Your personal photos</p>
            <p><strong>📁 recommendations/</strong>: Gemini's outfit suggestions with selected items</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryViewer;
