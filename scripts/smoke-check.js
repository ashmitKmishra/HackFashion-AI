const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Auto-load .env from project root (simple parser, no dependency)
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split(/\r?\n/).forEach(line => {
      const s = line.trim();
      if (!s || s.startsWith('#')) return;
      const idx = s.indexOf('=');
      if (idx === -1) return;
      const k = s.slice(0, idx).trim();
      let v = s.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    });
  }
} catch (e) {
  // ignore errors reading .env, we'll fallback to process.env
}

async function checkElevenLabs() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const host = process.env.ELEVENLABS_HOST || 'https://api.elevenlabs.io';
  if (!apiKey) {
    console.log('ELEVENLABS_API_KEY not set - skipping ElevenLabs check');
    return;
  }
  const url = `${host}/v1/voices`;
  console.log('Checking ElevenLabs voices...');
  const res = await fetch(url, { headers: { 'xi-api-key': apiKey } });
  if (!res.ok) {
    console.error('ElevenLabs voices request failed', res.status, await res.text());
    return;
  }
  const json = await res.json();
  const voices = json?.voices ?? json ?? [];
  console.log(`Found ${voices.length} voices. First 5:`);
  console.log(voices.slice(0,5).map(v=>({ id: v.voice_id, name: v.name, gender: v.gender })).slice(0,5));
}

async function checkGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log('GEMINI_API_KEY not set - skipping Gemini check');
    return;
  }
  console.log('Checking Gemini text generation endpoint (AI Studio style)...');
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;
  const body = { contents: [{ parts: [{ text: 'Say hello in one sentence.' }] }] };
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, body: JSON.stringify(body) });
  if (!res.ok) {
    console.error('Gemini request failed', res.status, await res.text());
    return;
  }
  const json = await res.json();
  // Try to extract a readable text from the response
  let text = '';
  if (json?.candidates?.[0]?.content?.[0]?.text) text = json.candidates[0].content[0].text;
  if (!text && json?.candidates?.[0]?.output) text = json.candidates[0].output;
  if (!text && json?.response?.text) text = json.response.text;
  console.log('Gemini returned text:', text || JSON.stringify(json).slice(0,300));
}

async function run() {
  try {
    await checkElevenLabs();
    await checkGemini();
    console.log('Smoke check finished');
  } catch (e) {
    console.error('Smoke check error', e);
  }
}

run();
