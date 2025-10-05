import { NextRequest, NextResponse } from 'next/server';
import { summarizeOutfit } from '../../../lib/gemini';
import { synthesizeSpeech } from '../../../lib/elevenlabs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accept either { summary } or full data { weather, events, items }
    const input = body.summary ?? body;

    const summary = typeof input === 'string' ? input : await summarizeOutfit(input);

    const audio = await synthesizeSpeech(summary);

    return new NextResponse(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="outfit.mp3"'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
