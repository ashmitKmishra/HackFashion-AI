# HackFashion-AI
WEBSITE LINK: https://hackfashionai.netlify.app/
HackFashion-AI is an AI-first wardrobe manager and stylist. This repo currently contains the single-page marketing/welcome site and a UI scaffold for the future core app (image uploads, outfit generation, and conversational styling). The site is designed with a Gen‑Z aesthetic and includes animated preview components to illustrate core product ideas.

What the app will do
- Auto-categorize every clothing item from user photos (tops, bottoms, outerwear, accessories)
- Generate outfit combinations from the user’s wardrobe tailored to event, weather, mood, height and body type
- Provide a conversational/styling assistant powered by language and voice models (e.g., Gemini + ElevenLabs)
- Recommend color palettes, fit adjustments and sustainable ways to wear more of what you own

Tech stack (current)
# HackFashion-AI

HackFashion-AI is an AI-powered wardrobe manager and stylist. This repository contains the welcome/marketing website and a UI scaffold for the core app we will build: image uploads, outfit generation, and conversational styling.

Overview
- Auto-categorize wardrobe items from photos (tops, bottoms, outerwear, accessories).
- Generate outfit combinations tailored to event, weather, mood, height, and body type.
- Provide conversational/voice styling using language and TTS models (Gemini + ElevenLabs planned).

Tech stack
- Frontend: React 18 + Vite
- Animations: Framer Motion + react-spring
- Styling: CSS variables + responsive rules (Tailwind optional)

Repository structure
- `index.html` — app entry
- `src/` — React app
  - `App.jsx`, `main.jsx` — app bootstrap
  - `components/` — UI components (Hero, Features, Benefits, CTA, ComingSoon)
  - `hooks/` — small utilities (`useTheme`, `useUploadPreview`)
- `server/` — simple server scaffold (uploads, future API)

How to run locally

### Quick Start (Recommended)
Use the `start-all.sh` script to automatically install dependencies and run both applications:

```bash
./start-all.sh
```

This script will:
- Install dependencies for both the main app and AI Wardrobe Stylist
- Start the main app (usually on http://localhost:3000 or 3001)
- Start the AI Wardrobe Stylist (on http://localhost:5173)
- Press `Ctrl+C` to stop both servers

### Manual Setup
1. Install Node.js (v18+) and npm.
2. If project is on macOS Desktop and you get an EPERM uv_cwd error, either:
   - Grant Terminal access to Desktop: System Settings → Privacy & Security → Files and Folders → allow "Terminal", or
   - Move the project off Desktop: `mv ~/Desktop/HackFashion-AI ~/Projects/`
3. From the project root run:
```bash
npm install
npm run dev
```
Open the printed local URL (usually http://localhost:{port_number}).

Running the wardrobe classifier locally
- The wardrobe classifier app lives in `Ashar/ai-wardrobe-stylist` and must be started separately for the iframe integration to work during development.
- **Note:** The `start-all.sh` script automatically handles this. If running manually, open a second terminal and run:
```bash
cd Ashar/ai-wardrobe-stylist
npm install
npm run dev
# This typically serves on http://localhost:5173
```
 - Make sure `Ashar/ai-wardrobe-stylist/.env` contains `GEMINI_API_KEY` as required by that app's Vite config (the app maps the env key to `process.env.API_KEY` in the client bundle).
 - See `Ashar/ai-wardrobe-stylist/.env.example` for the required format.

Replacing the iframe with a production URL
 - In `src/components/FeaturesPage.jsx` and `src/components/FeaturesLauncher.jsx` the iframe default URL is `http://localhost:5173`. Replace that string with your production URL (for example, `https://ai-wardrobe.example.com`) when you deploy the wardrobe classifier app.
- For secure production usage, avoid embedding API keys client-side. Instead, host a backend that calls the Generative API server-side and returns safe results to the client.

Notes and next steps
- This front-end is a visual/marketing shell. Core back-end, model pipelines, auth, and storage will be added later.
- Planned: image upload + storage, Gemini vision/classification, outfit ranking, Gemini chat + ElevenLabs TTS, user auth and wardrobe DB.

Contributing
- Open issues or PRs. Tell me which feature to prioritize (upload flow, mock API, or model integration) and I will scaffold it.

License
- MIT
