var path = require('path');
var webpack = require('webpack');

var env = process.env.NODE_ENV || 'development';

module.exports = {
  entry: [
    './index',
    ...(env === 'production' ? [] : ['webpack-hot-middleware/client']),
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    ...(env === 'production' ? [
      new webpack.optimize.UglifyJsPlugin(),
    ] : [
      new webpack.NoErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ]),
  ],
  resolve: {
    extensions: [
      '',
      '.jsx',
      '.js',
    ],
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['babel-loader'],
        include: __dirname,
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
        include: __dirname,
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
};
