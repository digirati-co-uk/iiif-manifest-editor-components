var babelConfig = require('@fesk/babel-config');
module.exports = require('babel-jest').createTransformer(babelConfig());
