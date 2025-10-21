import { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeContext } from './contexts/theme'
import Header from './components/Header/Header'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Blogs from './components/Blogs/Blogs'
import BlogPost from './components/BlogPost/BlogPost'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import './App.css'

const App = () => {
  const [{ themeName }] = useContext(ThemeContext)

  const Portfolio = () => (
    <div id='top' className={`${themeName} app`}>
      <Header />
      <main>
        <About />
        <Projects />
        <Blogs />
        <Contact />
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Router>
  )
}

export default App
