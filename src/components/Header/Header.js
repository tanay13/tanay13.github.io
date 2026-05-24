import { Link } from 'react-router-dom'
import { header } from '../../portfolio'
import Navbar from '../Navbar/Navbar'
import './Header.css'

const Header = () => {
  const { title } = header

  return (
    <header className='header center'>
      <h3>
        <Link to='/' className='link'>
          {title}
        </Link>
      </h3>
      <Navbar />
    </header>
  )
}

export default Header
