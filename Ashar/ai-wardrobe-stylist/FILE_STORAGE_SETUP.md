# File Storage Setup for AI Wardrobe Stylist

## Overview
The AI Wardrobe Stylist now automatically saves all photos and recommendations to local directories using a backend service.

## Directory Structure
Files are saved in the `saved_data` folder with the following structure:

```
saved_data/
├── wardrobe/                    # Wardrobe photos by session
│   └── session_[timestamp]/
│       ├── 1_Top_Blue_shirt.jpg
│       ├── 2_Bottom_Jeans.jpg
│       └── wardrobe_metadata.json
├── personal_photo/              # Personal photos
│   └── personal_photo_[timestamp].jpg
└── gemini_recommendation/       # AI outfit recommendations
    └── recommendation_[timestamp]/
        ├── recommendation.json
        ├── recommendation_summary.txt
        └── selected_items/
            ├── 1_Top_Blue_shirt.jpg
            └── 2_Bottom_Jeans.jpg
```

## How to Run

### 1. Start the Backend Server
```bash
cd Ashar/ai-wardrobe-stylist
node fileStorageServer.js
```
The server will run on http://localhost:3001

### 2. Start the React App
```bash
cd Ashar/ai-wardrobe-stylist
npm run dev
```
The app will run on http://localhost:5173

## What Gets Saved Automatically

### 📸 Wardrobe Photos
- **Location**: `saved_data/wardrobe/session_[timestamp]/`
- **Includes**: Individual clothing items + metadata JSON
- **Triggered**: When wardrobe photos are uploaded and categorized

### 👤 Personal Photos  
- **Location**: `saved_data/personal_photo/`
- **Includes**: Personal reference photos
- **Triggered**: When personal photo is uploaded

### ✨ Gemini Recommendations
- **Location**: `saved_data/gemini_recommendation/recommendation_[timestamp]/`
- **Includes**: 
  - `recommendation.json` - Complete outfit data and criteria
  - `recommendation_summary.txt` - Human-readable explanation
  - `selected_items/` folder with photos of recommended items
- **Triggered**: When Gemini generates an outfit recommendation

## Features

- ✅ **Automatic Saving**: No user intervention required
- ✅ **Organized Structure**: Timestamped sessions for easy browsing
- ✅ **Complete Data**: Photos, metadata, and AI reasoning
- ✅ **Local Storage**: All files stay on your computer
- ✅ **Statistics Tracking**: View saved file counts in the app

## Backend API Endpoints

- `GET /api/health` - Check service status
- `POST /api/save-wardrobe` - Save wardrobe photos
- `POST /api/save-personal-photo` - Save personal photo
- `POST /api/save-recommendation` - Save Gemini recommendation
- `GET /api/storage-stats` - Get file count statistics

## Privacy & Security
- All files are saved locally on your machine
- No cloud uploads or external services
- Complete control over your data
- Photos and recommendations remain private
