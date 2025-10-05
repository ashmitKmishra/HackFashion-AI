# AI Wardrobe Stylist - File Storage Feature

## Overview
This AI Wardrobe Stylist application now automatically saves all your photos and Gemini's recommendations to your local file system for easy access and backup.

## What Gets Saved

### 🗂️ File Structure
All files are saved in a `gemini_recommendation` folder with the following structure:

```
📁 gemini_recommendation/
├── 📁 wardrobe_photos/          # All your clothing items
│   └── 📁 session_[timestamp]/
│       ├── 1_Top_Blue_shirt.jpg
│       ├── 2_Bottom_Jeans.jpg
│       └── wardrobe_metadata.json
├── 📁 personal_photos/          # Your personal photos
│   └── personal_photo_[timestamp].jpg
└── 📁 recommendations/          # Gemini's outfit suggestions
    └── 📁 recommendation_[timestamp]/
        ├── recommendation.json
        ├── recommendation_summary.txt
        └── 📁 selected_items/
            ├── 1_Top_Blue_shirt.jpg
            └── 2_Bottom_Jeans.jpg
```

### 📸 Wardrobe Photos
- **Individual Photos**: Each clothing item is saved with descriptive names
- **Metadata**: JSON file containing categories, descriptions, and timestamps
- **Session-based**: Each upload session creates a new timestamped folder

### 👤 Personal Photos
- **Format**: Saved with timestamp for easy identification
- **Purpose**: For style reference and outfit planning

### ✨ Gemini Recommendations
- **Complete Data**: JSON file with outfit details, criteria, and justification
- **Summary**: Human-readable text file with recommendation explanation
- **Selected Items**: Photos of items used in the recommended outfit
- **Reasoning**: Gemini's AI explanation for why the outfit works

## Browser Compatibility

### Modern Browsers (Chrome 86+, Edge 86+)
- Uses **File System Access API** for direct folder saving
- Prompts for folder permission on first use
- Saves files directly to your chosen directory

### Other Browsers
- **Automatic Downloads**: Files are downloaded to your default download folder
- **Same Organization**: Files maintain the same naming structure
- **Manual Organization**: You can manually move files to create the folder structure

## Storage Statistics
The app tracks your saved files:
- 👕 **Wardrobe Sessions**: Number of wardrobe upload sessions
- 📸 **Personal Photos**: Number of personal photos saved
- ✨ **Recommendations**: Number of outfit recommendations saved

## Privacy & Security
- **Local Storage Only**: All files are saved locally on your device
- **No Cloud Upload**: Photos never leave your computer
- **Your Control**: You choose where files are saved
- **Data Protection**: Personal photos and wardrobe items remain private

## Getting Started
1. **Upload Photos**: Add wardrobe items or personal photos
2. **Grant Permission**: Allow folder access when prompted (modern browsers)
3. **Generate Outfits**: Create AI recommendations
4. **Check Storage**: View the storage widget in the bottom-right corner

## File Formats
- **Images**: Original format preserved (JPG, PNG, etc.)
- **Metadata**: JSON format for easy parsing
- **Summaries**: Plain text format for readability

## Tips
- **Organize by Date**: Each session is timestamped for easy organization
- **Backup Important**: Consider backing up the `gemini_recommendation` folder
- **Review Recommendations**: Check the summary text files for AI insights
- **Mobile Support**: Works on mobile browsers with download fallback

Enjoy your organized, AI-powered wardrobe management! 🎨👗
