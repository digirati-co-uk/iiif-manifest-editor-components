const Config = require('webpack-config').default;
const Dotenv = require('dotenv-webpack');

module.exports = new Config().extend('@fesk/scripts/webpack').merge({});
