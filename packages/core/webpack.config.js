const Config = require('webpack-config').default;
var webpack = require('webpack');

module.exports = new Config().extend('@fesk/scripts/webpack').merge({
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        AMZN_S3_IDENTITY_POOL_HASH: JSON.stringify(process.env.AMZN_S3_IDENTITY_POOL_HASH),
        AMZN_S3_REGION: JSON.stringify(process.env.AMZN_S3_REGION),
        AMZN_S3_BUCKET: JSON.stringify(process.env.AMZN_S3_BUCKET),
      },
    }),
  ],
});
