const sass = require('@fesk/webpack-config/lib/loaders/sass');
const miniCss = require('@fesk/webpack-config/lib/plugins/mini-css');

const merge = require('webpack-merge');
const feskPackConfig = require('./webpack.config');

module.exports = {
  title: 'IIIF-MEC/core',
  description: 'IIIF Manifest Editor Core Components',
  files: '**/*.mdx',
  src: './src/',
  dest: './dist/docs',
  base: '/',
  debug: true,
  port: 5001,
  protocol: 'http',
  menu: [
    '00. index',
    '01. Simple Editor UI',
    {
      name: '02. Configuration',
      menu: [
        '01. Editor Context',
        '02. Image Painting',
        '03. Text Painting',
        '04. Video Painting',
        '05. Audio Painting',
      ],
    },
    '02. High Level Components',
    '03. Components',
    '04. Reducers',
    '05. Layout',
    '06. Implementations'
  ],
  wrapper: undefined,
  themeConfig: {
    styles: {
      container: {
        width: ['100%', '100%', '100%'],
      },
    },
  },
  modifyBabelRc: config => {
    config.babelrc = false
    return config
  },
  modifyBundlerConfig: config => {
    config.module.rules.push(sass);
    config.plugins.push(miniCss);

    // const cfg = merge(feskPackConfig, config);
    console.log(config.entry);
    return config; //merge(feskPackConfig, config);
  },
};
