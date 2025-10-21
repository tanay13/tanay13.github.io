const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: 'https://tanay13.github.io',
  title: 'TR.',
}

const about = {
  // all the properties are optional - can be left empty or deleted
  name: 'Tanay Raj',
  role: 'Backend Developer | Systems Enthusiast',
  resume:
    'https://drive.google.com/file/d/1nThWhmMHJQC9VvTW9dOjjYUZd9zGyuqI/view?usp=sharing',
  social: {
    linkedin: 'https://linkedin.com/in/tanay-raj',
    github: 'https://github.com/tanay13',
    twitter: 'https://twitter.com/tanayhere',
  },
}

const projects = [
  {
    name: 'Glitch Mesh',
    description:
      'Lightweight, developer-focused proxy tool designed for testing microservice resilience.',
    stack: ['Golang', 'YAML', 'Networking'],
    sourceCode: 'https://github.com/tanay13/GlitchMesh',
  },
  {
    name: 'Codetropy',
    description:
      'A set of microservices for watching over a project in order to avoid plagiarism by copying huge chunks of codes in any short format coding competition/hackathons.Comprises of 3 components:- npm package, codetropy-server and codetropy-dashboard',
    stack: ['React', 'Typescript', 'Redis'],
    sourceCode: 'https://github.com/tanay13/codetropy',
  },
  {
    name: 'Synced-up',
    description:
      ' A platform to watch youtube or custom uploaded videos in sync with others. Feature to create a room and invite others in to enjoy waatching videos together without any disturbance.',
    stack: ['NodeJs', 'MongoDB', 'Socket Programming'],
    sourceCode: 'https://github.com/tanay13/synced-up',
  }
]

const blogs = [

  // {
  //   title: 'Getting Started with Web Development',
  //   description: 'A beginner-friendly guide to web development covering HTML, CSS, and JavaScript fundamentals.',
  //   url: '/blog/getting-started-web-development',
  //   date: '2024-01-20',
  //   platform: 'Personal Blog',
  //   isExternal: false
  // },
  {
    title: 'Understanding SIMD: Guide to Vectorized Computing',
    description: 'A guide to SIMD (Single Instruction, Multiple Data) programming for faster computation.',
    url: 'https://baremetalbytes.hashnode.dev/understanding-simd-guide-to-vectorized-computing',
    date: '2024-03-04',
    platform: 'Hashnode',
    isExternal: true
  },
]

const contact = {
  // email is optional - if left empty Contact section won't show up
  email: 'tanay.raj76@gmail.com',
}

export { header, about, projects, blogs, contact }
