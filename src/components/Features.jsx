import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const features = [
  {
    icon: '�',
    title: 'Auto Categorization',
    description: 'Snap photos of your clothes and the app tags tops, bottoms, outerwear, accessories automatically.',
    color: '#00f5d4'
  },
  {
    icon: '�',
    title: 'Outfit Generator',
    description: 'Generate ready-to-wear outfits from what you already own — styled for events, weather, or mood.',
    color: '#7c3aed'
  },
  {
    icon: '🗣️',
    title: 'Personal Stylist',
    description: 'Chat or speak with a Personalized stylist to get personalized advice and swaps.',
    color: '#ff3cac'
  },
  {
    icon: '🌈',
    title: 'Color & Fit Tips',
    description: 'Get palette and fit recommendations based on your height, body-type and existing colors.',
    color: '#ffd166'
  }
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <section className="features" ref={ref}>
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Meet <span className="gradient-text">HackFashion-AI</span>
      </motion.h2>

      <motion.div 
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 20px 60px ${feature.color}30`
            }}
          >
            <motion.div 
              className="feature-icon"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              {feature.icon}
            </motion.div>
            <h3 style={{ color: feature.color }}>{feature.title}</h3>
            <p>{feature.description}</p>
            
            <motion.div 
              className="feature-glow"
              style={{ backgroundColor: feature.color }}
              animate={{
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
