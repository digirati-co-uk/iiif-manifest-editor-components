const sass = require('@fesk/webpack-config/lib/loaders/sass');
const miniCss = require('@fesk/webpack-config/lib/plugins/mini-css');

const merge = require('webpack-merge');
const feskPackConfig = require('./webpack.config');

module.exports = {
  title: 'IIIF-MEC/experience-editor',
  description: 'IIIF Experience editor',
  dest: './dist/docs',
  // debug: true,
  port: 5001,
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
    return config; //merge(feskPackConfig, config);
  },
};
