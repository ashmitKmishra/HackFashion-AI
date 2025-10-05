import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ComingSoon from './ComingSoon'
import UploadWardrobe from './UploadWardrobe'

export default function FeaturesPage({ onBack }) {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const openWardrobe = () => {
    // Show upload page instead of opening classifier directly
    setShowUpload(true)
  }

  const handleUploadComplete = (images) => {
    // After upload, open classifier at Step 2 with images loaded
    // Images are already in localStorage, classifier will read them
    window.open('http://localhost:5173', '_blank')
    // Go back to features page
    setShowUpload(false)
  }

  // Show upload page
  if (showUpload) {
    return <UploadWardrobe onBack={() => setShowUpload(false)} onComplete={handleUploadComplete} />
  }

  // Early return for coming soon
  if (showComingSoon) {
    return <ComingSoon onBack={() => setShowComingSoon(false)} />
  }

  // Main features page
  return (
    <div className="features-page">
      <motion.button className="back-button" onClick={onBack} whileHover={{ x: -6 }}>← Back</motion.button>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        onClick={openWardrobe}
        className="upload-heading-button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Upload Your Wardrobe
      </motion.h2>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">👗</div>
          <h3>Organize & Recommend</h3>
          <p>Upload your wardrobe, auto-categorize items, and get outfit recommendations.</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn-primary" onClick={() => window.open('http://localhost:5173', '_blank')}>Get Started</button>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🗣️</div>
          <h3>Personalized AI Assistant</h3>
          <p>Voice & chat stylist — coming soon.</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn-secondary" onClick={() => setShowComingSoon(true)}>Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  )
}
