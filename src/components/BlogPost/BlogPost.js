import { useParams, useNavigate } from 'react-router-dom'
import './BlogPost.css'

// Import blog posts
import gettingStartedPost from '../../blog/getting-started-web-development'
import fullStackJourneyPost from '../../blog/full-stack-developer-journey'

const blogPosts = {
  'getting-started-web-development': gettingStartedPost,
  'full-stack-developer-journey': fullStackJourneyPost
}

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const post = blogPosts[slug]
  
  if (!post) {
    return (
      <div className="blog-post-not-found">
        <h1>Blog Post Not Found</h1>
        <p>The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <button type="button" onClick={() => navigate('/')} className="btn btn--outline">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="blog-post">
      <div className="blog-post__container">
        <button 
          type="button"
          onClick={() => navigate('/')} 
          className="blog-post__back-btn"
        >
          ← Back to Portfolio
        </button>
        
        <article className="blog-post__content">
          <header className="blog-post__header">
            <h1 className="blog-post__title">{post.title}</h1>
            <div className="blog-post__meta">
              <span className="blog-post__author">By {post.author}</span>
              <span className="blog-post__date">{post.date}</span>
              <span className="blog-post__read-time">{post.readTime}</span>
            </div>
            <div className="blog-post__tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-post__tag">{tag}</span>
              ))}
            </div>
          </header>
          
          <div 
            className="blog-post__body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  )
}

export default BlogPost
