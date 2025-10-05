import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { motion } from 'framer-motion'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import SignUpButton from './SignUpButton'
import Profile from './Profile'

export default function Header() {
  const { isAuthenticated, isLoading } = useAuth0()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate opacity based on scroll (fades from 1 to 0.3 as we scroll)
  const headerOpacity = Math.max(0.3, 1 - scrollY / 300)
  const backgroundOpacity = Math.max(0.2, 0.85 - scrollY / 400)

  return (
    <motion.header 
      className={`app-header ${scrollY > 50 ? 'scrolled' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: `rgba(11, 15, 26, ${backgroundOpacity})`,
      }}
    >
      <motion.div 
        className="header-content"
        animate={{ opacity: headerOpacity }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span className="logo-text">
            Hack<span className="gradient-text">Fashion-AI</span>
          </span>
        </motion.div>

        <div className="auth-section">
          {isLoading ? (
            <div className="auth-loading">
              <div className="spinner-small"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="auth-authenticated">
              <Profile />
              <LogoutButton />
            </div>
          ) : (
            <div className="auth-buttons">
              <LoginButton />
              <SignUpButton />
            </div>
          )}
        </div>
      </motion.div>
    </motion.header>
  )
}
