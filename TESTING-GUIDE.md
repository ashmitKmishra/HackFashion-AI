# Testing Guide - Upload Wardrobe Flow

## What Was Fixed

### Problem
- localStorage is **separate** between different ports (`localhost:3000` vs `localhost:5173`)
- When you uploaded images on the main app and clicked "Save", the data was stored in port 3000's localStorage
- When the classifier app opened on port 5173, it had **no access** to port 3000's localStorage
- Result: Classifier always showed Step 1 (upload screen) instead of Step 2 (wardrobe view)

### Solution
Implemented **postMessage API** for cross-origin communication:
1. Main app (port 3000) uploads images and stores them locally
2. When "Save" is clicked, it opens the classifier app in a new tab
3. After 2 seconds (to allow page load), it sends the image data via `postMessage`
4. Classifier app (port 5173) listens for `LOAD_WARDROBE` messages
5. When received, it automatically categorizes the images using Gemini AI
6. User sees the wardrobe view (Step 2) with all items categorized!

## Files Modified

1. **src/components/UploadWardrobe.jsx**
   - Updated `handleContinue()` to use `window.open()` and `postMessage()`
   - Sends uploaded images to classifier via cross-origin message

2. **Ashar/ai-wardrobe-stylist/App.tsx**
   - Added second `useEffect` to listen for `postMessage` events
   - Validates origin (security: only accepts from `localhost:3000`)
   - Automatically categorizes received images
   - Populates wardrobe state with categorized items

## How to Test

### Step 1: Start Both Servers
```bash
# Terminal 1 - Main App
cd /Users/ashmitmishra/Desktop/HackFashion-AI
npm run dev
# Should run on http://localhost:3000

# Terminal 2 - Classifier App
cd /Users/ashmitmishra/Desktop/HackFashion-AI/Ashar/ai-wardrobe-stylist
npm run dev
# Should run on http://localhost:5173
```

### Step 2: Test the Upload Flow
1. Open `http://localhost:3000` in your browser
2. Click the **"Upload Your Wardrobe"** heading (the rainbow gradient heading)
3. Drag & drop 3-6 clothing images (PNG, JPG, WEBP)
4. You should see thumbnails of uploaded images
5. Click the **"Save"** button
6. A new tab will open at `http://localhost:5173`
7. **Expected Result**: You should see:
   - Loading spinner while AI categorizes
   - After ~5-10 seconds, your wardrobe items appear in Step 2
   - Items are categorized (tops, bottoms, shoes, etc.)
   - You can scroll down to "Generate Outfit" section

### Step 3: Verify Console Logs
Open browser DevTools (F12) on the classifier tab and check console:

**You should see:**
```
👂 Listening for postMessage from main app...
📨 Received message: {type: 'LOAD_WARDROBE', images: Array(6)}
✅ Received 6 images via postMessage
🤖 Starting AI categorization...
✅ Categorization complete: [...]
✅ Wardrobe loaded with 6 items from postMessage
```

## Troubleshooting

### Images Don't Load in Classifier
- **Check console**: Look for "Ignoring message from unknown origin"
  - If you see this, verify main app is on port 3000
  - The classifier only accepts messages from `http://localhost:3000`
  
- **Check timing**: postMessage is sent after 2 second delay
  - If classifier loads slowly, increase timeout in UploadWardrobe.jsx
  - Current: `setTimeout(..., 2000)` - try `3000` or `4000`

### "Save" Button Does Nothing
- Check browser popup blocker - classifier opens in new tab
- Look for errors in main app console (F12 on localhost:3000)

### AI Categorization Fails
- Check `.env.local` in `Ashar/ai-wardrobe-stylist/`
- Ensure `GEMINI_API_KEY` is set correctly
- Check API quota/limits in Google AI Studio

## Expected Behavior Summary

| Action | Main App (3000) | Classifier (5173) |
|--------|----------------|-------------------|
| Upload images | Stores to state & localStorage | N/A |
| Click "Save" | Opens classifier via `window.open()` | Loads page |
| 2 seconds later | Sends postMessage with images | Receives message |
| After message | Closes upload view | Categorizes images with AI |
| Final state | Returns to features page | Shows wardrobe (Step 2) |

## Success Criteria
✅ Upload images on main app
✅ Click "Save" → New tab opens
✅ Classifier automatically loads images
✅ AI categorization happens without manual upload
✅ Wardrobe view (Step 2) displays with categorized items
✅ No need to re-upload images in classifier

## Next Steps
Once this flow is working:
- Add error handling for failed postMessage
- Add loading indicator on classifier while waiting for message
- Consider adding "Back to main app" button
- Implement outfit generation and recommendations
