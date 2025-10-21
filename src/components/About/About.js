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
      <div className='about__desc'>
        <p>
          I&apos;m a computer scientist who loves diving into the fundamentals: <b>systems</b>, <b>data</b>, and the <b>math</b> that ties them together.
        </p>
        <p>
          I care more about understanding how things work than stacking frameworks, and I&apos;m currently exploring the world of <b>distributed systems</b>, <b>databases</b>, and the ideas that shape them.
        </p>
        <p>
          Apart from this, I am an ardent chess lover and can be often found on{' '}
          <a className='about__link' href='https://www.chess.com/' target='_blank' rel='noreferrer'>Chess.com</a>.
        </p>
      </div>

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
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
              </a>
            )}

            {social.linkedin && (
              <a
                href={social.linkedin}
                aria-label='linkedin'
                className='link link--icon'
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                aria-label='twitter'
                className='link link--icon'
                target="_blank"
                rel="noopener noreferrer"
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
