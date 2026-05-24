import uniqid from 'uniqid'
import { Link } from 'react-router-dom'
import { blogs } from '../../portfolio'
import { getFeaturedBlogs, formatBlogDate } from '../../utils/blogs'
import './Blogs.css'

const Blogs = () => {
  const featured = getFeaturedBlogs(blogs)

  if (!featured.length) return null

  return (
    <section className='section blogs' id='blogs'>
      <h2 className='section__title'>Blogs</h2>
      <div className='blogs__list'>
        {featured.map((blog) => (
          <div key={uniqid()} className='blogs__item'>
            <div className='blogs__content'>
              <div className='blogs__header'>
                <h3 className='blogs__title'>{blog.title}</h3>
                <span className='blogs__date'>{formatBlogDate(blog.date)}</span>
              </div>
              <p className='blogs__description'>{blog.description}</p>
              <div className='blogs__footer'>
                <span className='blogs__platform'>{blog.platform}</span>
                {blog.isExternal ? (
                  <a
                    href={blog.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='blogs__link'
                  >
                    Read on {blog.platform}
                  </a>
                ) : (
                  <Link
                    to={blog.url}
                    className='blogs__link'
                  >
                    Read More
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {blogs.length > featured.length ? (
        <p className='blogs__view-all'>
          <Link to='/blogs' className='blogs__view-all-link'>
            View all posts →
          </Link>
        </p>
      ) : null}
    </section>
  )
}

export default Blogs
