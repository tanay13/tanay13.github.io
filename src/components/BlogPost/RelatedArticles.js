import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { formatBlogDate } from '../../utils/blogs'
import './RelatedArticles.css'

const RelatedArticleLink = ({ blog }) => {
  const inner = (
    <>
      <p className="related-articles__meta">
        {formatBlogDate(blog.date)} · {blog.platform}
      </p>
      <h3 className="related-articles__title">{blog.title}</h3>
      <p className="related-articles__desc">{blog.description}</p>
      <span className="related-articles__cta">
        {blog.isExternal ? `Read on ${blog.platform} →` : 'Read article →'}
      </span>
    </>
  )

  if (blog.isExternal) {
    return (
      <a
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
        className="related-articles__link"
      >
        {inner}
      </a>
    )
  }

  return (
    <Link to={blog.url} className="related-articles__link">
      {inner}
    </Link>
  )
}

RelatedArticleLink.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    isExternal: PropTypes.bool,
  }).isRequired,
}

const RelatedArticles = ({ articles }) => {
  if (!articles.length) return null

  return (
    <aside className="related-articles">
      <h2 className="related-articles__heading">More to read</h2>
      <div className="related-articles__list">
        {articles.map((blog) => (
          <RelatedArticleLink key={blog.url} blog={blog} />
        ))}
      </div>
    </aside>
  )
}

RelatedArticles.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      isExternal: PropTypes.bool,
    })
  ).isRequired,
}

export default RelatedArticles
