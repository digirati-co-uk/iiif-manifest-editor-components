const path = require('path');
const SRC_PATH = path.join(__dirname, '../src');

module.exports = ({ config }) => {
  config.module.rules.push(
    {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      include: [SRC_PATH],
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [[require('@fesk/babel-config')]],
          },
        },
      ],
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    }
  );
  config.resolve.extensions.push('.jss', '.jsx', '.scss');
  return config;
};
