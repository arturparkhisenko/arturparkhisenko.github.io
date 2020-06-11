import { Link } from 'gatsby';
import { ThemeToggler } from 'gatsby-plugin-dark-mode';
import PropTypes from 'prop-types';
import React from 'react';

import { Logo } from './logo';
import { Toggler } from './toggler';
import { rhythm } from '../utils/typography';

import './layout.css';

const Layout = ({ children, feedbackUrl, location, title }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  let header = (
    <Link style={{ boxShadow: `none`, color: `inherit` }} to={`/`}>
      <Logo title={title} />
    </Link>
  );

  if (location.pathname === rootPath) {
    header = <h1 style={{ marginBottom: rhythm(1.2) }}>{header}</h1>;
  } else {
    header = <h3 style={{ marginBottom: rhythm(0.5) }}>{header}</h3>;
  }

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
      }}
    >
      <header
        style={{
          alignItems: `flex-start`,
          display: `flex`,
          justifyContent: `space-between`
        }}
      >
        {header}
        <ThemeToggler>{Toggler}</ThemeToggler>
      </header>
      <main>{children}</main>
      <footer style={{ opacity: 0.8 }}>
        <small>
          <a href={feedbackUrl} rel="noopener noreferrer" target="_blank">
            <span aria-label="Feedback" role="img">
              📝
            </span>{' '}
            Give feedback
          </a>
          <div>
            © {new Date().getFullYear()}, Built with{' '}
            <a href="https://www.gatsbyjs.org">Gatsby</a>
          </div>
        </small>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  feedbackUrl: PropTypes.string,
  location: PropTypes.object,
  title: PropTypes.string
};

export default Layout;
