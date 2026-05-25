import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../../utils/scroll'

/** Scroll to top on route change; honor section scroll from nav state. */
const ScrollOnNavigate = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo)
      return
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.state])

  return null
}

export default ScrollOnNavigate
