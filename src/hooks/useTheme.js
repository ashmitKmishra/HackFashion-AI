import { useState, useEffect } from 'react'

// Simple theme hook for future use — toggles between "dark" and "vibe" palettes
export default function useTheme() {
  const [theme, setTheme] = useState('vibe')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'vibe' ? 'dark' : 'vibe'))

  return { theme, toggle, setTheme }
}
