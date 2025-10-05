import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import FeaturesLauncher from './components/FeaturesLauncher'
import FeaturesPage from './components/FeaturesPage'
import Benefits from './components/Benefits'
import CTA from './components/CTA'
import ComingSoon from './components/ComingSoon'
import './styles.css'

export default function App() {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [showFeaturesPage, setShowFeaturesPage] = useState(false)

  const handleButtonClick = () => {
    // Open the new Features page instead of the generic Coming Soon
    setShowFeaturesPage(true)
  }

  const handleBack = () => {
    setShowComingSoon(false)
    setShowFeaturesPage(false)
  }

  if (showComingSoon) {
    return <ComingSoon onBack={handleBack} />
  }

  if (showFeaturesPage) {
    return <FeaturesPage onBack={handleBack} />
  }

  return (
    <div className="app-container">
  <Hero onButtonClick={handleButtonClick} />
  <FeaturesLauncher />
      <Benefits />
      <CTA onButtonClick={handleButtonClick} />
    </div>
  )
}
