"use client";
import { useState, useRef } from 'react';

export default function VoiceDemoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handlePlay() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/voice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.onended = () => { URL.revokeObjectURL(url); };
      await audioRef.current.play();
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>WearWise — Voice Demo</h1>
      <p>Click the button to generate an outfit summary (Gemini) and hear it (ElevenLabs).</p>
      <button onClick={handlePlay} disabled={loading} style={{ padding: '8px 16px', fontSize: 16 }}>
        {loading ? 'Generating...' : 'Play Outfit Voice'}
      </button>
      {error && <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div>}
    </div>
  );
}
