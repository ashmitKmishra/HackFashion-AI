// Gemini helper: simple wrapper to call Google Gemini text API (text-bison style)
import fetch from 'node-fetch';

// Use AI Studio / Generative Language endpoint (works with AI Studio API keys)
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export async function summarizeOutfit(data: any): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const fallback = `Outfit summary: ${typeof data === 'string' ? data : 'A smart casual outfit chosen for the weather.'}`;
  if (!apiKey) return fallback;

  const prompt = buildPrompt(data);
  const url = `https://generativelanguage.googleapis.com/v1/models/${DEFAULT_MODEL}:generateContent`;
  const body = {
    // AI Studio / generateContent expects a 'contents' array with parts
    contents: [{ parts: [{ text: prompt }] }]
    // NOTE: avoid passing unknown top-level fields (some API keys/models reject temperature/maxOutputTokens here)
  };

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const txt = await res.text();
        // If client error (4xx) like 404, don't retry
        if (res.status >= 400 && res.status < 500) {
          console.error(`Gemini API client error (attempt ${attempt}): ${res.status} ${txt}`);
          break;
        }
        console.warn(`Gemini API server error (attempt ${attempt}): ${res.status} ${txt}`);
        if (attempt < maxAttempts) await new Promise(r => setTimeout(r, attempt * 500));
        continue;
      }

      const json = await res.json();
      // Extract text from several possible response shapes
      let text = '';
      // common response: { candidates: [{ content: [{ text: '...' }] }] }
      if (json?.candidates?.[0]?.content?.[0]?.text) text = json.candidates[0].content[0].text;
      // alternate: { candidates: [{ output: '...' }] }
      if (!text && json?.candidates?.[0]?.output) text = json.candidates[0].output;
      // alternate: { response: { text: '...' } }
      if (!text && json?.response?.text) text = json.response.text;
      // fallback: try flattening any string fields
      if (!text) {
        const str = JSON.stringify(json);
        const m = str.match(/"text"\s*:\s*"([^"]+)"/);
        if (m) text = m[1];
      }

      if (text) return String(text);
      return fallback;
    } catch (err: any) {
      console.warn(`Gemini request failed (attempt ${attempt}): ${err?.message ?? err}`);
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, attempt * 500));
    }
  }

  return fallback;
}

function buildPrompt(data: any): string {
  if (typeof data === 'string') return `Summarize this outfit and explain why it works in 3 short sentences:\n\n${data}`;
  const weather = data.weather ? `Weather: ${JSON.stringify(data.weather)}` : '';
  const events = data.events ? `Events: ${JSON.stringify(data.events)}` : '';
  const items = Array.isArray(data.items) ? `Closet items: ${JSON.stringify(data.items.slice(0, 12))}` : '';
  return `You are a friendly stylist. Given the following information, pick 3-5 items to form an outfit and explain in 3 short sentences why it works. Return plain text.\n\n${weather}\n${events}\n${items}`;
}
