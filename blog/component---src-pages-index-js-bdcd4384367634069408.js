"use strict";(self.webpackChunkrgb=self.webpackChunkrgb||[]).push([[678],{9535:function(e,t,l){var a=l(7294),r=l(5444),n=l(2359),m=l(5713);const i=({mode:e})=>{const t=(0,r.useStaticQuery)("3952472842"),{author:l}=t.site.siteMetadata;return a.createElement("div",{style:{display:"flex",marginBottom:(0,m.qZ)(1)}},a.createElement("br",null),a.createElement(n.G,{image:t.avatar.childImageSharp.gatsbyImageData,alt:l.name,style:{marginRight:(0,m.qZ)(.5),marginBottom:0,minWidth:50,borderRadius:"100%"},imgStyle:{borderRadius:"50%"}}),a.createElement("p",null,"full"===e?"A personal blog, written by ":"Written by ",a.createElement("a",{href:l.siteUrl},a.createElement("strong",null,l.name)),a.createElement("br",null),a.createElement("small",null,l.summary)))};i.defaultProps={mode:"full"},t.Z=i},7704:function(e,t,l){l.r(t);var a=l(7294),r=l(5444),n=l(9535),m=l(1099),i=l(6179),s=l(5713);t.default=({data:e,location:t})=>{const l=e.site.siteMetadata.title,o=e.allMarkdownRemark.edges;return a.createElement(m.Z,{feedbackUrl:e.site.siteMetadata.feedbackUrl,location:t,title:l},a.createElement(i.Z,{title:"All posts"}),a.createElement(n.Z,null),o.map((({node:e})=>{const t=e.frontmatter.title||e.fields.slug;return a.createElement("article",{key:e.fields.slug},a.createElement("header",null,a.createElement("h2",{style:{marginBottom:(0,s.qZ)(1/4)}},a.createElement(r.Link,{style:{boxShadow:"none"},to:e.fields.slug},t)),a.createElement("small",null,e.frontmatter.date," · ⏳",e.fields.readingTime.text)),a.createElement("section",null,a.createElement("p",{dangerouslySetInnerHTML:{__html:e.frontmatter.description||e.excerpt}})))})))}}}]);
//# sourceMappingURL=component---src-pages-index-js-bdcd4384367634069408.js.map