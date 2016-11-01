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
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src')],
        loaders: ['babel', 'eslint'],
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src')],
        loaders: ['style', 'css?localIdentName=react-tween-[name]-[local]&modules', 'postcss', 'sass'],
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
