# Blog Functionality

This portfolio now includes a minimal blog section that supports both external blog links and local blog posts.

## Features

- **Minimal Design**: Clean, list-based layout that's easy to read
- **Mixed Content**: Support for both external blog links and local blog posts
- **Responsive**: Works well on desktop and mobile devices
- **Easy Management**: Simple configuration through `portfolio.js`

## Adding Blog Posts

### External Blog Posts
Add external blog posts to the `blogs` array in `src/portfolio.js`:

```javascript
{
  title: 'Your Blog Title',
  description: 'Brief description of your blog post',
  url: 'https://your-blog-url.com',
  date: '2024-01-20',
  platform: 'Medium', // or Dev.to, Hashnode, etc.
  isExternal: true
}
```

### Local Blog Posts
Add local blog posts to the `blogs` array in `src/portfolio.js`:

```javascript
{
  title: 'Your Local Blog Title',
  description: 'Brief description of your blog post',
  url: '/blog/your-blog-slug',
  date: '2024-01-20',
  platform: 'Personal Blog',
  isExternal: false
}
```

Then create the blog post file at `src/blog/your-blog-slug.js`:

```javascript
export const blogPost = {
  title: 'Your Local Blog Title',
  date: '2024-01-20',
  author: 'Your Name',
  content: `
    <h2>Introduction</h2>
    <p>Your blog content here...</p>
    
    <h2>Section Title</h2>
    <p>More content...</p>
  `,
  tags: ['tag1', 'tag2', 'tag3'],
  readTime: '5 min read'
}

export default blogPost
```

## File Structure

```
src/
├── blog/
│   ├── getting-started-web-development.js
│   └── full-stack-developer-journey.js
├── components/
│   ├── Blogs/
│   │   ├── Blogs.js
│   │   └── Blogs.css
│   └── BlogPost/
│       ├── BlogPost.js
│       └── BlogPost.css
└── portfolio.js
```

## Styling

The blog section uses a minimal design with:
- Clean typography
- Subtle hover effects
- Responsive layout
- Consistent with the overall portfolio theme

## Routing

- Portfolio homepage: `/`
- Individual blog posts: `/blog/:slug`

The routing is handled by React Router, so local blog posts will navigate within the app while external links open in new tabs.
