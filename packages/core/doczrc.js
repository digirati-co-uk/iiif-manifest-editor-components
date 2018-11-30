const sass = require('@fesk/webpack-config/lib/loaders/sass');
const miniCss = require('@fesk/webpack-config/lib/plugins/mini-css');

module.exports = {
  title: 'IIIF-MEC/core',
  description: 'IIIF Manifest Editor Core Components',
  src: './src/',
  dest: './dist/docs',
  base: '/',
  debug: false,
  port: 5001,
  protocol: 'http',
  themeConfig: {
    styles: {
      container: {
        width: ['100%', '100%', '100%'],
      },
    },
  },
  modifyBundlerConfig: config => {
    config.module.rules.push(sass);
    config.plugins.push(miniCss);
    return config;
  },
};
