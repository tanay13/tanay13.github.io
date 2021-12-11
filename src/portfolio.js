const header = {
  // all the properties are optional - can be left empty or deleted
  homepage: 'https://tanay13.github.io',
  title: 'TR.',
}

const about = {
  // all the properties are optional - can be left empty or deleted
  name: 'Tanay Raj',
  role: 'Full Stack Developer | Backend Developer',
  resume:
    'https://drive.google.com/file/d/17lK4hMb7uUPEfOyGK5mmwyRPqCL6QJ7m/view?usp=sharing',
  social: {
    linkedin: 'https://linkedin.com/in/tanay-raj',
    github: 'https://github.com/tanay13',
    twitter: 'https://twitter.com/tanayhere',
  },
}

const projects = [
  // projects can be added an removed
  // if there are no projects, Projects section won't show up
  {
    name: 'Synced-up',
    description:
      ' A platform to watch youtube or custom uploaded videos in sync with others. Feature to create a room and invite others in to enjoy waatching videos together without any disturbance.',
    stack: ['NodeJs', 'MongoDB', 'Socket.io', 'Youtube API'],
    sourceCode: 'https://github.com/tanay13/synced-up',
  },
  {
    name: 'Github-Notifier',
    description:
      ' Chrome extension for open source enthusiasts.Get notified when any new issues or PR is opened in the specified repositories.',
    stack: ['Javascript', 'Chrome Storage API', 'Github API'],
    sourceCode: 'https://github.com/tanay13/github-notifier',
  },
  {
    name: 'DoorBot',
    description:
      ' A platform for local service providers to list their shop or whatever service they provide. It provides an opportunity for the local service providers to work even during the pandemic.',
    stack: ['NodeJS', 'REST API', 'HTML', 'CSS', 'PassportJS'],
    sourceCode: 'https://github.com/tanay13/door-bot',
  },
  {
    name: 'Token Farm',
    description:
      ' A Decentralized Dummy Finance Application. Built on local Ethereum network which return Dapp Tokens in return of Dai tokens.',
    stack: ['Solidity', 'Javascript', 'Etheruem', 'Ganache', 'truffle'],
    sourceCode: 'https://github.com/tanay13/token-farm',
  },
]

const skills = [
  // skills can be added or removed
  // if there are no skills, Skills section won't show up
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'GraphQL',
  'MongoDB',
  'Postgres',
  'Material UI',
  'Git',
  'Docker',
]

const contact = {
  // email is optional - if left empty Contact section won't show up
  email: 'tanay.raj76@gmail.com',
}

export { header, about, projects, skills, contact }
