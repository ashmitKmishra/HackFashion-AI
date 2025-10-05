# HackFashion-AI Complete Startup Guide

## Updated start-all.sh Script

The startup script has been enhanced to include the **File Storage Server** with Gemini AI integration.

### What the Script Does

#### 1. Dependency Installation
- **Main App**: Installs npm dependencies for the main application
- **AI Wardrobe Stylist**: Installs React app dependencies
- **File Storage Server**: Ensures required packages are installed:
  - `@google/genai` - Gemini AI integration
  - `express` - Backend server framework
  - `cors` - Cross-origin resource sharing
  - `dotenv` - Environment variables

#### 2. Environment Validation
- **Checks for .env file** in AI Wardrobe Stylist directory
- **Validates Gemini API key** configuration
- **Warns if required files are missing**

#### 3. Server Startup (Optimized Order)
1. **File Storage Server** (Port 3001) - Started first as it's required by the frontend
2. **AI Wardrobe Stylist** (Port 5174) - React frontend that depends on file storage
3. **Main App** (Port 3000) - Main application interface

### Usage

#### Quick Start
```bash
# From the project root directory
./start-all.sh
```

#### Manual Start (Alternative)
```bash
# Terminal 1 - File Storage Server
cd Ashar/ai-wardrobe-stylist
node fileStorageServer.js

# Terminal 2 - AI Wardrobe Stylist  
cd Ashar/ai-wardrobe-stylist
npm run dev

# Terminal 3 - Main App
npm run dev
```

### Server Details

#### File Storage Server (Port 3001)
- **Purpose**: Handles file operations and Gemini AI image generation
- **Endpoints**:
  - `POST /api/save-wardrobe` - Save wardrobe photos
  - `POST /api/save-personal-photo` - Save personal photos
  - `POST /api/save-recommendation` - Generate outfit + realistic photos
  - `GET /api/storage-stats` - Get storage statistics
  - `GET /api/health` - Health check

#### AI Wardrobe Stylist (Port 5174)
- **Purpose**: React frontend for outfit recommendations and photo generation
- **Features**:
  - Upload wardrobe and personal photos
  - Generate outfit recommendations
  - **NEW**: Generate realistic photos with personal photos
  - View generated images and recommendations

#### Main App (Port 3000)
- **Purpose**: Main application interface and landing page
- **Integration**: Can communicate with AI Wardrobe Stylist via postMessage

### Environment Requirements

#### .env File Location
```
Ashar/ai-wardrobe-stylist/.env
```

#### Required Environment Variables
```env
GEMINI_API_KEY=AIzaSyD0a_OMPohum1LqY3u0IooRA7E2CigHCpo
```

### File Storage Structure
```
Ashar/ai-wardrobe-stylist/saved_data/
├── wardrobe/                    # Wardrobe sessions (persistent)
├── personal_photo/              # Personal photos (persistent)
└── gemini_recommendation/       # Generated content (cleared on new generation)
    ├── realistic_outfit_photo.png
    ├── outfit_collage.png
    ├── recommendation.json
    └── recommendation_summary.txt
```

### Process Management

#### Starting All Services
The script automatically starts all three services in the correct order with proper delays to ensure dependencies are ready.

#### Stopping All Services
- **Ctrl+C**: Gracefully stops all running servers
- **Cleanup**: Automatically kills all background processes
- **PIDs Tracked**: Main App, File Storage Server, AI Wardrobe Stylist

### Success Indicators

When the script runs successfully, you should see:
```
========================================
All applications are running!
========================================
Main App PID: [number]
File Storage Server PID: [number]  
AI Wardrobe Stylist PID: [number]

Press Ctrl+C to stop all servers
```

### Access URLs
- **Main App**: http://localhost:3000
- **AI Wardrobe Stylist**: http://localhost:5174
- **File Storage API**: http://localhost:3001

### Troubleshooting

#### Common Issues
1. **Port conflicts**: Kill existing processes on ports 3000, 3001, 5174
2. **Missing .env**: Ensure Gemini API key is configured
3. **Dependency errors**: Run `npm install` in each directory manually
4. **Permission errors**: Ensure script is executable (`chmod +x start-all.sh`)

#### Log Locations
- **File Storage Server**: Console output shows file operations and Gemini API calls
- **Frontend**: Browser console shows upload progress and API communications
- **Main App**: Standard React development server logs

### New Features Enabled
- ✅ **Realistic Photo Generation**: Users can generate AI photos wearing recommended outfits
- ✅ **File Persistence**: Organized storage system for all user data
- ✅ **Gemini Integration**: Advanced AI image generation with personal photos
- ✅ **Seamless Workflow**: Single command startup for complete development environment

The enhanced startup script ensures all components work together seamlessly for the complete HackFashion-AI experience!
