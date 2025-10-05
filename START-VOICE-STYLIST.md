# Voice Stylist - Complete Setup & Testing Guide

## ✅ Current Status
- Backend endpoints implemented (Gemini + ElevenLabs)
- VoiceStylist component created
- All buttons connected and wired
- Environment variables configured

## 🚀 How to Start Everything (3 terminals)

### Terminal 1: Backend Server
```bash
cd /Users/ashmitmishra/Desktop/HackFashion-AI/server
export $(grep -v '^#' .env | xargs)
node index.js
```
Expected output: `Server listening on 4000`

### Terminal 2: Main App (Root)
```bash
cd /Users/ashmitmishra/Desktop/HackFashion-AI
npm run dev
```
Expected output: Vite dev server URL (e.g., `http://localhost:3000` or `http://localhost:5173`)

### Terminal 3: Classifier App
```bash
cd /Users/ashmitmishra/Desktop/HackFashion-AI/Ashar/ai-wardrobe-stylist
npm run dev
```
Expected output: Vite dev server URL (e.g., `http://localhost:5173` - if 5173 is taken, it will use 5174)

## 🎯 Complete User Flow

### Method 1: From Main App Features Page
1. Open main app (Terminal 2 URL)
2. Click "Get Started" or navigate to Features
3. You'll see 3 cards: Wardrobe Classifier, Voice Stylist, Outfit Generator
4. Click **"Try"** button on **Voice Stylist** card (middle card with 🗣️)
5. New tab opens → Classifier app with Voice Stylist mode activated

### Method 2: Direct Link
1. Just open: `http://localhost:5173?mode=voice` (or whatever port Terminal 3 shows)
2. Voice Stylist mode activates automatically

## 📝 What Happens Next

### If NO wardrobe uploaded yet:
1. Voice Stylist shows: "Please upload your wardrobe first"
2. Click "Upload Wardrobe" button
3. Upload 3-5 clothing item photos (drag & drop or select files)
4. Click "Save" button
5. AI categorizes items using Gemini (takes 5-10 seconds)
6. After categorization completes, Voice Stylist automatically greets you

### If wardrobe already uploaded:
1. AI automatically greets you with voice:
   - Text: "Your wardrobe is in! I see X items. What event are you looking for, and what's the weather like?"
   - Audio plays via ElevenLabs TTS (you'll hear the AI speaking!)
2. Type your request in the input box, e.g.:
   - "I need a casual summer outfit"
   - "What should I wear for a formal dinner?"
   - "Suggest something for a beach party"
3. Click "Send" or press Enter
4. AI processes your request:
   - Calls Gemini with your wardrobe + request
   - Generates outfit suggestion with items from your wardrobe
   - Synthesizes response via ElevenLabs TTS
5. You see the response in chat AND hear it spoken!
6. Continue the conversation - ask follow-ups, request different styles, etc.

## 🧪 Quick Backend Test (Optional - verify endpoints work)

### Test server health:
```bash
curl http://localhost:4000/api/health
```
Expected: `{"status":"ok","gemini":true,"elevenlabs":true}`

### Test Gemini stylist session:
```bash
curl -X POST http://localhost:4000/api/stylist-session \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "casual summer outfit",
    "wardrobeSummaries": [
      {"description": "Blue t-shirt", "category": "Top"},
      {"description": "Denim jeans", "category": "Bottom"}
    ]
  }'
```
Expected: JSON with `{ "reply": { "name": "...", "itemDescriptions": [...], "justification": "..." } }`

### Test ElevenLabs TTS:
```bash
curl -X POST http://localhost:4000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello! Your outfit is ready."}' \
  --output test_audio.mp3

# Play the audio (Mac):
afplay test_audio.mp3
```
Expected: MP3 file created and you hear the voice

## 🐛 Troubleshooting

### Server won't start:
- Check if `.env` file exists in `/server/` folder
- Verify API keys are set correctly
- Check if port 4000 is already in use: `lsof -i :4000`

### Frontend won't start:
- Make sure you ran `npm install` in both root and `Ashar/ai-wardrobe-stylist`
- Check if ports 5173/5174 are available

### "Try" button does nothing:
- Make sure you're logged in (Auth0 authentication required)
- Check browser console for errors (F12 → Console tab)
- Verify all 3 servers are running

### No audio plays:
- Check browser console for TTS errors
- Verify ELEVENLABS_API_KEY is correct in server/.env
- Check browser audio permissions
- Open browser audio settings and unmute the tab

### API calls fail (404 or 500 errors):
- Verify backend is running on port 4000
- Check Vite proxy is working (should forward `/api/*` to `localhost:4000`)
- Look at server console for error logs

## 🎉 Success Checklist
- [ ] Backend server running (Terminal 1 shows "Server listening on 4000")
- [ ] Main app running (Terminal 2 shows Vite URL)
- [ ] Classifier app running (Terminal 3 shows Vite URL)
- [ ] Can open main app in browser
- [ ] Can see Features page with 3 cards
- [ ] "Try" button on Voice Stylist card works (opens new tab)
- [ ] Voice Stylist UI loads in new tab
- [ ] Can upload wardrobe images and AI categorizes them
- [ ] AI greets with voice after wardrobe is loaded
- [ ] Can type request and get AI response with audio
- [ ] Audio plays in browser

## 📦 What Was Built

### Backend (server/)
- ✅ POST `/api/categorize` - Gemini vision classification
- ✅ POST `/api/stylist-session` - Gemini outfit generation with context
- ✅ POST `/api/tts` - ElevenLabs text-to-speech synthesis
- ✅ GET `/api/health` - Health check with API status

### Frontend (Ashar/ai-wardrobe-stylist/)
- ✅ VoiceStylist component with chat UI
- ✅ Auto-greeting when wardrobe loads
- ✅ Text input for user requests
- ✅ Automatic audio playback for AI responses
- ✅ Chat history display
- ✅ URL param detection (`?mode=voice`)

### Integration
- ✅ FeaturesLauncher "Try" button → opens Voice Stylist
- ✅ FeaturesPage "Try" button → opens Voice Stylist
- ✅ Vite proxy forwards `/api/*` to backend
- ✅ Environment variables configured
- ✅ Auth0 authentication check

## 🔐 Security Notes
- ⚠️ API keys are in server/.env (DO NOT COMMIT TO GIT)
- ⚠️ .env is in .gitignore (verify with: `git status`)
- ⚠️ For production: use environment variables or secrets manager
- ⚠️ Consider rotating ElevenLabs key if shared publicly

---

**Ready to test!** Run the 3 terminal commands above and follow the user flow. 🚀
