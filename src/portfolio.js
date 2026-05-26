const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: 'https://tanay13.github.io',
  title: 'TR.',
}

const about = {
  // all the properties are optional - can be left empty or deleted
  name: 'Tanay Raj',
  role: 'Backend Developer | Systems Enthusiast',
  // resume:
  // "https://drive.google.com/file/d/1347x14s1SVlKtP6TU5aB_Y-b0HAE2vCY/view?usp=sharing",
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
    name: 'Raven',
    description:
      'A clean, efficient C++ chess engine built from scratch.',
    stack: ['C++', 'Bit Manipulation', 'Algorithms', 'AI'],
    sourceCode: 'https://github.com/tanay13/raven',
  }
]

const blogs = [
  // {
  //   title: 'Getting Started with Web Development',
  //   description:
  //     'A beginner-friendly guide to web development covering HTML, CSS, and JavaScript fundamentals.',
  //   url: '/blog/getting-started-web-development',
  //   date: '2024-01-20',
  //   platform: 'Personal Blog',
  //   isExternal: false,
  //   featured: false,
  // },
  // {
  //   title: 'My Journey as a Full Stack Developer',
  //   description:
  //     'Reflections on learning frontend and backend, the challenges along the way, and advice for aspiring developers.',
  //   url: '/blog/full-stack-developer-journey',
  //   date: '2024-01-18',
  //   platform: 'Personal Blog',
  //   isExternal: false,
  //   featured: false,
  // },
  {
    title: 'Building Raven: Notes from Writing a Chess Engine',
    description:
      'A personal learning log detailing the challenges, bitboards, alpha-beta pruning, move ordering, and transposition tables when building the Raven chess engine from scratch.',
    url: '/blog/chess-engine',
    date: '2025-05-26',
    platform: 'Personal Blog',
    isExternal: false,
    featured: true,
  },
  {
    title: 'Understanding SIMD: Guide to Vectorized Computing',
    description:
      'A guide to SIMD (Single Instruction, Multiple Data) programming for faster computation.',
    url: 'https://baremetalbytes.hashnode.dev/understanding-simd-guide-to-vectorized-computing',
    date: '2025-03-24',
    platform: 'Hashnode',
    isExternal: true,
    featured: true,
  },
]

const contact = {
  // email is optional - if left empty Contact section won't show up
  email: 'tanay.raj76@gmail.com',
}

export { header, about, projects, blogs, contact }
