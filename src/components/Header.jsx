import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { motion } from 'framer-motion'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import SignUpButton from './SignUpButton'
import Profile from './Profile'

export default function Header() {
  const { isAuthenticated, isLoading } = useAuth0()

  return (
    <motion.header 
      className="app-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <span className="logo-text">
            Hack<span className="gradient-text">Fashion</span>
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
      </div>
    </motion.header>
  )
}
