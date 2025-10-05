const express = require('express')
const cors = require('cors')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Require API keys in env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || null
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || null
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'alloy'
const ELEVENLABS_HOST = process.env.ELEVENLABS_HOST || 'https://api.elevenlabs.io'

let GenAI
try {
  GenAI = require('@google/genai')
} catch (e) {
  console.warn('Optional @google/genai not installed; install it to enable Gemini features')
}

const axios = require('axios')

app.get('/api/health', (req, res) => res.json({ status: 'ok', gemini: !!GEMINI_API_KEY, elevenlabs: !!ELEVENLABS_API_KEY }))

// Upload a wardrobe image (multipart) - returns a local file path (simple)
app.post('/api/wardrobe/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  // In production, upload to S3 or persistent storage. For now return file info.
  res.json({ id: req.file.filename, url: `/uploads/${req.file.filename}`, mimeType: req.file.mimetype })
})

// Simple save endpoint for client (accepts base64 images or ids)
app.post('/api/wardrobe/save', (req, res) => {
  const images = req.body.images || []
  // For MVP just echo back a wardrobeId and count
  res.json({ wardrobeId: `wardrobe_${Date.now()}`, saved: images.length })
})

// Categorize images via Gemini (server-side)
app.post('/api/categorize', async (req, res) => {
  try {
    if (!GEMINI_API_KEY || !GenAI) return res.status(500).json({ error: 'Gemini not configured on server' })
    const images = req.body.images || []

    const ai = new GenAI.GoogleGenAI({ apiKey: GEMINI_API_KEY })

    const fileToGenerativePart = (data, mimeType) => ({ inlineData: { data, mimeType } })

    const imageParts = images.map(img => fileToGenerativePart(img.data, img.mimeType))

    const prompt = `Analyze these images of clothing items. For each image, in the exact same order they are provided, identify its category and provide a brief, descriptive name. Return ONLY a JSON array of objects with keys: category and description.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [ ...imageParts, { text: prompt } ] },
      config: {
        responseMimeType: 'application/json'
      }
    })

    const result = JSON.parse(response.text)
    return res.json({ items: result })
  } catch (err) {
    console.error('Error /api/categorize', err)
    res.status(500).json({ error: 'Categorization failed' })
  }
})

// Stylist session: send a prompt + wardrobe summary to Gemini, return structured reply
app.post('/api/stylist-session', async (req, res) => {
  try {
    if (!GEMINI_API_KEY || !GenAI) return res.status(500).json({ error: 'Gemini not configured on server' })
    const { prompt, wardrobeSummaries } = req.body
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

    const ai = new GenAI.GoogleGenAI({ apiKey: GEMINI_API_KEY })

    const wardrobeText = wardrobeSummaries && wardrobeSummaries.length > 0 ? wardrobeSummaries.map(i => `- ${i.description} (Category: ${i.category})`).join('\n') : ''

    const fullPrompt = `You are an expert stylist. User asks: ${prompt}\n\nAvailable wardrobe items:\n${wardrobeText}\n\nRespond ONLY with a JSON object: { name: string, itemDescriptions: string[], justification: string }.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: { responseMimeType: 'application/json' }
    })

    const parsed = JSON.parse(response.text)
    res.json({ reply: parsed })
  } catch (err) {
    console.error('Error /api/stylist-session', err)
    res.status(500).json({ error: 'Stylist session failed' })
  }
})

// TTS: call ElevenLabs to synthesize text
app.post('/api/tts', async (req, res) => {
  try {
    if (!ELEVENLABS_API_KEY) return res.status(500).json({ error: 'ElevenLabs not configured' })
    const { text, voice, format = 'mp3' } = req.body
    if (!text) return res.status(400).json({ error: 'Missing text' })

    const voiceId = voice || ELEVENLABS_VOICE_ID
    const elevenUrl = `${ELEVENLABS_HOST}/v1/text-to-speech/${voiceId}`
    
    const response = await axios.post(elevenUrl, {
      text,
      model_id: 'eleven_monolingual_v1'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer'
    })

    res.set('Content-Type', `audio/${format}`)
    return res.send(Buffer.from(response.data))
  } catch (err) {
    console.error('Error /api/tts', err.response?.data || err.message)
    res.status(500).json({ error: 'TTS failed', details: err.response?.data || err.message })
  }
})

app.get('/api/cashbackTips', (req, res) => {
  // Static example response
  res.json({ tips: [
    { card: 'Discover', category: 'Gas', note: '5% rotating for April' },
    { card: 'Chase Freedom', category: 'Groceries', note: '1% base + 3% bonus' }
  ]})
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log('Server listening on', port))
