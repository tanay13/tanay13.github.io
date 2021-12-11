import GitHubIcon from '@material-ui/icons/GitHub'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import TwitterIcon from '@material-ui/icons/Twitter'
import { about } from '../../portfolio'
import './About.css'

const About = () => {
  const { name, role, description, resume, social } = about

  return (
    <div className='about center'>
      {name && (
        <h1>
          Hi, I am <span className='about__name'>{name}.</span>
        </h1>
      )}

      {role && <h2 className='about__role'>A {role}.</h2>}
      <p className='about__desc'>
        Hi, I am Tanay !
        <p>
          {' '}
          I am a computer science undergraduate from VIT, Vellore. I am a self
          taught developer, and like solving real world issues through my work.
          I started exploring web development in my first year of college and
          since then my love for the field is growing day by day. I am a Full
          Stack developer and currently exploring DevOps. I love working with
          the APIs and mostly prefer to work as a backend developer . I often
          try to contribute to open source projects as well, I have made my
          contributions in many projects and worked on technologies like
          TypeScript, NestJS,NodeJS etc. Apart from this I am an ardent chess
          lover and can be often found on{' '}
          <a href='https://www.chess.com/'>Chess.com</a>
        </p>
      </p>

      <div className='about__contact center'>
        {resume && (
          <a href={resume} target='_blank' rel='noreferrer'>
            <span type='button' className='btn btn--outline'>
              Resume
            </span>
          </a>
        )}

        {social && (
          <>
            {social.github && (
              <a
                href={social.github}
                aria-label='github'
                className='link link--icon'
              >
                <GitHubIcon />
              </a>
            )}

            {social.linkedin && (
              <a
                href={social.linkedin}
                aria-label='linkedin'
                className='link link--icon'
              >
                <LinkedInIcon />
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                aria-label='twitter'
                className='link link--icon'
              >
                <TwitterIcon />
              </a>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default About
