'use strict';

const webpack = require('webpack');
const path = require('path');
const env = require('./env');
const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'production');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV,
      REGION: JSON.stringify(env.REGION),
      BUCKET_NAME: JSON.stringify(env.BUCKET_NAME)
    }
  })
];

if (NODE_ENV === JSON.stringify('production')) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: [
          'THREE'
        ]
      },
      compress: {
        warnings: false,
        screw_ie8: true
      }
    })
  );
}

module.exports = {
  entry: {
    bundle: path.join(__dirname, './client/js/app.js'),
    viewer: path.join(__dirname, './client/js/viewer/index.js')
  },
  output: {
    path: path.join(__dirname, './dist/'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          comments: false
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.js' ],
    modules: [
      path.resolve(__dirname),
      path.join(__dirname, './client/js'),
      path.join(__dirname, './node_modules')
    ]
  },
  plugins
}
