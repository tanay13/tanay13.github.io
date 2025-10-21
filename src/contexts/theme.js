import { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light')

  // Force light theme for a consistent minimal style
  useEffect(() => {
    setThemeName('light')
  }, [])

  const toggleTheme = () => {
    // No-op to keep light theme; maintained for context API shape compatibility
    setThemeName('light')
  }

  return (
    <ThemeContext.Provider value={[{ themeName, toggleTheme }]}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { ThemeProvider, ThemeContext }
