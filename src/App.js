import { useContext } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollOnNavigate from './components/ScrollToTop/ScrollOnNavigate'
import { ThemeContext } from './contexts/theme'
import Header from './components/Header/Header'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Blogs from './components/Blogs/Blogs'
import BlogPost from './components/BlogPost/BlogPost'
import BlogsPage from './pages/BlogsPage/BlogsPage'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import './App.css'

const App = () => {
  const [{ themeName }] = useContext(ThemeContext)

  const Portfolio = () => (
    <>
      <Header />
      <main>
        <About />
        <Projects />
        <Blogs />
        <Contact />
      </main>
      <ScrollToTop />
      <Footer />
    </>
  )

  return (
    <Router>
      <ScrollOnNavigate />
      <div id='top' className={`${themeName} app`}>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
