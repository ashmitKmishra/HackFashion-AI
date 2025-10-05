# HackFashion-AI

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

Notes and next steps
- This front-end is a visual/marketing shell. Core back-end, model pipelines, auth, and storage will be added later.
- Planned: image upload + storage, Gemini vision/classification, outfit ranking, Gemini chat + ElevenLabs TTS, user auth and wardrobe DB.

Contributing
- Open issues or PRs. Tell me which feature to prioritize (upload flow, mock API, or model integration) and I will scaffold it.

License
- MIT
