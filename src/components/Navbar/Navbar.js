import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { projects, blogs, contact } from '../../portfolio'
import { scrollToSection } from '../../utils/scroll'
import './Navbar.css'

const Navbar = () => {
  const [showNavList, setShowNavList] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleNavList = () => setShowNavList(!showNavList)

  const goToSection = (sectionId) => {
    toggleNavList()
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } })
      return
    }
    scrollToSection(sectionId)
  }

  return (
    <nav className='center nav'>
      <ul
        style={{ display: showNavList ? 'flex' : null }}
        className='nav__list'
      >
        {projects.length ? (
          <li className='nav__list-item'>
            <button
              type='button'
              onClick={() => goToSection('projects')}
              className='link link--nav nav__section-btn'
            >
              Projects
            </button>
          </li>
        ) : null}

        {blogs.length ? (
          <li className='nav__list-item'>
            <Link
              to='/blogs'
              onClick={toggleNavList}
              className='link link--nav'
            >
              Blogs
            </Link>
          </li>
        ) : null}

        {contact.email ? (
          <li className='nav__list-item'>
            <button
              type='button'
              onClick={() => goToSection('contact')}
              className='link link--nav nav__section-btn'
            >
              Contact
            </button>
          </li>
        ) : null}
      </ul>

      {/* theme toggle removed for minimal light-only theme */}

      <button
        type='button'
        onClick={toggleNavList}
        className='btn btn--icon nav__hamburger'
        aria-label='toggle navigation'
      >
        {showNavList ? <CloseIcon /> : <MenuIcon />}
      </button>
    </nav>
  )
}

export default Navbar
