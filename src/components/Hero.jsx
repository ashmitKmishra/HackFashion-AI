import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { useAuth0 } from '@auth0/auth0-react'

export default function Hero({ onButtonClick }) {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const [springs, api] = useSpring(() => ({
    from: { y: -50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    config: { tension: 120, friction: 14 }
  }))

  // Function to scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle Try the Preview button click
  const handleTryPreview = () => {
    if (isAuthenticated) {
      // If logged in, scroll to features
      scrollToFeatures()
    } else {
      // If not logged in, redirect to signup
      loginWithRedirect({ 
        authorizationParams: {
          screen_hint: "signup",
        }
      })
    }
  }

  // Carousel / outfit sets
  const outfitSets = [
    [ {emoji: '👕', label: 'Casual Tee'}, {emoji: '🧥', label: 'Light Jacket'}, {emoji: '👖', label: 'Slim Jeans'} ],
    [ {emoji: '👔', label: 'Button Shirt'}, {emoji: '🧥', label: 'Blazer'}, {emoji: '👞', label: 'Loafers'} ],
    [ {emoji: '👗', label: 'Summer Dress'}, {emoji: '🥿', label: 'Flats'}, {emoji: '👜', label: 'Crossbody'} ]
  ]

  const [index, setIndex] = useState(0)
  const controls = useAnimation()
  const carouselRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex(i => (i + 1) % outfitSets.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const floatingAnimation = {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  // parallax state
  const parallax = useRef({ x: 0, y: 0 })
  const handleMouseMove = (e) => {
    const rect = carouselRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    parallax.current = { x, y }
    // optional: animate a bit using spring
    controls.start({ x: x * 8, y: y * 6 })
  }

  return (
    <section className="hero">
      <div className="hero-bg">
        <motion.div 
          className="gradient-orb orb-1"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="gradient-orb orb-2"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="hero-content">
        <animated.div style={springs}>
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
          Upgrade Your
          <span className="gradient-text"> Fashion</span>
          <br />
          Without <span className="gradient-text">Hustle</span>
          </motion.h1>

          <motion.div 
            className="hero-subtitle-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hero-text">
                  <p className="eyebrow">Everything in <span className="highlight">ONE</span></p>

                  <p className="hero-sub">Your closet, organized. Your style, amplified. <span className="highlight">Forever</span></p>

                  <ul className="features-list" aria-label="features">
                    <li className="badge">Outfit Checks</li>
                    <li className="badge">Advance Color Suggestion</li>
                    <li className="badge">Personalized Stylist</li>
                  </ul>

                  <p className="hero-note">Get a personal stylist that knows your closet</p>
                </div>
          </motion.div>

          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button 
              className="btn-primary"
              onClick={handleTryPreview}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
            {isAuthenticated ? 'Try the Preview' : 'Try the Preview'}
            </motion.button>
            <motion.button 
              className="btn-secondary"
              onClick={onButtonClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            See Features
            </motion.button>
          </motion.div>
        </animated.div>

        <motion.div 
          className="hero-visual"
          animate={floatingAnimation}
        >
          <motion.div 
            className="dashboard-preview garment-preview"
            ref={carouselRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.8 }}
          >
            <div className="preview-card">
              <div className="preview-header">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>

              <div className="preview-content garments">
                <AnimatePresence initial={false} mode="popLayout">
                  {outfitSets[index].map((g, i) => (
                    <motion.div
                      key={g.label}
                      className="garment-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.45, delay: i * 0.08 }}
                      whileHover={{ rotateX: -6, translateY: -10 }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <motion.div className="garment-emoji" whileHover={{ scale: 1.06 }} transition={{ duration: 0.2 }}>
                        {g.emoji}
                      </motion.div>
                      <div className="garment-label">{g.label}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
