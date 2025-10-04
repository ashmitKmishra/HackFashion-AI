import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'

const benefits = [
  {
    emoji: '�',
    title: 'Confidence Boost',
    subtitle: "Look sharp — get outfit choices that make you feel put together"
  },
  {
    emoji: '🧥',
    title: 'Less Waste',
    subtitle: 'Wear more of what you own — reduce impulse buys'
  },
  {
    emoji: '⏱️',
    title: 'Save Time',
    subtitle: 'Decide outfits in seconds with curated combos'
  },
  {
    emoji: '💛',
    title: 'Personalized Fit',
    subtitle: 'Tailored suggestions for your body type and height'
  }
]

export default function Benefits() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="benefits" ref={ref}>
      <motion.div
        className="benefits-header"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">
          What We <span className="gradient-text">Provide</span> that others don't
        </h2>
        <p className="section-subtitle"></p>
      </motion.div>

      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="benefit-card"
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div 
              className="benefit-emoji"
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 2 + index * 0.5
              }}
            >
              {benefit.emoji}
            </motion.div>
            <h3>{benefit.title}</h3>
            <p>{benefit.subtitle}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="stats-row"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="stat">
          <motion.h3
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            60%
          </motion.h3>
          <p>Of people feel more confident after a styled outfit</p>
        </div>
        <div className="stat">
          <motion.h3
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            40%
          </motion.h3>
          <p>Average clothes unworn in a closet (est. impact)</p>
        </div>
        <div className="stat">
          <motion.h3
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            72%
          </motion.h3>
          <p>Users say AI styling saves them time getting ready</p>
        </div>
      </motion.div>
    </section>
  )
}
