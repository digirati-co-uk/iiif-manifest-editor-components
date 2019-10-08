module.exports = {
  test: /\.(tsx?)|(js)$/,
  exclude: /(node_modules)/,
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [[require('@fesk/babel-config'), { typescript: true }]],
    },
  },
};
