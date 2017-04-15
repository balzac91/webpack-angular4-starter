var path = require('path');

module.exports = function () {
  var config = {};

  config.entry = './src/index.js';

  config.output = {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  };

  return config;
};