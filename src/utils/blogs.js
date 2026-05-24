export const sortBlogsByDate = (blogs) =>
  [...blogs].sort((a, b) => new Date(b.date) - new Date(a.date))

export const getFeaturedBlogs = (blogs) =>
  sortBlogsByDate(blogs.filter((blog) => blog.featured))

export const groupBlogsByMonth = (blogs) => {
  const sorted = sortBlogsByDate(blogs)
  const groups = new Map()

  sorted.forEach((blog) => {
    const key = new Date(`${blog.date}T00:00:00`).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(blog)
  })

  return Array.from(groups.entries())
}

export const formatBlogDate = (dateStr) =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export const blogPathFromSlug = (slug) => `/blog/${slug}`

const resolveBlogUrl = (slugOrUrl) =>
  slugOrUrl.startsWith('http') || slugOrUrl.startsWith('/')
    ? slugOrUrl
    : blogPathFromSlug(slugOrUrl)

/** Other posts to show at the bottom of an article. */
export const getRelatedBlogs = (allBlogs, currentSlug, related) => {
  const currentUrl = blogPathFromSlug(currentSlug)

  if (related?.length) {
    return related
      .map((slugOrUrl) =>
        allBlogs.find((blog) => blog.url === resolveBlogUrl(slugOrUrl))
      )
      .filter(Boolean)
  }

  return sortBlogsByDate(allBlogs.filter((blog) => blog.url !== currentUrl))
}
