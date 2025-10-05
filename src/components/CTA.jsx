import React from 'react'
import { motion } from 'framer-motion'

export default function CTA({ onButtonClick }) {
  return (
    <section className="cta-section">
      <motion.div 
        className="cta-content"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Never Wonder what to Wear Again
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Get access and styling tips — powered by AI voice & vision.
        </motion.p>

        <motion.button
          className="cta-button"
          onClick={onButtonClick}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 40px rgba(124, 58, 237, 0.45)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Get Started</span>
          <motion.span 
            className="arrow"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>

        <motion.p 
          className="cta-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Free forever • No credit card required
        </motion.p>
      </motion.div>

      <div className="cta-bg">
        <motion.div 
          className="cta-orb"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  )
}
