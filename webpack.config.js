var path = require('path');
var webpack = require('webpack');

var production = process.env.NODE_ENV == 'production';

var entry = production ? [
  './index',
] : [
  'webpack-hot-middleware/client',
  './index',
];

var plugins = production ? [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin(),
] : [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
];

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  plugins: plugins,
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
