import React, { useEffect, useState } from 'react'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import { scrollToTop } from '../../utils/scroll'
import './ScrollToTop.css'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () =>
      window.pageYOffset > 500 ? setIsVisible(true) : setIsVisible(false)

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return isVisible ? (
    <div className='scroll-top'>
      <button
        type='button'
        onClick={scrollToTop}
        className='btn btn--icon scroll-top__btn'
        aria-label='scroll to top'
      >
        <ArrowUpwardIcon fontSize='large' />
      </button>
    </div>
  ) : null
}

export default ScrollToTop
