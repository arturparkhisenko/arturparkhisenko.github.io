module.exports = {
  pathPrefix: '/blog',
  siteMetadata: {
    title: 'RGB',
    author: {
      name: 'Artur Parkhisenko',
      summary: 'Video Playback Experience engineer, ビデオ',
      siteUrl: 'https://arturparkhisenko.github.io/'
    },
    description: 'A personal blog, written by Artur Parkhisenko',
    social: {
      twitter: 'lifeasecond'
    },
    siteUrl: 'https://arturparkhisenko.github.io/',
    feedbackUrl: 'https://forms.gle/fCsxvTqoJsx999m79'
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/blog`,
        name: 'blog'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/assets`,
        name: 'assets'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590
            }
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem'
            }
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_self',
              rel: 'noopener noreferrer'
            }
          },
          {
            resolve: 'gatsby-remark-acronyms',
            options: {
              acronyms: {
                ADs: 'Advertisement',
                API: 'Application Programming Interface',
                CSS: 'Cascading Style Sheets',
                HTML: 'Hyper Text Markup Language',
                MSE: 'Media Source Extensions',
                TIL: 'Today I Learned',
                UI: 'User Interface'
              }
            }
          },
          'gatsby-remark-autolink-headers',
          'gatsby-remark-prismjs', // should be placed after 'gatsby-remark-autolink-headers'
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'RGB Blog',
        short_name: 'RGB',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#002b36',
        display: 'minimal-ui',
        icon: 'content/assets/rgb-icon.png'
      }
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
        omitGoogleFont: true
      }
    },
    'gatsby-plugin-catch-links',
    'gatsby-transformer-sharp',
    'gatsby-plugin-use-dark-mode',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap'
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ]
};
