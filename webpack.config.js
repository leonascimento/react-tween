const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack/hot/dev-server',
    './src/entrypoint',
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [path.resolve(__dirname, 'src')],
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?localIdentName=react-tween-[name]-[local]&modules', 'postcss', 'sass'],
        include: [path.resolve(__dirname, 'src')],
      },
    ],
  },
  devServer: {
    port: 8080,
    hot: true,
    inline: true,
    historyApiFallback: true,
  },
  postcss: [autoprefixer],
};
