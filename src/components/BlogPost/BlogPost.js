import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import RelatedArticles from './RelatedArticles'
import { blogs } from '../../portfolio'
import './BlogPost.css'

import gettingStartedPost from '../../blog/getting-started-web-development'
import fullStackJourneyPost from '../../blog/full-stack-developer-journey'
import { formatBlogDate, getRelatedBlogs } from '../../utils/blogs'

const blogPosts = {
  'getting-started-web-development': gettingStartedPost,
  'full-stack-developer-journey': fullStackJourneyPost,
}

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const post = blogPosts[slug]

  if (!post) {
    return (
      <div className="blog-post">
        <Header />
        <div className="blog-post-not-found">
          <h1>Post not found</h1>
          <p>The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link to="/blogs" className="btn btn--outline">
            Back to blog
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const tagLabel = post.tags?.slice(0, 2).join(' · ') || 'Article'
  const relatedArticles = getRelatedBlogs(blogs, slug, post.related)

  return (
    <div className="blog-post">
      <Header />

      <header className="blog-post__hero">
        <div className="blog-post__hero-inner">
          <span className="blog-post__tag">{tagLabel}</span>
          <h1 className="blog-post__title">{post.title}</h1>
          <p className="blog-post__meta">
            by {post.author} · {formatBlogDate(post.date)} · {post.readTime}
          </p>
        </div>
      </header>

      <div className="blog-post__container">
        <article className="blog-post__content">
          <div
            className="blog-post__body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <footer className="blog-post__footer">
          {post.tags?.length ? (
            <div className="blog-post__tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-post__tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => navigate('/blogs')}
            className="blog-post__back-btn"
          >
            ← All posts
          </button>
        </footer>

        <RelatedArticles articles={relatedArticles} />
      </div>

      <Footer />
    </div>
  )
}

export default BlogPost
