import fetch from 'node-fetch';

const DEFAULT_HOST = process.env.ELEVENLABS_HOST || 'https://api.elevenlabs.io';

export async function synthesizeSpeech(text: string, voiceId?: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not set in environment; set ELEVENLABS_API_KEY in .env');
  }

  const voice = voiceId || process.env.ELEVENLABS_VOICE_ID || (await pickFemaleVoice(apiKey));
  const url = `${DEFAULT_HOST}/v1/text-to-speech/${voice}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({ text, voice_settings: { stability: 0.6, similarity_boost: 0.75 } })
  });

  if (!res.ok) {
    const txt = await res.text();
    const err = new Error(`ElevenLabs TTS error: ${res.status} ${txt}`);
    // Attach details for easier debugging
    (err as any).status = res.status;
    (err as any).body = txt;
    throw err;
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function listVoices(): Promise<any[]> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');
  const url = `${DEFAULT_HOST}/v1/voices`;
  const res = await fetch(url, { headers: { 'xi-api-key': apiKey } });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`ElevenLabs list voices error: ${res.status} ${txt}`);
  }
  const json = await res.json();
  return json?.voices ?? json ?? [];
}

async function pickFemaleVoice(apiKey: string): Promise<string> {
  try {
    const voices = await listVoices();
    // Try to pick by known voice id env first
    const preferred = process.env.ELEVENLABS_VOICE_ID;
    if (preferred) return preferred;
    // Try to find female voice
    const female = voices.find((v: any) => /female|woman/i.test(String(v?.gender || v?.name || '')));
    return female?.voice_id ?? voices[0]?.voice_id ?? 'alloy';
  } catch (e) {
    return 'alloy';
  }
}
