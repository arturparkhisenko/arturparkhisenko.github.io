const fs = require('fs-extra');
const kebabCase = require('lodash.kebabcase');
const { createFilePath } = require('gatsby-source-filesystem');
const path = require('path');

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`);
  const tagTemplate = path.resolve('src/templates/tags.js');

  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 2000) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              tags
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  // Create blog posts pages.
  const posts = result.data.postsRemark.edges;

  // Create post detail pages
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: post.node.fields.slug,
      component: blogPostTemplate,
      context: {
        slug: post.node.fields.slug,
        previous,
        next
      }
    });
  });

  // Extract tag data from query
  const tags = result.data.tagsGroup.group;

  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue
      }
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    createNodeField({
      name: `slug`,
      node,
      value: createFilePath({ node, getNode })
    });
  }
};

exports.onPostBuild = () => {
  return Promise.resolve()
    .then(() => {
      console.log('[Post Build] Cleanup dist');
      return fs.emptyDir('../blog/');
    })
    .then(() => {
      console.log('[Post Build] Copy dist');
      return fs.copy('./public/', '../blog/');
    })
    .catch(error => {
      console.error('[Post Build] error:', error);
    });
};
