import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const baseFeatures = [
  { id: 'wardrobe', title: "Wardrobe Classifier", description: 'Upload photos and auto-classify items (tops, bottoms, outerwear).', color: '#00f5d4' },
  { id: 'voice', title: 'Voice Stylist', description: 'Chat with a voice-enabled stylist (Gemini + ElevenLabs).', color: '#ff3cac' },
  { id: 'generator', title: 'Outfit Generator', description: 'Generate outfits from your closet.', color: '#7c3aed' }
]

export default function FeaturesLauncher() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [iframeOpen, setIframeOpen] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')

  const openWardrobe = () => {
    // Open classifier in new tab
    window.open('http://localhost:5173', '_blank')
  }

  return (
    <section className="features" ref={ref}>
      <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
        Features
      </motion.h2>

      <div className="features-grid">
        {baseFeatures.map((f) => (
          <motion.div key={f.id} className="feature-card" whileHover={{ scale: 1.03 }}>
            <div className="feature-icon">●</div>
            <h3 style={{ color: f.color }}>{f.title}</h3>
            <p>{f.description}</p>
            {f.id === 'wardrobe' ? (
              <div style={{ marginTop: 12 }}>
                <button className="btn-primary" onClick={openWardrobe}>Get Started</button>
              </div>
            ) : (
              <div style={{ marginTop: 12 }}>
                <button className="btn-secondary">Try</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {iframeOpen && (
        <div className="iframe-overlay">
          <div className="iframe-header">
            <button className="btn-secondary" onClick={() => setIframeOpen(false)}>Close</button>
            <span style={{ marginLeft: 12 }}>Running: {iframeUrl}</span>
          </div>
          <iframe title="Wardrobe Classifier" src={iframeUrl} className="feature-iframe" />
        </div>
      )}
    </section>
  )
}
