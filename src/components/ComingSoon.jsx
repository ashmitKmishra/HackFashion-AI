import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ComingSoon({ onBack }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 3 + Math.random() * 4
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    // In production, you'd send this to your backend
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="coming-soon">
      {/* Animated background particles */}
      <div className="particles">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <motion.div 
        className="coming-soon-orb orb-1"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="coming-soon-orb orb-2"
        animate={{
          scale: [1.3, 1, 1.3],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="coming-soon-content">
        {/* Back button */}
        <motion.button
          className="back-button"
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ x: -5 }}
        >
          ← Back to Home
        </motion.button>

        {/* Main content */}
        <motion.div
          className="coming-soon-main"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="rocket"
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🚀
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="gradient-text">HackFashion-AI</span>
          </motion.h1>

          <motion.p
            className="coming-soon-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            The AI wardrobe manager — snap, organize, and style your entire closet.
          </motion.p>

          {/* Animated feature list */}
          <motion.div
            className="feature-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {['Auto-categorize wardrobe', 'Generate daily outfits', 'Voice stylist (Gemini + ElevenLabs)', 'Color & fit personalization'].map((feature, index) => (
              <motion.div
                key={feature}
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              >
                <span className="check">✓</span> {feature}
              </motion.div>
            ))}
          </motion.div>

          {/* Email notification form */}
          <motion.div
            className="notify-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="email-input"
                />
                <motion.button
                  type="submit"
                  className="notify-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Notify Me
                </motion.button>
              </form>
            ) : (
              <motion.div
                className="success-message"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                ✓ Thanks! We'll notify you when we launch
              </motion.div>
            )}
          </motion.div>

          {/* Countdown timer (fake for now) */}
          <motion.div
            className="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <div className="countdown-item">
              <span className="countdown-number">Thank You for Waiting!</span>
              {/* <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">08</span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">23</span>
              <span className="countdown-label">Minutes</span> */}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
