
const { remarkCodeHike } = require("@code-hike/mdx");
const withPlugins = require('next-compose-plugins');
// https://www.npmjs.com/package/next-plugin-antd-less
const withAntdLess = require('next-plugin-antd-less');
const theme = require("shiki/themes/github-dark.json");

const { INIT_ENV } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    INIT_ENV,
  },
}

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

module.exports = withPlugins([
  [withAntdLess, {
    // antd 变量配置：https://ant.design/docs/react/customize-theme-cn#Ant-Design-%E7%9A%84%E6%A0%B7%E5%BC%8F%E5%8F%98%E9%87%8F
    modifyVars: { '@primary-color': '#025eff' },
    // optional
    lessVarsFilePath: './src/styles/variables.less',
    // optional
    lessVarsFilePathAppendToEndOfContent: false,
    // optional https://github.com/webpack-contrib/css-loader#object
    cssLoaderOptions: {},
  }],
], withMDX({
  ...nextConfig,
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx', 'js', 'jsx'],
}));
