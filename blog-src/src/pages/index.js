import PropTypes from 'prop-types';
import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import Seo from '../components/seo';
import { rhythm } from '../utils/typography';

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout
      feedbackUrl={data.site.siteMetadata.feedbackUrl}
      location={location}
      title={siteTitle}
    >
      <Seo title="All posts" />
      <Bio />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug;
        return (
          <article key={node.fields.slug}>
            <header>
              <h2
                style={{
                  marginBottom: rhythm(1 / 4)
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h2>
              <small>
                {node.frontmatter.date}
                {' · ⏳'}
                {node.fields.readingTime.text}
              </small>
            </header>
            <section>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt
                }}
              />
            </section>
          </article>
        );
      })}
    </Layout>
  );
};

BlogIndex.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        feedbackUrl
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
            readingTime {
              text
            }
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;

export default BlogIndex;
