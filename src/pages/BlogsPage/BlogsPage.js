import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { blogs } from '../../portfolio'
import { groupBlogsByMonth, formatBlogDate } from '../../utils/blogs'
import './BlogsPage.css'

const BlogEntry = ({ blog }) => {
  const meta = (
    <>
      <span>{formatBlogDate(blog.date)}</span>
      <span aria-hidden="true">·</span>
      <span>{blog.platform}</span>
    </>
  )

  const content = (
    <article className="blogs-page__entry">
      <p className="blogs-page__entry-meta">{meta}</p>
      <h3 className="blogs-page__entry-title">{blog.title}</h3>
      <p className="blogs-page__entry-desc">{blog.description}</p>
      <span className="blogs-page__entry-cta">
        {blog.isExternal ? `Read on ${blog.platform} →` : 'Read article →'}
      </span>
    </article>
  )

  if (blog.isExternal) {
    return (
      <a
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
        className="blogs-page__entry-link"
      >
        {content}
      </a>
    )
  }

  return (
    <Link to={blog.url} className="blogs-page__entry-link">
      {content}
    </Link>
  )
}

const BlogsPage = () => {
  const grouped = groupBlogsByMonth(blogs)

  return (
    <div className="blogs-page">
      <Header />
      <header className="blogs-page__hero">
        <div className="blogs-page__hero-inner">
          <span className="blogs-page__tag">Tanay Raj · Writing</span>
          <h1 className="blogs-page__title">
            The <em>Blog</em>
          </h1>
          <p className="blogs-page__subtitle">
            Notes on systems, software, and whatever I&apos;m learning.
          </p>
        </div>
      </header>

      <main className="blogs-page__main">
        {blogs.length === 0 ? (
          <p className="blogs-page__empty">No posts yet — check back soon.</p>
        ) : (
          grouped.map(([monthLabel, monthBlogs]) => (
            <section key={monthLabel} className="blogs-page__group">
              <h2 className="blogs-page__group-title">{monthLabel}</h2>
              <div className="blogs-page__list">
                {monthBlogs.map((blog) => (
                  <BlogEntry key={blog.url} blog={blog} />
                ))}
              </div>
            </section>
          ))
        )}

        <p className="blogs-page__back">
          <Link to="/" className="blogs-page__back-link">
            ← Back to portfolio
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default BlogsPage
