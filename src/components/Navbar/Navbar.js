import { useContext, useState } from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { ThemeContext } from '../../contexts/theme'
import { projects, blogs, contact } from '../../portfolio'
import './Navbar.css'

const Navbar = () => {
  const [{ themeName }] = useContext(ThemeContext)
  const [showNavList, setShowNavList] = useState(false)

  const toggleNavList = () => setShowNavList(!showNavList)

  return (
    <nav className='center nav'>
      <ul
        style={{ display: showNavList ? 'flex' : null }}
        className='nav__list'
      >
        {projects.length ? (
          <li className='nav__list-item'>
            <a
              href='#projects'
              onClick={toggleNavList}
              className='link link--nav'
            >
              Projects
            </a>
          </li>
        ) : null}

        {blogs.length ? (
          <li className='nav__list-item'>
            <a
              href='#blogs'
              onClick={toggleNavList}
              className='link link--nav'
            >
              Blogs
            </a>
          </li>
        ) : null}

        {contact.email ? (
          <li className='nav__list-item'>
            <a
              href='#contact'
              onClick={toggleNavList}
              className='link link--nav'
            >
              Contact
            </a>
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
