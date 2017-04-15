const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = function () {
  const isBuild = process.env.npm_lifecycle_event === 'build';

  const extractSass = new ExtractTextPlugin({
    filename: '[name].[hash].css'
  });

  const config = {};

  config.entry = './src/index.ts';

  config.output = {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  };

  config.module = {
    rules: [{
      test: /\.(scss|css)$/,
      use: extractSass.extract({
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }],
        fallback: 'style-loader'
      })
    }]
    // {
    //   test: /\.ts$/,
    //   exclude: /node_modules/,
    //   loader: 'tslint-loader'
    // }
  };

  config.plugins = [];

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    extractSass,
    new ProgressBarPlugin()
  );

  if (isBuild) {
    config.plugins.push(
      new CleanWebpackPlugin(['dist'])
    );
  }

  if (!isBuild) {
    config.devtool = 'eval-source-map';
  } else {
    config.devtool = 'cheap-module-source-map';
  }

  if (!isBuild) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        },
        __prod: false
      })
    );
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