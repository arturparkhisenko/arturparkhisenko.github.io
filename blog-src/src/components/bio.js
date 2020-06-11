/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import PropTypes from 'prop-types';
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

import { rhythm } from '../utils/typography';

const Bio = ({ mode }) => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(
        absolutePath: { regex: "/profile-pic-artur-parkhisenko.png/" }
      ) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
            siteUrl
          }
        }
      }
    }
  `);

  const { author } = data.site.siteMetadata;
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(1)
      }}
    >
      <br />
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author.name}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`
        }}
        imgStyle={{
          borderRadius: `50%`
        }}
      />
      <p>
        {mode === 'full' ? 'A personal blog, written by ' : 'Written by '}
        <a href={author.siteUrl}>
          <strong>{author.name}</strong>
        </a>
        <br />
        <small>{author.summary}</small>
      </p>
    </div>
  );
};

Bio.defaultProps = {
  mode: 'full' // The possible values are: 'full', 'short'
};

Bio.propTypes = {
  mode: PropTypes.string
};

export default Bio;
