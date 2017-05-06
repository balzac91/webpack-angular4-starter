const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = function () {
  const isBuild = process.env.npm_lifecycle_event === 'build';

  const extractSass = new ExtractTextPlugin({
    filename: 'styles.[hash].css'
  });

  const config = {};

  /**
   * entry
   */
  config.entry = './src/index.ts';

  /**
   * output
   */
  config.output = {
    filename: 'app.[hash].js',
    path: path.resolve(__dirname, 'dist')
  };

  /**
   * module
   */
  config.module = {
    rules: [{
      test: /\.(scss|css)$/,
      use: extractSass.extract({
        use: [{
          loader: 'css-loader', options: {
            sourceMap: !isBuild
          }
        }, {
          loader: 'sass-loader', options: {
            sourceMap: !isBuild
          }
        }],
        fallback: 'style-loader'
      })
    }, {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: 'images/[name].[hash].[ext]'
      }
    }, {
      test: /\.(woff|woff2|ttf|eot)$/,
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[hash].[ext]'
      }
    }, {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        minimize: false
      }
    }]
    // {
    //   test: /\.ts$/,
    //   exclude: /node_modules/,
    //   loader: 'tslint-loader'
    // }
  };

  /**
   * plugins
   */
  config.plugins = [];

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    extractSass,
    new ProgressBarPlugin(),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    })//,
    // new StyleLintPlugin({
    //   context: path.join(__dirname, 'src')
    // })
  );

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

  if (isBuild) {
    config.plugins.push(
      new CleanWebpackPlugin(['dist'])
    );
  }

  /**
   * devtool
   */
  if (!isBuild) {
    config.devtool = 'inline-source-map';
  }

  /**
   * resolve
   */
  config.resolve = {
    alias: {
      styles: path.resolve('src/styles'),
      assets: path.resolve('src/assets')
    }
  };

  /**
   * devServer
   */
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