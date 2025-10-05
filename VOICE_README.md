# Voice integration (Gemini + ElevenLabs)

This folder contains a small voice integration that uses Google Gemini to summarize outfit data and ElevenLabs to synthesize speech (MP3). It exposes a Next.js route at `/api/voice` which accepts JSON and returns an MP3.

Environment variables (see `.env.example`):

Quick test (development):

1. Start the Next.js dev server:

```powershell
pnpm dev
```

2. Run the demo script in another terminal (this will POST sample data and save `outfit.mp3`):

```powershell
pnpm run demo-voice
```

Notes:

## Preparing to push to GitHub (important: do NOT commit secrets)

Before pushing this repository to a remote, make sure you do NOT commit your `.env` file or any API keys. Follow these quick steps in PowerShell (run from the project root):

1) Ensure `.env` is ignored (this project already includes `.gitignore` with `.env`, but verify):

```powershell
Select-String -Path .gitignore -Pattern "^\.env$" || Add-Content -Path .gitignore -Value ".env"
```

2) If you previously committed `.env`, remove it from the git index (keeps the file locally but removes it from the repo):

```powershell
git rm --cached .env || Write-Output "No .env tracked"
git add .gitignore
git commit -m "chore: ignore local env and remove from index"
```

3) Also ensure generated artifacts like `outfit.mp3` are ignored (this repo already ignores it). If not, add it to `.gitignore` similarly.

4) Create a new branch and push your work to GitHub (replace `<remote>` with `origin` if your remote is named origin):

```powershell
# create and switch to the branch
git checkout -b eleven-lab

# stage all changes (make sure .env is not staged)
git add .
git commit -m "feat(voice): add Gemini + ElevenLabs voice page and demo"

# push and set upstream
git push -u origin eleven-lab
```

If your repository doesn't have a remote yet, add it first:

```powershell
git remote add origin https://github.com/<your-org-or-username>/<repo>.git
git push -u origin eleven-lab
```

Security reminder: Because API keys were present in development, rotate or revoke keys you printed or shared during testing and use new keys stored only in your local `.env` (never commit them to Git).

If you want, I can add a small helper script `scripts/git-safe-push.ps1` that performs the checks automatically before pushing.
