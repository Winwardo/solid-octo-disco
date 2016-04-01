const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const extend = require('extend');

const development = process.env.NODE_ENV === 'development';

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
const config = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      }
    ]
  },
  debug: development
};

// Calculate external dependencies for Webpack. Webpack searches for these
// packages in the node_modules instead of packing them into the bundle.
const nodeModules = {};
fs.readdirSync('node_modules')
  .forEach(function(mod) {
    if (mod !== '.bin') {
      nodeModules[mod] = 'commonjs ' + mod;
    }
  });

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------
const serverConfig = extend(true, {}, config, {
  entry: './src/server/server.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js',
  },
  node: {
    __dirname: true,
    __filename: true,
  },
  externals: [nodeModules, {
    '../../webpack.config.js': 'commonjs ' + require.resolve(__filename)
  }]
});

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------
const clientConfig = extend(true, {}, config, {
  devtool: 'eval',
  entry: development ? [
    'eventsource-polyfill', // necessary evil for hot loading with IE
    'webpack-hot-middleware/client',
    './src/client/index.js'
  ] :
  './src/client/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  plugins: development ? [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        screw_ie8: true,

          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        warnings: false,
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ]
});

module.exports = [serverConfig, clientConfig];
