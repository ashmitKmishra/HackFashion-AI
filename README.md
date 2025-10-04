# HackFashion-AI

HackFashion-AI is an AI-first wardrobe manager and stylist. This repo currently contains the single-page marketing/welcome site and a UI scaffold for the future core app (image uploads, outfit generation, and conversational styling). The site is designed with a Gen‑Z aesthetic and includes animated preview components to illustrate core product ideas.

What the app will do
- Auto-categorize every clothing item from user photos (tops, bottoms, outerwear, accessories)
- Generate outfit combinations from the user’s wardrobe tailored to event, weather, mood, height and body type
- Provide a conversational/styling assistant powered by language and voice models (e.g., Gemini + ElevenLabs)
- Recommend color palettes, fit adjustments and sustainable ways to wear more of what you own

Tech stack (current)
- Frontend: React 18 + Vite
- Animations: Framer Motion, react-spring (small helpers)
- Styling: plain CSS with CSS variables (palette) and responsive rules (Tailwind is optional)
- Dev tools: Vite (dev server, HMR)

Repository layout
- `index.html` — app entry
- `src/` — React app
	- `App.jsx`, `main.jsx` — app shell
	- `components/` — `Hero`, `Features`, `Benefits`, `CTA`, `ComingSoon`
	- `hooks/` — small hooks (`useTheme`, `useUploadPreview`)
- `server/` — small server scaffold (for future uploads / APIs)

How to run locally
1. Ensure Node.js (>= 18) and npm are installed.
2. If your project is on macOS Desktop and you hit permission errors (EPERM uv_cwd), either grant Terminal access to Desktop in:
	 System Settings → Privacy & Security → Files and Folders → allow "Terminal" access to Desktop
	 or move the project out of Desktop (example: `mv ~/Desktop/HackFashion-AI ~/Projects/`)

3. From the project root:
```bash
npm install
npm run dev
```

The dev server (Vite) will start and print a local URL (typically http://localhost:5173). Open that in your browser to preview the site.

Notes & next steps
- The site is a marketing shell for the product and does not include the full backend or ML pipelines yet.
- Planned work: image upload pipeline, clothes categorization model, outfit-ranking model, Gemini/ElevenLabs conversational/voice integration, auth, and a user wardrobe DB.
- If you want Tailwind instead of plain CSS, I can add it (requires installing tailwind packages and minor refactor).

Contact / contributing
- Open issues or create PRs. If you'd like me to continue building features (upload flow, mock API endpoints, or model integration), tell me which to prioritize and I’ll scaffold it.

## Project Structure

```
CashHack-Pro/
├── index.html      # Main HTML file
├── styles.css      # CSS styles
├── script.js       # JavaScript functionality
└── README.md       # Project documentation
```

## Getting Started

1. Open `index.html` in your web browser
2. Start building your hackathon project!

## Features

- Responsive design
- Modern CSS styling
- Basic JavaScript functionality
- Clean and minimal structure

## Development

This is a basic boilerplate template. Add your hackathon features and functionality as needed.

## License

This project is created for hackathon purposes.
