const path = require('path');
var fs = require('fs');
const webpack = require('webpack');
const extend = require('extend');

const production = process.env.NODE_ENV === 'production' ? false : true;

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
const config = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      }
    ],
  },
  debug: production,
  resolve: {
    'extensions': ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
}

// Calculate external dependencies for Webpack. Webpack searches for these
// packages in the node_modules instead of packing them into the bundle.
var nodeModules = {};
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
  externals: nodeModules,
  plugins: [],
});

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------
const clientConfig = extend(true, {}, config, {
  entry: './src/client/index.js' ,
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  plugins: production ? [
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
    ] : []
});

module.exports = [ serverConfig, clientConfig ];