import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import Seo from '../components/seo';

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="404: Not Found" />
      <h1>Not Found</h1>
      <p>
        <span role="img" aria-label="warning">
          ⚠️
        </span>{' '}
        You just hit a route that doesn&#39;t exist...
      </p>
    </Layout>
  );
};

NotFoundPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default NotFoundPage;
