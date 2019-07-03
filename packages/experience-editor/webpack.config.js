const Config = require('webpack-config').default;
const webpack = require('webpack');

module.exports = new Config().extend('@fesk/scripts/webpack').merge({
  plugins: [
    new webpack.EnvironmentPlugin({
      COLLECTION_SERVER: 'https://iiif-collection.ch.digtest.co.uk/p3/',
      ROOT_MANIFEST_URL: 'https://iiif-collection.ch.digtest.co.uk/p3/',
    }),
  ],
});
