/** @type {import('next').NextConfig} */

const { remarkCodeHike } = require("@code-hike/mdx");
const theme = require("shiki/themes/github-dark.json");

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  // 插件设置
  options: {
    remarkPlugins: [
      [remarkCodeHike, { theme, lineNumbers: false }],
    ],
    rehypePlugins: []
  }
})

module.exports = withMDX({
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx', 'js', 'jsx'],
})
