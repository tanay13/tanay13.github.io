import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import RelatedArticles from './RelatedArticles'
import { blogs } from '../../portfolio'
import './BlogPost.css'

import gettingStartedPost from '../../blog/getting-started-web-development'
import fullStackJourneyPost from '../../blog/full-stack-developer-journey'
import chessEngine from '../../blog/chess-engine'
import { formatBlogDate, getRelatedBlogs } from '../../utils/blogs'

const blogPosts = {
  'getting-started-web-development': gettingStartedPost,
  'full-stack-developer-journey': fullStackJourneyPost,
  'chess-engine': chessEngine
}

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const post = blogPosts[slug]

  useEffect(() => {
    const grid = document.getElementById('chess-grid')
    if (!grid) {
      return () => {}
    }

    const BITBOARDS = {
      whitePawns: BigInt('0x000000000000FF00'),
      whiteKnights: BigInt('0x0000000000000042'),
      whiteRooks: BigInt('0x0000000000000081'),
      allWhite: BigInt('0x000000000000FFFF'),
      startpos: BigInt('0xFFFF00000000FFFF'),
    }

    const CAPTIONS = {
      whitePawns: 'White Pawns — 0x000000000000FF00 — all of rank 2 set',
      whiteKnights: 'White Knights — 0x0000000000000042 — b1 and g1',
      whiteRooks: 'White Rooks — 0x0000000000000081 — a1 and h1',
      allWhite: 'All White Pieces — 0x000000000000FFFF — ranks 1 and 2',
      startpos: 'Starting position — ranks 1-2 and 7-8 occupied',
    }

    // Build the 8x8 chess grid
    grid.innerHTML = ''
    for (let rank = 7; rank >= 0; rank -= 1) {
      for (let file = 0; file < 8; file += 1) {
        const sq = rank * 8 + file
        const cell = document.createElement('div')
        cell.classList.add('cell', (rank + file) % 2 === 0 ? 'dark' : 'light')
        cell.id = `sq-${sq}`
        grid.appendChild(cell)
      }
    }

    const captionEl = document.getElementById('board-caption')

    const updateBitboard = (key, btnEl) => {
      const container = btnEl.closest('.board-visual')
      if (container) {
        container.querySelectorAll('.board-btn').forEach((b) => {
          b.classList.remove('active-btn')
        })
      }
      btnEl.classList.add('active-btn')

      const bb = BITBOARDS[key]
      for (let i = 0; i < 64; i += 1) {
        const cell = grid.querySelector(`#sq-${i}`)
        if (cell) {
          cell.classList.remove('active')
          /* eslint-disable-next-line no-bitwise */
          if (bb !== undefined && ((bb >> BigInt(i)) & 1n)) {
            cell.classList.add('active')
          }
        }
      }

      if (captionEl && CAPTIONS[key]) {
        captionEl.textContent = CAPTIONS[key]
      }
    }

    const buttons = document.querySelectorAll('.board-btn')
    const handlers = []

    buttons.forEach((btn) => {
      const key = btn.getAttribute('data-bitboard')
      if (key && BITBOARDS[key] !== undefined) {
        const handler = () => updateBitboard(key, btn)
        btn.addEventListener('click', handler)
        handlers.push({ btn, handler })
      }
    })

    const defaultBtn = document.querySelector('.board-btn[data-bitboard="whitePawns"]')
    if (defaultBtn) {
      updateBitboard('whitePawns', defaultBtn)
    }

    return () => {
      handlers.forEach(({ btn, handler }) => {
        btn.removeEventListener('click', handler)
      })
    }
  }, [post])


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
