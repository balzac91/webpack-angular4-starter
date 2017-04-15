const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = function () {
  const isBuild = process.env.npm_lifecycle_event === 'build';

  const config = {};

  config.entry = './src/index.js';

  config.output = {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  };

  config.plugins = [];

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new ProgressBarPlugin()
  );


  if (!isBuild) {
    config.devtool = 'eval-source-map';
  } else {
    config.devtool = 'cheap-module-source-map';
  }

  if (!isBuild) {
    config.devServer = {
      contentBase: path.join(__dirname, 'src'),
      historyApiFallback: true,
      port: 8080,
      inline: true,
      stats: 'minimal'
    };
  }

  return config;
};