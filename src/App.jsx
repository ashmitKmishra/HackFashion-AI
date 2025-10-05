import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Benefits from './components/Benefits'
import CTA from './components/CTA'
import ComingSoon from './components/ComingSoon'
import './styles.css'

export default function App() {
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleButtonClick = () => {
    setShowComingSoon(true)
  }

  const handleBack = () => {
    setShowComingSoon(false)
  }

  if (showComingSoon) {
    return (
      <>
        <Header />
        <ComingSoon onBack={handleBack} />
      </>
    )
  }

  return (
    <div className="app-container">
      <Header />
      <Hero onButtonClick={handleButtonClick} />
      <Features />
      <Benefits />
      <CTA onButtonClick={handleButtonClick} />
    </div>
  )
}
